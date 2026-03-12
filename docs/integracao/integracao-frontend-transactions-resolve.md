  # Integração frontend: endpoint Resolver transação (buscar carteira por hash)

  Este documento descreve como consumir o endpoint **POST /transactions/resolve** no frontend: enviar a hash de uma transação (e opcionalmente o valor reportado) e obter os dados da transação em múltiplas chains, com a transferência “semente” identificada quando o valor é informado.

  ---

  ## 1. Visão geral

  | Item | Valor |
  |------|--------|
  | **Método** | `POST` |
  | **Caminho** | `/transactions/resolve` |
  | **Descrição** | Busca a transação pelo hash nas chains suportadas (ETH e BSC). Retorna dados da transação, lista de transferências e, se `reportedLossAmount` for enviado, a transferência cujo valor mais se aproxima desse valor (transferência semente), útil para identificar a carteira de destino a rastrear. |

  **Base URL (exemplo):** `https://api.exemplo.com` ou `http://localhost:3000` em desenvolvimento.

  **Uso típico:** O usuário informa o hash da transação e o valor que perdeu; o front chama este endpoint para obter a chain, a lista de transferências e a transferência semente. Com a carteira de destino da semente (`seedTransfer.to`) e a chain, o front pode chamar o endpoint de flow por carteira, ou o usuário pode usar o endpoint por hash+valor (`GET /addresses/by-transaction/flow-to-exchange/full-history`) que internamente usa este resolve.

  ---

  ## 2. Request

  ### 2.1 URL e body

  - **Content-Type:** `application/json`
  - **Body:** objeto JSON com os campos abaixo.

  | Campo | Tipo | Obrigatório | Descrição |
  |-------|------|-------------|-----------|
  | `txHash` | string | Sim | Hash da transação (ex.: `0x4199be011e1e861b7b43274cc180359a64022cc32055993560870278dce46ff8`). Não pode ser vazio após trim. |
  | `reportedLossAmount` | number | Não | Valor reportado de perda (valor da transferência que se quer rastrear). Deve ser finito e positivo. Quando informado, o backend escolhe, entre as transferências da transação, aquela cujo valor mais se aproxima; essa transferência é retornada em `seedTransfer` e sua carteira de destino (`seedTransfer.to`) é a candidata a carteira de partida do rastreio. |

  ### 2.2 Validação no frontend (recomendado)

  Antes de chamar a API:

  - `txHash`: string não vazia após trim.
  - `reportedLossAmount` (se enviado): número finito e positivo.

  Se `txHash` estiver vazio ou `reportedLossAmount` for inválido (quando enviado), o backend responde **400** (ver seção 4.1).

  ### 2.3 Exemplos de request

  **Apenas hash (sem valor):**

  ```http
  POST /transactions/resolve
  Content-Type: application/json

  {
    "txHash": "0x4199be011e1e861b7b43274cc180359a64022cc32055993560870278dce46ff8"
  }
  ```

  **Hash + valor reportado (para identificar a transferência semente):**

  ```http
  POST /transactions/resolve
  Content-Type: application/json

  {
    "txHash": "0x4199be011e1e861b7b43274cc180359a64022cc32055993560870278dce46ff8",
    "reportedLossAmount": 2324
  }
  ```

  ---

  ## 3. Response de sucesso (HTTP 200)

  O corpo da resposta é um objeto com a estrutura abaixo.

  ### 3.1 Estrutura

  | Campo | Tipo | Descrição |
  |-------|------|-----------|
  | `chain` | string | Chain onde a transação foi encontrada (ex.: `eth-mainnet`, `bsc-mainnet`). |
  | `transaction` | object | Dados resumidos da transação. |
  | `transaction.fromAddress` | string | Endereço de origem da transação. |
  | `transaction.toAddress` | string | Endereço de destino da transação. |
  | `transaction.blockSignedAt` | string | Data/hora do bloco (ISO ou formato do provedor). |
  | `transfers` | array | Lista de todas as transferências da transação (nativas e token). |
  | `seedTransfer` | object \| null | Transferência cujo valor mais se aproxima de `reportedLossAmount`. Se `reportedLossAmount` não foi enviado ou não há transferências, vem `null`. Use `seedTransfer.to` como carteira de destino da transferência a rastrear. |

  Cada elemento de `transfers` (e `seedTransfer`, quando não for null) segue o tipo **Transfer**:

  | Campo | Tipo | Descrição |
  |-------|------|-----------|
  | `type` | string | `"native"` ou `"erc20"`. |
  | `symbol` | string | Símbolo do ativo (ex.: `ETH`, `BNB`, `USDT`). |
  | `from` | string | Endereço de origem da transferência. |
  | `to` | string | Endereço de destino da transferência. |
  | `rawAmount` | string | Valor em unidades mínimas (string para precisão). |
  | `amount` | number | Valor em unidades legíveis. |
  | `timestamp` | string | Data/hora da transferência. |
  | `contract` | string (opcional) | Endereço do contrato (token), quando aplicável. |

  ### 3.2 Exemplo de response (200)

  ```json
  {
    "chain": "bsc-mainnet",
    "transaction": {
      "fromAddress": "0xabc...",
      "toAddress": "0xdef...",
      "blockSignedAt": "2024-01-15T10:30:00Z"
    },
    "transfers": [
      {
        "type": "erc20",
        "symbol": "USDT",
        "from": "0xabc...",
        "to": "0x520e6b02925c77f165eeb57e74be051ca94bf2ce",
        "rawAmount": "2324000000",
        "amount": 2324,
        "timestamp": "2024-01-15T10:30:00Z",
        "contract": "0xdac17f958d2ee523a2206206994597c13d831ec7"
      }
    ],
    "seedTransfer": {
      "type": "erc20",
      "symbol": "USDT",
      "from": "0xabc...",
      "to": "0x520e6b02925c77f165eeb57e74be051ca94bf2ce",
      "rawAmount": "2324000000",
      "amount": 2324,
      "timestamp": "2024-01-15T10:30:00Z",
      "contract": "0xdac17f958d2ee523a2206206994597c13d831ec7"
    }
  }
  ```

  Quando não há valor reportado ou não há correspondência útil, `seedTransfer` pode vir `null`; `transfers` e `chain` ainda vêm preenchidos.

  ---

  ## 4. Respostas de erro

  ### 4.1 HTTP 400 (Bad Request)

  - **Quando:** Body inválido (ex.: `txHash` vazio, `reportedLossAmount` não numérico ou não positivo quando informado).
  - **Corpo:** Mensagem de validação (string ou objeto com detalhes, conforme o backend). Exemplo: `"txHash: String must contain at least 1 character(s)"`.

  ### 4.2 HTTP 404 (Not Found)

  - **Quando:** A transação não foi encontrada em nenhuma das chains consultadas (ETH e BSC).
  - **Corpo:** Mensagem explicativa. Exemplo: `"Transação não encontrada em nenhuma chain (eth-mainnet, bsc-mainnet). Verifique o hash."`

  ### 4.3 HTTP 502 (Bad Gateway)

  - **Quando:** Falha ou indisponibilidade do provedor externo (ex.: API Covalent retornando 500/502/503).
  - **Corpo:** Mensagem genérica de serviço indisponível. Exemplo: `"Serviço de transações temporariamente indisponível. Tente novamente mais tarde."`

  ### 4.4 HTTP 500 (Internal Server Error)

  - **Quando:** Erro interno não mapeado (ex.: exceção inesperada).
  - **Corpo:** Mensagem genérica. Exemplo: `"Erro ao resolver transação."`

  ---

  ## 5. Fluxo recomendado no frontend

  1. Usuário informa **hash da transação** e **valor reportado** (opcional).
  2. Front chama **POST /transactions/resolve** com `txHash` e, se houver, `reportedLossAmount`.
  3. Se **200:** usar `chain`, `transfers` e, se existir, `seedTransfer`:
    - Para rastreio por carteira: usar `seedTransfer.to` como carteira inicial e o slug da chain (ex.: `bsc` a partir de `bsc-mainnet`) no endpoint **GET /addresses/:address/flow-to-exchange/full-history**.
    - Para rastreio por hash+valor: chamar **GET /addresses/by-transaction/flow-to-exchange/full-history?txHash=...&reportedLossAmount=...** (esse endpoint usa o resolve internamente).
  4. Se **404:** orientar o usuário a conferir o hash e a chain (ETH/BSC).
  5. Se **502:** orientar a tentar novamente mais tarde.

  ---

  ## 6. Resumo dos códigos HTTP

  | Código | Significado |
  |--------|-------------|
  | 200 | Transação encontrada; body com `chain`, `transaction`, `transfers` e `seedTransfer` (ou null). |
  | 400 | Body inválido (txHash vazio ou reportedLossAmount inválido). |
  | 404 | Transação não encontrada em nenhuma chain. |
  | 502 | Serviço de transações (provedor) indisponível. |
  | 500 | Erro interno. |
