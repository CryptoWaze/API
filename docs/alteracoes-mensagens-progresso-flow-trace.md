# Alterações nas mensagens de progresso do flow trace

Documento apenas das mudanças feitas nas mensagens enviadas ao frontend (WebSocket e graph), sem repetir o guia completo de integração.

---

## 1. Mensagens em português (evento `flow-trace-progress`)

As mensagens do evento **`flow-trace-progress`** deixaram de ser técnicas e passaram a ser em **português** e **amigáveis ao usuário**. O front pode exibir o campo `message` diretamente, sem tradução.

| Situação | Mensagem enviada (exemplo) |
|----------|----------------------------|
| Início do rastreio | `Iniciando rastreio do fluxo na rede {chain}. Carteira de partida: {endereço completo}.` |
| Buscando histórico (paginação) | `Buscando histórico de transferências da carteira... (página X, Y transferências encontradas até agora)` |
| Heartbeat / em andamento | `Rastreio em andamento. Analisando carteira na etapa X.` |
| Analisando uma carteira | `Analisando carteira na etapa X...` |
| Limite de 50 carteiras | `Limite máximo de carteiras analisadas atingido (50). Interrompendo rastreio.` |
| Exchange encontrada (carteira atual) | `Exchange encontrada. Carteira de destino identificada.` |
| Buscando outbounds | `Buscando todas as transferências de saída desta carteira...` |
| Outbounds recebidos | `Foram encontradas X transferências de saída. Verificando destinos...` |
| Carteira sem saídas | `Esta carteira não possui transferências de saída no histórico. Voltando para tentar outro caminho.` |
| Exchange no histórico | `Exchange encontrada. Uma das transferências desta carteira vai direto para uma exchange cadastrada.` |
| Seguindo transferência | `Seguindo transferência de X {symbol} para a próxima carteira...` |
| Ramificação esgotada | `Todos os caminhos possíveis a partir desta carteira já foram tentados. Voltando para tentar outra ramificação.` |
| Fim sem exchange | `Rastreio finalizado. Nenhuma exchange foi encontrada no caminho. Última carteira analisada: {endereço}. Motivo: {motivo em português}.` |

O campo **`reason`** do payload, quando presente, também passa a vir em texto amigável, por exemplo:

- `Carteira sem transferências de saída no histórico`
- `Limite máximo de carteiras analisadas (50)`
- `Todos os caminhos desta ramificação já foram tentados`

---

## 2. Endereços completos (sem abreviação)

- Nos payloads de **`flow-trace-progress`**, os campos **`address`**, **`nextAddress`** e **`lastWallet`** passam a ser sempre o **endereço completo** (ex.: `0x520e6b02925c77f165eeb57e74be051ca94bf2ce`), e não mais a forma abreviada (`0x520e...bf2ce`).
- Na resposta HTTP do flow (campo **`graph`**), os nós continuam com **`id`** igual ao endereço completo; o **`label`** de cada nó agora também é o **endereço completo** (antes era abreviado). O front pode continuar truncando na UI se quiser, mas o dado disponível é o endereço integral para uso forense.

---

## 3. Campos do payload (resumo do que mudou)

| Campo | Antes | Agora |
|-------|--------|--------|
| `message` | Texto técnico em inglês (ex.: "NO_OUTBOUND depth=1 addr=0x520e...") | Texto em português, amigável (ex.: "Esta carteira não possui transferências de saída...") |
| `address` | Endereço abreviado | Endereço completo |
| `nextAddress` | Endereço abreviado | Endereço completo |
| `lastWallet` | Endereço abreviado | Endereço completo |
| `reason` | Código (ex.: NO_OUTBOUND, EXHAUSTED_OPTIONS) | Texto em português (ex.: "Carteira sem transferências de saída no histórico") |
| `graph.nodes[].label` | Endereço abreviado | Endereço completo (igual a `id`) |
| `depth` | Índice 0-based | Continua numérico; nas mensagens usamos “etapa X” com valor 1-based (depth + 1) |

Nenhum campo foi removido nem renomeado; apenas o **conteúdo** de `message`, `reason`, dos endereços e de `graph.nodes[].label` foi alterado conforme acima.
