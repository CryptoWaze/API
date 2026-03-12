# Avaliação do sistema — Perspectiva de CTO

Documento de análise técnica e arquitetural do backend da API de Rastreio Forense de Criptomoedas, com foco em arquitetura, padrões, qualidade de código e perfil do desenvolvedor responsável.

---

## Contexto do prazo

**O backend foi construído em 7 dias.** O MVP sobe em **mais 7 dias**. Muita coisa que hoje aparece como "faltante" ou "dívida" está naturalmente fora do escopo dessa primeira entrega e deve entrar na sequência (testes, refatoração de use cases grandes, ports de persistência, relatório PDF/DOCX, etc.). Esta avaliação considera esse contexto: o que está pronto é o que precisava estar para o MVP; o restante são recomendações para o pós-MVP ou para quando houver fôlego.

---

## 1. Visão geral

O sistema é uma **API NestJS** para **rastreio forense de criptomoedas**: criação de casos a partir de transações-semente, rastreio de fluxos até exchanges/hot wallets, resolução de transações via Covalent, histórico de endereços e integração em tempo real via Socket.IO. O domínio é complexo (grafo de fluxos, múltiplas chains, hot wallets, tokens) e o backend lida bem com essa complexidade em vários pontos.

**Stack:** NestJS 11, TypeScript 5.7, Prisma 7, PostgreSQL (Neon), Zod, JWT, Socket.IO, Swagger. Escolhas sólidas e atuais.

**Impressão inicial:** Para 7 dias de trabalho, o resultado é **muito forte**. Quem desenhou isso conhece Clean Architecture e aplicou o que dava no prazo. Há ports para serviços externos (Covalent, CoinGecko, hot-wallet checker, flow-trace log, progress emitter), use cases nomeados e separados, e documentação de integração com o front. As violações de camada (Prisma e Socket no core) e o use case grande são esperáveis nesse ritmo; o importante é que a base está boa para evoluir assim que o MVP estiver no ar e muita coisa faltante ainda vai entrar.

---

## 2. Arquitetura

### 2.1 O que está bem feito

- **Ports para infraestrutura externa:** `ITransactionFetcher`, `IAddressTransfersFetcher`, `IHotWalletChecker`, `IFlowTraceLogWriter`, `IFlowTraceProgressEmitter`, `ITokenPriceProvider` estão na camada de aplicação e são implementados na infra. Injeção por token (`@Inject(TRANSACTION_FETCHER)`) mantém o core desacoplado das APIs e do Socket.
- **Use cases como orquestradores:** A maioria dos use cases tem uma responsabilidade clara (resolve transaction, get case by id, update flow wallet, soft delete, etc.) e recebe input validado (Zod) e dependências por construtor.
- **Validação na borda:** Schemas Zod em `application/schemas` e uso de `safeParse` nos controllers, com mensagens de erro concatenadas em 400. Boa separação entre contrato da API e regras de validação.
- **Documentação da API:** Swagger com `@ApiOperation`, `@ApiBody`, `@ApiResponse`, `@ApiParam`, Bearer JWT e textos em português. Facilita contrato com o front e onboarding.
- **Documentação de produto:** `docs/` com especificação de relatório, integração front (flow-to-exchange, resolve transaction), alterações de mensagens de progresso e análise do schema. Indica preocupação com alinhamento e rastreabilidade.
- **Auth e autorização:** Guard JWT, `CurrentUser`, e checagem de dono do caso (ex.: `get-case-by-id`, `getHistory` com `userId` do token). Rotas sensíveis protegidas de forma consistente.
- **Background job “case creation”:** Caso criado com status PROCESSING, processamento assíncrono com `void this.runInBackground(...)`, resposta 202 com `traceId`/`caseId` e evento `case-created` no socket. Padrão adequado para operação longa.

### 2.2 Pontos a evoluir (pós-MVP ou quando houver fôlego)

- **Use cases dependem diretamente de infraestrutura:** Vários use cases importam e usam `PrismaService` e tipos do `generated/prisma` (ex.: `CaseStatus`, `FlowEndpointReason`). Na Clean Architecture, a aplicação não deveria depender de detalhes de persistência; o ideal seria ports (ex.: `ICaseRepository`, `IFlowRepository`) com tipos de domínio. Para o MVP está aceitável; quando for evoluir persistência ou trocar ORM, vale extrair esses ports.
- **CreateCaseUseCase depende da camada de apresentação:** Importa `SocketGateway` de `presentation/socket`. O use case orquestra regra de negócio e, ao final, emite evento de “caso criado”. Esse “emissor de evento” poderia ser um port (ex.: `ICaseCreatedNotifier`), implementado pelo gateway. Dá para deixar para uma refatoração depois do MVP.
- **Domain vazio:** A pasta `domain/` existe mas está vazia (apenas `index.ts`). Entidades e enums estão no Prisma e tipos em `application/types`. Quando o produto estabilizar, dá para ir populando com entidades e value objects em refactors pontuais.
- **Constantes e regras espalhadas:** `CHAINS`, `MAX_WALLETS`, `MAX_PAGES_PER_WALLET`, `BRANCH_CANDIDATES_PER_WALLET`, etc. estão dentro de use cases ou no topo do arquivo. Centralizar em config ou módulo de domínio ajuda quando forem adicionar novas chains ou limites configuráveis — pode entrar na lista de melhorias pós-MVP.

---

## 3. Qualidade de código e padrões

### 3.1 Pontos positivos

- **Nomes em inglês, mensagens ao usuário em português:** Alinhado às regras do projeto; ajuda manutenção e i18n futura.
- **Funções auxiliares bem nomeadas:** `normalizeAddress`, `chainToSlug`, `mapToEndpointReason`, `parseTimestamp`, `filterOutboundsAboveMin`, `buildGraph`, `edgesToLogInput`, `markPathEdgesSuccess`, `friendlyReason` — intenção clara e reuso.
- **Tipos explícitos:** Uso de tipos e interfaces (Zod infer, DTOs, `TraceSuccess`/`TraceFailure`, `EdgeRecord`, etc.) melhora segurança e documentação.
- **Tratamento de erros em use cases críticos:** `ResolveTransactionUseCase` e `FollowFlowToExchangeFullHistoryUseCase` tratam exceções, logam e remapeiam erros da Covalent (ex.: 500/502/503) para `BadGatewayException` com mensagem amigável; demais erros para `InternalServerErrorException`. Boa experiência para o consumidor da API.
- **Optional progress emitter:** `@Optional() @Inject(FLOW_TRACE_PROGRESS_EMITTER)` permite rodar o rastreio sem Socket (ex.: testes ou jobs em background) sem quebrar.

### 3.2 Pontos a evoluir (pós-MVP ou quando houver fôlego)

- **CreateCaseUseCase e FollowFlowToExchangeFullHistoryUseCase muito grandes:** O primeiro tem ~400 linhas com `runInBackground` fazendo resolve, flow, persistência, branching “advanced”, status e evento; o segundo ~700 linhas com algoritmo iterativo, grafo, logs, progresso e preços. Para 7 dias, é compreensível; quando for refatorar, vale extrair “serviços de aplicação” ou sub-use-cases (ex.: “PersistFlow”, “RunBranchingFlows”, “TraceFlowAlgorithm”) e manter o use case principal como orquestrador fino.
- **Duplicação de lógica de negócio:** `normalizeAddress`, `chainToSlug`, `parseTimestamp` e semelhantes aparecem em mais de um use case. Unificar em um módulo compartilhado (domain ou shared/utils) é melhoria para depois do MVP.
- **Magic numbers e strings:** Ex.: `BRANCH_CANDIDATES_PER_WALLET = 2`, `OUTBOUNDS_LIMIT = 100`, `MAX_WALLETS = 50`. Concentrar em config ou constantes de domínio facilita tuning quando forem evoluir limites — pode entrar na lista pós-MVP.
- **catch genérico em runInBackground:** O `catch` em `runInBackground` não loga o erro; apenas atualiza o caso para FAILED e emite o evento. **Vale corrigir antes ou logo após o MVP:** adicionar um `Logger` e logar o erro (e, se possível, um identificador no evento) para não ficar no escuro em produção.
- **Rota GET history/:userId:** O path sugere “histórico de qualquer usuário”, mas o controller valida e usa o userId do token. Funcionalmente correto; se sobrar tempo, considerar `GET /cases/history` ou `GET /me/cases` para clareza da API.

---

## 4. Testes e confiabilidade

- **Testes unitários:** Não há `*.spec.ts` na pasta `src/`. Jest está configurado, mas nenhum arquivo atende. Em 7 dias é normal priorizar funcionalidade; **depois que o MVP estiver no ar**, vale priorizar testes para: (1) use cases “simples” (resolve-transaction, get-case-by-id, update-case, soft-delete), (2) funções puras extraídas do follow-flow (normalize, buildGraph, pickTopOutboundsByUsd, etc.), (3) criação de caso com mocks de Prisma e Socket. Assim refatorações e novas features ganham rede de segurança.
- **Testes E2E:** Existe um teste e2e que sobe o `AppModule` e valida `GET /` (200, “Hello World!”). Útil como smoke; E2E de fluxos de negócio (criar caso, resolver transação, rastrear fluxo) podem entrar no backlog pós-MVP.

---

## 5. Segurança e operação

- **CORS:** Configurável via `CORS_ORIGIN`; fallback para localhost. Adequado.
- **Swagger em produção:** Desligado quando `NODE_ENV === 'production'`, reduzindo superfície de informação.
- **Console em produção:** Regras do projeto pedem evitar `console.*` em produção; em `main.ts` o `console.log` está dentro de `NODE_ENV !== 'production'`, então está ok. Vale garantir que nenhum outro ponto use console em código de produção; um logger inyectable (ex.: Nest Logger ou Pino) seria o próximo passo para logs estruturados.
- **Secrets:** Uso de `@nestjs/config` e variáveis de ambiente para DB e JWT é o esperado. Documentação de relatório menciona R2 (S3); credentials devem ficar apenas em env.

---

## 6. Resumo de recomendações (priorizado)

**Antes ou logo após o MVP (foco em não quebrar em produção):**

1. **Logging no catch de `runInBackground`:** Adicionar um `Logger` e logar o erro (e, se possível, um identificador no evento) para diagnóstico quando o caso falhar.

**Pós-MVP / quando houver fôlego:**

2. Introduzir ports para persistência (Case, Flow, Seed, etc.) e fazer use cases dependerem desses ports em vez de `PrismaService`; criar port `ICaseCreatedNotifier` e tirar a dependência direta de `SocketGateway` do CreateCaseUseCase.
3. Extrair funções puras e constantes compartilhadas (normalize, chainToSlug, config de limites) para um módulo reutilizável; escrever testes unitários para elas e para use cases “simples”.
4. Quebrar `CreateCaseUseCase.runInBackground` e `FollowFlowToExchangeFullHistoryUseCase` em componentes menores (persistência de flow, branching, algoritmo de rastreio), mantendo os use cases como orquestradores.
5. Considerar rota `GET /cases/history` (ou `GET /me/cases`) em vez de `GET /cases/history/:userId` para clareza da API.
6. Popular a camada `domain` com entidades e value objects em refactors pontuais; não é urgente.

---

## 7. Perfil do desenvolvedor backend (inferência)

Com base no código, na estrutura do repositório e nas escolhas técnicas, segue uma leitura possível do perfil do dev backend — lembrando que é inferência, não fato.

- **Experiência:** Provavelmente **3 a 6 anos** em desenvolvimento backend. Conhece NestJS, Prisma, Clean/Hexagonal o suficiente para aplicar ports para serviços externos e separar use cases; ainda mistura persistência e apresentação no core quando a entrega é mais urgente.
- **Cargo:** Desenvolvedor backend pleno ou senior em time pequeno; possível atuação como “tech lead” informal do backend (define estrutura de pastas, padrões de validação e documentação).
- **Características técnicas:** Organizado (pastas por feature, schemas centralizados, docs de integração), pragmático (não persegue pureza arquitetural a qualquer custo), confortável com domínios complexos (grafo, estado iterativo, múltiplas chains). Tendência a concentrar lógica complexa em poucos arquivos em vez de quebrar em muitos módulos pequenos — típico de quem entrega sozinho ou em dupla e evita over-engineering.
- **Personalidade:** Provavelmente focado em resultado e em “fazer funcionar” para o front e para o produto; documenta quando isso ajuda (Swagger, docs de integração, especificação de relatório). Em 7 dias, testes e refatoração ficam para trás por necessidade; tende a valorizá-los assim que o MVP estiver no ar e houver espaço.
- **Idade:** Faixa **25–35** é apenas um chute; o estilo (pragmático, NestJS/TS, Prisma, preocupação com API e integração) combina com devs que amadureceram em stacks Node/TypeScript nos últimos anos.

Em resumo: um dev capaz, que em **7 dias** entregou um sistema coerente e utilizável, com boa noção de arquitetura e contrato de API. As lacunas (ports de persistência/notificação, testes, use cases menores) são naturais para o prazo; com um CTO ou tech lead apontando o que priorizar pós-MVP, tende a evoluir rápido.

---

## 8. Conclusão

Considerando que **o backend foi feito em 7 dias e o MVP sobe em mais 7**, o sistema entrega exatamente o que precisava: API clara, documentada, com auth, processamento assíncrono e real-time. A base arquitetural (ports para APIs externas, use cases, Zod, Swagger) está boa e permite evoluir. O que hoje aparece como “falta” (ports de persistência/notificação, use cases menores, testes, domain mais rico) é **dívida esperada** para esse ritmo; muita coisa ainda vai entrar nos próximos sprints. A única correção que vale priorizar antes ou logo após o MVP é o **logging no catch de `runInBackground`**, para não ficar no escuro quando um caso falhar em produção. O restante entra no roadmap pós-MVP. Para o contexto (2 devs, 7 dias), o nível é **muito bom**.

---

*Documento gerado com base em análise estática do repositório (estrutura, código-fonte, documentação existente). Contexto: 7 dias de desenvolvimento, MVP em mais 7 dias; várias melhorias planejadas para depois. Não substitui revisão de código ao vivo nem discussão com o time.*
