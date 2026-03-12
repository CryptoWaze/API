# Especificação: Relatório do Caso (pré-relatório técnico de rastreio)

Documento de referência para implementação. Reúne as decisões tomadas nas conversas.

---

## 1. Objetivo

- Gerar um **pré-relatório** técnico de rastreio de criptoativos (5–10+ páginas, tamanho dinâmico).
- Conteúdo padronizável a partir dos dados do caso (seeds, flows, carteiras, deposit addresses, hot wallets).
- Um **único template** gera **PDF** e **DOCX** (HTML como fonte; export para os dois formatos).
- Relatórios são **versionados**: cada geração cria um novo registro; usuário pode acessar todos (histórico).

---

## 2. Template

- **Formato**: HTML + motor de template (Handlebars ou EJS).
- **Local**: arquivo(s) em pasta do projeto (ex.: `templates/report/`) ou tabela no banco (se quiser edição pelo sistema no futuro).
- **Conteúdo** (estrutura do relatório):
  1. Capa (título, nome do caso, data placeholder).
  2. Introdução (texto fixo).
  3. Objetivo (texto fixo).
  4. Delimitação e fontes (texto fixo).
  5. Termos e conceitos / glossário (texto fixo).
  6. Rede blockchain e ativo (placeholders: redes, ativo) + representação gráfica (link do grafo) + bloco **`[ --imagem-- ]`** (placeholder para figura).
  7. Saídas iniciais e primeiras carteiras: lista cronológica (data, valor, token, destino, hash, link explorer) + totais + equivalente R$ (placeholder ou configurável).
  8. Camada intermediária e ingresso custodial: narrativa + listas por exchange (Deposit addresses, Hot wallet(s)) com endereço + link explorer; opcional segundo bloco **`[ --imagem-- ]`**.
  9. Medidas de diligência (texto fixo).
  10. Conclusão simplificada (passo a passo gerado a partir dos dados).
  11. Conclusão técnica final (texto fixo + trecho com endereços/totais).
  12. Assinatura (data e cargo em placeholder).

- **Tamanho**: sem teto de páginas; listas crescem com a quantidade de seeds, flows e endereços.
- **Imagens**: por enquanto apenas placeholder `--imagem--`; geração de imagem do grafo fica para depois.

---

## 3. Dados do caso usados no template

- **Caso**: nome, `totalAmountLostRaw` / `totalAmountLostDecimal`, `createdAt` / `updatedAt`.
- **Seeds**: por seed: `txHash`, `chainSlug`, token, `amountRaw`/`amountDecimal`, `timestamp`; primeira carteira do flow (recepção primária).
- **Flows**: por flow: steps (from → to, valor, token, timestamp, txHash); identificar nós que são deposit address vs hot wallet; exchange name.
- **Explorer links**: Etherscan/BscScan (e outros) por chain: `https://etherscan.io/tx/{txHash}`, `https://etherscan.io/address/{address}`, etc.
- **Totais**: soma dos valores das saídas iniciais; equivalente em R$ (configurável ou placeholder).

Tudo isso já existe ou pode ser derivado do **GET /cases/:id** (e do modelo de dados atual).

---

## 4. Armazenamento do relatório gerado

- **Bucket: Cloudflare R2** (API S3-compatível).
  - Arquivos PDF e DOCX são enviados ao R2; no banco fica apenas a **referência** (object key).
  - Cada geração cria um novo objeto no bucket (ex.: `reports/{caseId}/{reportId}.pdf`), sem sobrescrever.

- **Regra**: **nunca sobrescrever**. Cada geração insere um novo registro em `CaseReport` e um novo objeto no R2. Relatórios antigos permanecem acessíveis.

- **Tabela `CaseReport`**:
  - `id` (cuid), `caseId`, `format` (enum: pdf | docx), `generatedAt` (DateTime), `storageKey` (String) — chave do objeto no R2, ex.: `reports/{caseId}/{reportId}.pdf`, `createdAt`.
  - Sem unique (caseId, format); múltiplos registros por caso (histórico).
  - Download: buscar registro por `reportId`, validar dono do caso, depois obter arquivo do R2 (GetObject) e devolver no response (stream ou buffer).

- **Configuração**: variáveis de ambiente para R2: `R2_ACCOUNT_ID` (ou `R2_ENDPOINT`), `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`. Opcional: `R2_REGION` (default `auto`). Cloudflare R2 usa endpoint no formato `https://<account_id>.r2.cloudflarestorage.com`.

---

## 5. Quando gerar novo relatório

- **Endpoint de “gerar relatório”** (ex.: POST /cases/:caseId/reports ou GET que gera se precisar):
  - Pode **sempre gerar um novo** e gravar (sem checagem de “já existe”), **ou**
  - Gerar **somente sob demanda** (usuário clica “Gerar relatório”); aí sempre cria um novo e persiste.
- Não é obrigatório “cache”: ao chamar “gerar”, criamos um novo registro. O histórico fica na lista (GET de relatórios do caso).
- **Alternativa** (se quiser evitar gerar duplicado sem edição): só gerar novo se `case.updatedAt` > último `report.generatedAt`; caso contrário, poderia retornar o último. Mas a decisão foi **não sobrescrever** e **poder acessar todos**; então “gerar” pode sempre criar um novo, e “listar” mostra todos. Fica a critério do produto: botão “Gerar relatório” sempre gera e adiciona à lista, ou só gera se houve alteração. Para simplificar: **sempre que o usuário solicitar geração, criar novo relatório e salvar.**

---

## 6. Endpoints

- **POST /cases/:caseId/reports**
  - Get-or-create: se não houver relatório ou o caso foi editado após o último relatório, gera novo (PDF + DOCX), persiste no R2 e em `CaseReport`; caso contrário, devolve o relatório existente mais recente.
  - Retorna: `{ generated: boolean, reports: [{ id, caseId, format, generatedAt, createdAt }] }`.
  - Autenticação: JWT; só dono do caso.

- **GET /cases/:caseId/reports**
  - Lista **todos** os relatórios do caso (histórico).
  - Retorno: array de `{ id, caseId, format, generatedAt, fileName? }`, ordenado por `generatedAt` desc.
  - Autenticação: JWT; só dono do caso.

- **GET /cases/:caseId/reports/:reportId** (ou **GET /reports/:reportId/file**)
  - Download do arquivo (PDF ou DOCX) do relatório com `reportId`.
  - Verificar que o relatório pertence ao caso e que o caso pertence ao usuário autenticado.
  - Buscar objeto no R2 pela `storageKey` do registro; retornar stream/buffer + headers (Content-Type, Content-Disposition).

---

## 7. Fluxo técnico de geração

1. Buscar caso por ID (com seeds, flows, transactions, edges, wallets, chains, exchanges); validar dono (userId).
2. Montar estrutura de dados para o template (seeds, flows, listas de deposit addresses/hot wallets por exchange, totais, links explorer).
3. Renderizar template HTML (Handlebars/EJS) com esses dados.
4. Gerar PDF: HTML → PDF (ex.: Puppeteer).
5. Gerar DOCX: HTML → DOCX (ex.: pandoc ou lib Node).
6. Salvar no R2 e no banco: para cada formato (PDF, DOCX), fazer upload no R2 (PutObject com key `reports/{caseId}/{reportId}.{ext}`) e inserir registro em `CaseReport` (id, caseId, format, generatedAt, storageKey).
7. Retornar metadados dos relatórios criados.

---

## 8. Checklist antes de codar

- [ ] Configurar cliente S3-compatível para Cloudflare R2 (variáveis de ambiente: R2 endpoint, bucket, access key, secret key).
- [ ] Criar migration: tabela `CaseReport` (id, caseId, format, generatedAt, storageKey, createdAt).
- [ ] Criar pasta `templates/report/` e primeiro arquivo HTML do template (com placeholders e blocos `--imagem--`).
- [ ] Escolher motor de template (Handlebars ou EJS) e dependências (puppeteer ou similar para PDF; lib para HTML→DOCX).
- [ ] Implementar serviço/use case que: lê caso → monta payload → renderiza HTML → gera PDF e DOCX → upload R2 → insere `CaseReport`(s) com `storageKey`.
- [ ] Implementar POST (ou GET) “gerar relatório” e GET “listar relatórios do caso” e GET “download por reportId”.
- [ ] Garantir que edições no caso (nome, wallets, soft-delete) não apagam relatórios antigos; novo relatório só é criado quando o usuário pedir geração.

---

## 9. Resumo em uma frase

Um template HTML único é preenchido com dados do caso (GET case), gera PDF e DOCX; cada geração faz upload no **Cloudflare R2** e grava **novos** registros em `CaseReport` com `storageKey` (histórico); o usuário lista todos os relatórios do caso (GET /cases/:caseId/reports) e baixa o que quiser (GET por reportId), buscando o arquivo no R2.
