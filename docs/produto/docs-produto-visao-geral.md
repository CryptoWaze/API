# Visão geral do produto

Este documento descreve, em linguagem técnica mas de alto nível, **o que é o produto**, qual problema resolve e quais são os principais blocos que o compõem (hoje e no futuro próximo).

---

## 1. O que somos

- **Plataforma de rastreio forense de criptoativos** focada em:
  - vítimas de golpes,
  - escritórios de advocacia e peritos,
  - operações de compliance / investigação.
- Objetivo principal:
  - **reconstruir e explicar o caminho do dinheiro** em redes como Ethereum e BSC,
  - identificar pontos de saída para exchanges (hot wallets, deposit addresses),
  - gerar material técnico para **relatórios jurídicos** e provas.

Em vez de ser “só mais um explorer”, o produto é construído em volta do **conceito de caso**: cada caso tem seeds, fluxos, carteiras rotuladas, hot wallets identificadas e um relatório estruturado.

---

## 2. Problema que resolvemos

### 2.1. Do ponto de vista da vítima / advogado

- A vítima chega normalmente com **pouca informação estruturada**:
  - 1 ou mais hashes de transação,
  - valor perdido,
  - prints de aplicativo / conversas.
- Explorers tradicionais (Etherscan, BscScan, etc.) são:
  - difíceis de navegar para leigos,
  - não montam o fluxo completo nem agregam múltiplas transferências entre as mesmas carteiras,
  - não identificam automaticamente hot wallets de exchanges.

Nosso produto:

- parte de **seeds (hash + valor)** e monta um **fluxo visual** das transferências,
- identifica **quando e onde** os fundos entram em custody (exchanges, bridges),
- permite **editar o grafo** (nickname, posição, remoção de fluxos irrelevantes),
- gera um **pré-relatório técnico** pronto para ser anexado em peças jurídicas.

### 2.2. Do ponto de vista técnico

- APIs públicas (Covalent/GoldRush, outros indexadores) têm limitações:
  - rate limits,
  - falta de filtro por data/valor,
  - paginação pouco amigável para rastreios profundos.
- Precisamos de:
  - controle total sobre o **algoritmo de rastreio**,
  - um modelo de dados próprio (casos, flows, edges, hot wallets),
  - e, no futuro, uma camada de dados de blockchain independente.

---

## 3. Blocos principais do sistema (hoje)

### 3.1. API principal (NestJS + Postgres)

Responsável por:

- **Autenticação e usuários** (JWT).
- **Casos**:
  - `POST /cases` – criação de caso;
  - `GET /cases/:id` – recuperar o caso completo (seeds, flows, grafo, wallets, tokens, hot wallets);
  - `PATCH /cases/:id/edit` – edição em massa (nome, wallets, soft delete de flows e transações);
  - `GET /cases/history/:userId` – histórico de casos por usuário.
- **Rastreio**:
  - `GET /addresses/:address/flow-to-exchange` – rastreio básico;
  - `GET /addresses/:address/flow-to-exchange/full-history` – rastreio avançado (com grafo completo);
  - `GET /addresses/by-transaction/flow-to-exchange/full-history` – rastreio a partir de hash + valor (sem saber a carteira).
- **Transações**:
  - `POST /transactions/resolve` – resolver hash + valor e identificar a seed (carteira inicial, chain, transfers associadas).
- **Tokens**:
  - cron job com CoinGecko atualizando preços, market cap, etc., usado para converter movimentações em USD.
- **Relatórios**:
  - geração de pré-relatório técnico (HTML → PDF/DOCX), salvo em Cloudflare R2,
  - endpoints para listar e baixar relatórios de um caso.

### 3.2. Algoritmo de rastreio

- Implementado na camada de aplicação (`use-cases`):
  - rastreio básico: caminho único até hot wallet;
  - rastreio avançado: full-history, priorização por USD, branching controlado, grafo completo.
- Hoje alimentado pela Covalent/GoldRush (ports `ITransactionFetcher`, `IAddressTransfersFetcher`).
- Emite **progresso em tempo real** via WebSocket (mensagens amigáveis em português, endereços completos).

### 3.3. Modelo de dados forense (Postgres via Prisma)

- `Case`, `CaseSeedTransaction` – caso e seeds (hashes iniciais + valores).
- `Flow` – cada caminho rastreado (básico ou avançado), com status de endpoint.
- `FlowTransaction` – hops do caminho principal (para reporting e visual).
- `FlowEdge` – grafo completo de explorações (arestas entre carteiras, com timestamps e valores).
- `FlowWallet` – nós do grafo com nickname e posição (edição de layout e rótulos).
- `Chain`, `Exchange`, `HotWallet`, `Token` – catálogos de chains, exchanges, hot wallets e tokens.

---

## 4. Módulo de dados de blockchain (futuro próximo)

Estamos iniciando a construção de um **módulo interno de dados de blockchain**:

- Banco analítico ClickHouse com database `blockchain_data`.
- Tabelas para blocos, transações, logs e transfers por endereço.
- Tabelas de catálogo (`chains`, `exchanges`, `hot_wallets`, `tokens`).
- Sub-API interna `/_blockchain` ("Blockchain Data API") que expõe:
  - `GET /_blockchain/:chain/address/:address/transfers`;
  - `GET /_blockchain/:chain/address/:address/top-outbounds/full-history`.

Objetivo:

- **Substituir gradualmente** as chamadas à Covalent por consultas internas em cima do ClickHouse.
- Ganhar:
  - filtros de data/valor nativos,
  - performance (consultas em milissegundos),
  - independência de rate limits externos.

Esse módulo é tratado como se fosse uma **API externa**, mesmo morando dentro da mesma aplicação, o que facilita a transição e o isolamento de responsabilidades.

---

## 5. Experiência final desejada

Do ponto de vista do usuário (vítima/advogado):

1. Cadastra um caso com 1 ou mais hashes + valores.
2. Acompanha em tempo real, via frontend, o rastreio sendo construído (sockets, mensagens em português, grafos sendo preenchidos).
3. Ao final, tem:
   - um grafo navegável mostrando o caminho do dinheiro (flows, carteiras, hot wallets, deposit addresses),
   - possibilidade de editar rótulos e layout para explicar melhor a narrativa,
   - um **pré-relatório técnico** pronto para anexar em ações judiciais.

Do ponto de vista técnico:

- A arquitetura foi pensada para **crescer junto com o produto**:
  - hoje: Covalent + Postgres;
  - amanhã: módulo próprio de dados (ClickHouse) + possivelmente nós RPC;
  - tudo isso sem quebrar o contrato da aplicação de domínio (use cases e modelo de caso).

