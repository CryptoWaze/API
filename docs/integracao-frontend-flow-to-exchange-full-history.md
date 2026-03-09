# Integração frontend: endpoint Flow to Exchange (full history)

Este documento descreve como consumir os endpoints **Flow to Exchange (histórico completo)** no frontend: por **carteira + chain** ou por **hash + valor** (sem precisar saber a carteira). Inclui URL, parâmetros, formatos de sucesso e erro, e como usar o `graph` para montar o fluxograma visual.

---

## 1. Visão geral

Há **dois** jeitos de disparar o mesmo rastreio:

### 1.1 Por carteira e chain (quando o usuário já sabe a carteira inicial)

| Item | Valor |
|------|--------|
| **Método** | `GET` |
| **Caminho** | `/addresses/:address/flow-to-exchange/full-history` |
| **Query obrigatória** | `chain` (slug da chain) |
| **Descrição** | Rastreia o fluxo a partir de uma carteira conhecida até uma hot wallet. Retorna `steps`, `graph` (nodes, edges) e, em caso de sucesso, `endpointAddress`. |

### 1.2 Por hash da transação e valor (quando o usuário tem só a hash e o valor reportado)

| Item | Valor |
|------|--------|
| **Método** | `GET` |
| **Caminho** | `/addresses/by-transaction/flow-to-exchange/full-history` |
| **Query obrigatória** | `txHash`, `reportedLossAmount` (valor numérico da transferência a rastrear) |
| **Descrição** | Resolve a transação pela hash (como em `POST /transactions/resolve`), identifica a **carteira de destino** da transferência cujo valor mais se aproxima de `reportedLossAmount`, descobre a chain, e em seguida executa o mesmo rastreio completo. O front não precisa informar carteira nem chain. Retorno idêntico ao endpoint por address+chain (`steps`, `graph`, `endpointAddress`). Aceita `traceId` opcional para progresso via WebSocket. |

**Base URL (exemplo):** `https://api.exemplo.com` ou `http://localhost:3000` em desenvolvimento.

---

## 2. Request (endpoint por carteira + chain)

### 2.1 URL e parâmetros

- **Path param**
  - `address` (string, obrigatório): endereço da carteira de partida (ex.: `0x520e6b02925c77f165eeb57e74be051ca94bf2ce`). Não pode ser vazio (após trim).
- **Query params**
  - `chain` (string, obrigatório): slug da chain (ex.: `bsc`, `eth`, `avalanche`, `tron`). Não pode ser vazio (após trim).
  - `traceId` (string, opcional): ID do rastreio (ex.: UUID). Se informado, o backend envia o progresso em tempo real via WebSocket no evento `flow-trace-progress`. O frontend deve conectar ao socket, enviar `subscribe-flow-trace` com o mesmo `traceId` e depois chamar este endpoint (ver seção 2.4).

### 2.2 Exemplos de request

```http
GET /addresses/0x520e6b02925c77f165eeb57e74be051ca94bf2ce/flow-to-exchange/full-history?chain=bsc
```

```text
GET /addresses/0x2c81ed070ab948d2454dca978c09990432a7c672/flow-to-exchange/full-history?chain=eth
```

### 2.3 Validação no frontend (recomendado)

Antes de chamar a API, valide no frontend:

- `address`: string não vazia após trim (ex.: bloqueie envio se estiver vazio).
- `chain`: string não vazia após trim.

Se enviar `address` ou `chain` vazios, o backend responde **400** (ver seção 5.1).

### 2.4 Progresso em tempo real (WebSocket)

Para exibir o progresso do rastreio ao usuário enquanto a requisição HTTP está em andamento:

1. **Gerar um `traceId`** no frontend (ex.: `crypto.randomUUID()`).
2. **Conectar ao WebSocket** (Socket.IO) no mesmo host da API.
3. **Inscrever-se na sala do rastreio:** enviar o evento `subscribe-flow-trace` com payload `{ traceId: "<seu-traceId>" }`. O servidor coloca o cliente nessa sala; todas as mensagens de progresso daquele rastreio serão enviadas só para quem está na sala.
4. **Ouvir o evento `flow-trace-progress`:** cada payload tem a forma:
   ```ts
   interface FlowTraceProgressPayload {
     message: string;        // texto em português, amigável ao usuário (sempre presente)
     depth?: number;         // etapa atual (1-based), ex.: 1, 2, 3...
     address?: string;       // endereço COMPLETO da carteira (rastreio forense)
     stackLength?: number;
     stackRemaining?: number;
     count?: number;         // ex.: quantidade de transferências de saída encontradas
     page?: number;         // ex.: página do histórico (1-based)
     totalTransfers?: number;
     nextAddress?: string;   // endereço COMPLETO da próxima carteira
     symbol?: string;
     amount?: number;
     reason?: string;        // texto amigável, ex.: "Carteira sem transferências de saída no histórico"
     lastWallet?: string;    // endereço COMPLETO da última carteira analisada
   }
   ```
   Todas as mensagens (`message`) vêm em português e em linguagem acessível. Os campos `address`, `nextAddress` e `lastWallet` trazem sempre o endereço completo (não abreviado), para uso forense.
5. **Chamar o endpoint HTTP** com o mesmo `traceId` na query:  
   `GET .../flow-to-exchange/full-history?chain=bsc&traceId=<seu-traceId>`.

Ordem recomendada: conectar ao socket → enviar `subscribe-flow-trace` → chamar o GET. Assim não se perde nenhuma mensagem de progresso.

Exemplo (Socket.IO client):

```ts
const traceId = crypto.randomUUID();
socket.emit('subscribe-flow-trace', { traceId });
socket.on('flow-trace-progress', (payload: FlowTraceProgressPayload) => {
  console.log(payload.message);
  // Atualizar UI: payload.depth, payload.address, etc.
});
const res = await fetch(
  `${API_BASE}/addresses/${address}/flow-to-exchange/full-history?chain=${chain}&traceId=${traceId}`
);
```

---

## 2.5 Request (endpoint por hash + valor)

Use quando o usuário tem apenas **hash da transação** e **valor reportado** (sem carteira nem chain).

- **Caminho:** `GET /addresses/by-transaction/flow-to-exchange/full-history`
- **Query params**
  - `txHash` (string, obrigatório): hash da transação (ex.: `0x4199be011e1e861b7b43274cc180359a64022cc32055993560870278dce46ff8`).
  - `reportedLossAmount` (número, obrigatório): valor reportado da perda / valor da transferência a rastrear (ex.: `2324`). Usado para escolher, entre as transferências da tx, qual é a “semente” (a mais próxima desse valor); a carteira de destino dessa transferência é o início do rastreio.
  - `traceId` (string, opcional): mesmo uso do endpoint por address+chain para progresso via WebSocket.

Exemplo:

```http
GET /addresses/by-transaction/flow-to-exchange/full-history?txHash=0x4199be011e1e861b7b43274cc180359a64022cc32055993560870278dce46ff8&reportedLossAmount=2324
```

Com progresso em tempo real:

```http
GET /addresses/by-transaction/flow-to-exchange/full-history?txHash=0x4199...&reportedLossAmount=2324&traceId=abc-123-uuid
```

O backend resolve a transação nas chains suportadas (eth-mainnet, bsc-mainnet), escolhe a transferência cujo valor mais se aproxima de `reportedLossAmount`, usa o `to` dessa transferência como carteira inicial e o slug da chain onde a tx foi encontrada, e executa o mesmo fluxo do endpoint por address+chain. O formato da resposta (200, 404, 400, 502, 500) e o uso do `graph` são **idênticos** às seções 3, 4 e 5 abaixo.

**404** neste endpoint pode significar: transação não encontrada em nenhuma chain; ou não foi possível identificar a carteira de destino (ex.: valor inválido); ou nenhum fluxo até exchange encontrado (nesse caso o body inclui `graph` como no outro endpoint).

---

## 3. Response de sucesso (HTTP 200)

Quando existe um caminho até uma hot wallet cadastrada, a API retorna **200** e um objeto com `success: true`, o caminho em `steps`, o endereço de destino e o **graph** para o fluxograma.

### 3.1 Estrutura do body (TypeScript)

```ts
interface FlowGraphNode {
  id: string;      // endereço completo (ex.: 0x520e6b02925c77f165eeb57e74be051ca94bf2ce)
  label: string;   // endereço encurtado (ex.: 0x520e...bf2ce)
}

interface FlowGraphEdge {
  from: string;
  to: string;
  symbol: string;
  amount: number;
  amountRaw: string;
  txHash: string;
  outcome?: 'SUCCESS' | 'NO_OUTBOUND' | 'MAX_WALLETS_REACHED' | 'EXHAUSTED_OPTIONS';
}

interface FlowGraph {
  nodes: FlowGraphNode[];
  edges: FlowGraphEdge[];
}

interface WalletTransfer {
  type: 'native' | 'erc20';
  symbol: string;
  from: string;
  to: string;
  rawAmount: string;
  amount: number;
  timestamp: string;
  txHash: string;
  contract?: string;
  direction: 'IN' | 'OUT';
  counterparty: string;
}

interface FlowStep {
  fromAddress: string;
  toAddress: string;
  transfer: WalletTransfer;
}

interface SuccessResponse {
  success: true;
  chain: string;
  steps: FlowStep[];
  endpointAddress: string;
  graph: FlowGraph;
}
```

### 3.2 Exemplo real (200)

```json
{
  "success": true,
  "chain": "bsc",
  "steps": [
    {
      "fromAddress": "0x520e6b02925c77f165eeb57e74be051ca94bf2ce",
      "toAddress": "0x5f1613eb98030bbb26006fc771f3de399740493b",
      "transfer": {
        "type": "erc20",
        "symbol": "USDT",
        "from": "0x520e6b02925c77f165eeb57e74be051ca94bf2ce",
        "to": "0x5f1613eb98030bbb26006fc771f3de399740493b",
        "rawAmount": "5000000000000000000000",
        "amount": 5000,
        "timestamp": "2025-01-16T01:47:39Z",
        "txHash": "0x0cef5cad6385c38e63d86ca64dc7b24b8b8043afa8986d2a97e849dbe7297edd",
        "direction": "OUT",
        "counterparty": "0x5f1613eb98030bbb26006fc771f3de399740493b"
      }
    },
    {
      "fromAddress": "0x5f1613eb98030bbb26006fc771f3de399740493b",
      "toAddress": "0xe322eab8cd07566a5fce23248633601725a6505f",
      "transfer": {
        "type": "erc20",
        "symbol": "USDT",
        "rawAmount": "5000000000000000000000",
        "amount": 5000,
        "timestamp": "2025-01-19T03:04:56Z",
        "txHash": "0xefb52a4e57e7a343ec08f48b227942b6a14ea8eb90ce9e25001402a9f987a518",
        "direction": "OUT",
        "counterparty": "0xe322eab8cd07566a5fce23248633601725a6505f"
      }
    }
  ],
  "endpointAddress": "0x8894e0a0c962cb723c1976a4421c95949be2d4e3",
  "graph": {
    "nodes": [
      { "id": "0x520e6b02925c77f165eeb57e74be051ca94bf2ce", "label": "0x520e...bf2ce" },
      { "id": "0x5f1613eb98030bbb26006fc771f3de399740493b", "label": "0x5f16...493b" },
      { "id": "0xe322eab8cd07566a5fce23248633601725a6505f", "label": "0xe322...6505f" },
      { "id": "0x8894e0a0c962cb723c1976a4421c95949be2d4e3", "label": "0x8894...d4e3" }
    ],
    "edges": [
      {
        "from": "0x520e6b02925c77f165eeb57e74be051ca94bf2ce",
        "to": "0x5f1613eb98030bbb26006fc771f3de399740493b",
        "symbol": "USDT",
        "amount": 5000,
        "amountRaw": "5000000000000000000000",
        "txHash": "0x0cef5cad6385c38e63d86ca64dc7b24b8b8043afa8986d2a97e849dbe7297edd",
        "outcome": "SUCCESS"
      },
      {
        "from": "0x5f1613eb98030bbb26006fc771f3de399740493b",
        "to": "0xe322eab8cd07566a5fce23248633601725a6505f",
        "symbol": "USDT",
        "amount": 5000,
        "amountRaw": "5000000000000000000000",
        "txHash": "0xefb52a4e57e7a343ec08f48b227942b6a14ea8eb90ce9e25001402a9f987a518",
        "outcome": "SUCCESS"
      }
    ]
  }
}
```

### 3.3 Uso no frontend (200)

- **Caminho de sucesso (lista):** use `response.steps` para exibir o caminho passo a passo (origem → destino em cada step).
- **Hot wallet de destino:** `response.endpointAddress`.
- **Fluxograma:** use `response.graph.nodes` e `response.graph.edges` na lib de grafo (React Flow, Cytoscape, etc.):
  - **nodes:** cada nó tem `id` (endereço completo) e `label` (para exibir no UI).
  - **edges:** cada aresta tem `from`, `to`, `symbol`, `amount`, `txHash` e opcionalmente `outcome` (no 200, normalmente `SUCCESS`).

---

## 4. Response quando não encontra hot wallet (HTTP 404)

Quando o algoritmo explora até o limite (50 carteiras) ou esgota ramos sem achar hot wallet, a API retorna **404**. O body traz os dados do que foi explorado, incluindo o **graph**, para o frontend desenhar o fluxo mesmo em “falha”.

### 4.1 Estrutura do body (404)

O backend envia um objeto que pode vir dentro de `message` (dependendo do Nest) ou como body direto. Em qualquer caso, o body deve conter (ou estar dentro de) algo equivalente a:

```ts
interface FailureResponse {
  success: false;
  chain: string;
  reason: 'NO_OUTBOUND' | 'MAX_WALLETS_REACHED' | 'EXHAUSTED_OPTIONS';
  lastWallet: string;
  steps: FlowStep[];
  graph: FlowGraph;
  message?: string;
}
```

- **reason**
  - `NO_OUTBOUND`: alguma carteira no caminho não tinha transferências de saída no histórico.
  - `MAX_WALLETS_REACHED`: limite de 50 carteiras atingido sem encontrar hot wallet.
  - `EXHAUSTED_OPTIONS`: todos os ramos tentados (backtrack) sem achar hot wallet.
- **lastWallet**: última carteira considerada antes de parar.
- **steps**: passos do caminho até `lastWallet` (ou último ramo).
- **graph**: mesmo formato do 200; use para desenhar o grafo explorado e estilizar por `edge.outcome`.

### 4.2 Exemplo de body (404)

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": {
    "message": "Nenhum fluxo até exchange encontrado (máx. 50 carteiras).",
    "success": false,
    "chain": "bsc",
    "reason": "NO_OUTBOUND",
    "lastWallet": "0x5f162bff24e6adc7d0aa7c75a33ef417b7a1493b",
    "steps": [
      {
        "fromAddress": "0x520e6b02925c77f165eeb57e74be051ca94bf2ce",
        "toAddress": "0x5f162bff24e6adc7d0aa7c75a33ef417b7a1493b",
        "transfer": {
          "type": "erc20",
          "symbol": "USDT",
          "amount": 5000,
          "txHash": "0x14834990a150c328e1cc767fb35f1ef251029c57d3d46be410a9a6fd8493478d",
          "direction": "OUT",
          "counterparty": "0x5f162bff24e6adc7d0aa7c75a33ef417b7a1493b"
        }
      }
    ],
    "graph": {
      "nodes": [
        { "id": "0x520e6b02925c77f165eeb57e74be051ca94bf2ce", "label": "0x520e...bf2ce" },
        { "id": "0x5f162bff24e6adc7d0aa7c75a33ef417b7a1493b", "label": "0x5f16...493b" }
      ],
      "edges": [
        {
          "from": "0x520e6b02925c77f165eeb57e74be051ca94bf2ce",
          "to": "0x5f162bff24e6adc7d0aa7c75a33ef417b7a1493b",
          "symbol": "USDT",
          "amount": 5000,
          "amountRaw": "5000000000000000000000",
          "txHash": "0x14834990a150c328e1cc767fb35f1ef251029c57d3d46be410a9a6fd8493478d",
          "outcome": "NO_OUTBOUND"
        }
      ]
    }
  }
}
```

**Nota:** Em alguns setups do Nest, o conteúdo útil pode estar em `response.data.message` ou diretamente em `response.data`. Trate no frontend os dois formatos (body com `message` objeto ou body plano com `success`, `graph`, etc.).

### 4.3 Uso no frontend (404)

- Exibir mensagem amigável conforme `reason` (ex.: “Carteira sem saídas no histórico”, “Limite de 50 carteiras atingido”, “Todos os ramos explorados”).
- Extrair `graph` (de `body.graph` ou `body.message.graph`) e montar o mesmo fluxograma.
- Estilizar arestas por `edge.outcome`:
  - `SUCCESS` → verde / caminho que chegou em hot wallet.
  - `NO_OUTBOUND` → vermelho / fim por falta de saídas.
  - `EXHAUSTED_OPTIONS` → cinza / ramo esgotado.
  - `MAX_WALLETS_REACHED` → laranja / parada por limite.

---

## 5. Erros de cliente e servidor

### 5.1 Bad Request (400)

- **Quando:** `address` ou `chain` vazios ou inválidos (ex.: query sem `chain`).
- **Body típico (Nest):**

```json
{
  "statusCode": 400,
  "message": "address: Required; chain: Required",
  "error": "Bad Request"
}
```

- **Ação no front:** validar `address` e `chain` antes de enviar; exibir mensagens de validação a partir de `message`.

### 5.2 Bad Gateway (502)

- **Quando:** falha na API externa de blockchain (ex.: Covalent 500/502/503).
- **Body típico:**

```json
{
  "statusCode": 502,
  "message": "Serviço de transações temporariamente indisponível. Tente novamente mais tarde.",
  "error": "Bad Gateway"
}
```

- **Ação no front:** exibir “Serviço indisponível” e sugerir tentar de novo depois.

### 5.3 Internal Server Error (500)

- **Quando:** erro inesperado no backend (ex.: timeout, falha de rede interna).
- **Body típico:**

```json
{
  "statusCode": 500,
  "message": "Erro ao rastrear fluxo até exchange.",
  "error": "Internal Server Error"
}
```

- **Ação no front:** mensagem genérica de erro e opção de tentar novamente.

---

## 6. Tempo de resposta e loading

- O endpoint pode demorar **vários segundos ou minutos** (histórico paginado, várias carteiras, throttling da API externa).
- No frontend:
  - Mostrar loading/indicador de progresso durante a chamada.
  - Considerar timeout alto (ex.: 3–5 minutos) ou streaming/WebSocket se no futuro houver suporte a progresso em tempo real.

---

## 7. Exemplo de consumo (fetch + tipagem)

```ts
const BASE_URL = 'https://api.exemplo.com'; // ou import de config

type FlowGraphNode = { id: string; label: string };
type FlowGraphEdge = {
  from: string;
  to: string;
  symbol: string;
  amount: number;
  amountRaw: string;
  txHash: string;
  outcome?: 'SUCCESS' | 'NO_OUTBOUND' | 'MAX_WALLETS_REACHED' | 'EXHAUSTED_OPTIONS';
};
type FlowGraph = { nodes: FlowGraphNode[]; edges: FlowGraphEdge[] };

type SuccessPayload = {
  success: true;
  chain: string;
  steps: Array<{ fromAddress: string; toAddress: string; transfer: Record<string, unknown> }>;
  endpointAddress: string;
  graph: FlowGraph;
};

type FailurePayload = {
  success: false;
  chain: string;
  reason: string;
  lastWallet: string;
  steps: unknown[];
  graph: FlowGraph;
};

async function getFlowToExchangeFullHistory(
  address: string,
  chain: string,
): Promise<{ ok: true; data: SuccessPayload } | { ok: false; status: number; data: FailurePayload | { message: string } }> {
  const url = `${BASE_URL}/addresses/${encodeURIComponent(address)}/flow-to-exchange/full-history?chain=${encodeURIComponent(chain)}`;
  const res = await fetch(url);

  const data = await res.json();

  if (res.ok) {
    return { ok: true, data: data as SuccessPayload };
  }

  if (res.status === 404) {
    const payload = data.message && typeof data.message === 'object' ? data.message : data;
    return { ok: false, status: 404, data: payload as FailurePayload };
  }

  return { ok: false, status: res.status, data: data as { message: string } };
}

// Uso
const address = '0x520e6b02925c77f165eeb57e74be051ca94bf2ce';
const chain = 'bsc';

const result = await getFlowToExchangeFullHistory(address, chain);

if (result.ok) {
  const { graph, steps, endpointAddress } = result.data;
  console.log('Hot wallet:', endpointAddress);
  console.log('Passos:', steps.length);
  console.log('Nós no grafo:', graph.nodes.length);
  console.log('Arestas no grafo:', graph.edges.length);
  // Enviar graph.nodes e graph.edges para React Flow / Cytoscape
} else {
  if (result.status === 404 && 'graph' in result.data) {
    const failure = result.data as FailurePayload;
    console.log('Motivo:', failure.reason);
    console.log('Última carteira:', failure.lastWallet);
    // Montar fluxograma com failure.graph e estilizar por outcome
  } else {
    console.error('Erro:', result.data.message ?? result.status);
  }
}
```

---

## 8. Mapeando para React Flow (exemplo)

Se usar React Flow, você pode converter `graph` em `nodes` e `edges` no formato da lib:

```ts
import type { Node, Edge } from '@xyflow/react';

function flowGraphToReactFlow(
  graph: FlowGraph,
  options?: { nodeWidth?: number; nodeHeight?: number },
): { nodes: Node[]; edges: Edge[] } {
  const { nodeWidth = 180, nodeHeight = 40 } = options ?? {};
  let y = 0;
  const nodes: Node[] = graph.nodes.map((n, i) => ({
    id: n.id,
    type: 'default',
    position: { x: 0, y: y + i * (nodeHeight + 16) },
    data: { label: n.label },
  }));
  const edges: Edge[] = graph.edges.map((e, i) => ({
    id: `e-${e.from}-${e.to}-${i}`,
    source: e.from,
    target: e.to,
    data: { symbol: e.symbol, amount: e.amount, outcome: e.outcome },
  }));
  return { nodes, edges };
}

// Uso após receber response 200 ou 404 com graph
const { nodes, edges } = flowGraphToReactFlow(response.graph);
// setNodes(nodes); setEdges(edges);
```

Você pode estilizar `edges` no React Flow conforme `data.outcome` (cor, tracejado, etc.).

---

## 9. Resumo rápido

| Status | Situação | O que fazer no frontend |
|--------|----------|--------------------------|
| **200** | Caminho até hot wallet encontrado | Usar `steps`, `endpointAddress` e `graph` para lista + fluxograma. |
| **404** | Nenhum caminho até hot wallet | Mostrar mensagem por `reason` e desenhar fluxo com `graph`; estilizar por `edge.outcome`. |
| **400** | Parâmetros inválidos | Validar `address` e `chain`; exibir `message`. |
| **502** | API externa indisponível | Mensagem “Tente novamente mais tarde”. |
| **500** | Erro interno | Mensagem genérica e retry. |

Sempre que houver **200** ou **404**, o body (ou `message` dentro dele) contém **graph** com **nodes** e **edges** prontos para o fluxograma visual.
