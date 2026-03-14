# Testes unitários

Os testes unitários ficam em `tests/unit/`, espelhando a estrutura de `src/`.

- **Configuração:** `jest.config.js` na raiz do projeto (rootDir: ".", testRegex: tests/unit/**/*.spec.ts).
- **Execução:** `npm test`.

Cobertura atual: utils, reports, use cases (fluxos com Prisma/ports mockados) e serviços de infraestrutura (ClickHouse, Prisma mockados) com dificuldade de implementação inferior a 5.
