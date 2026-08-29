---
video: cbSHUVSUFgY
---

# ESLint

## O que é

Linter de JavaScript/TypeScript — analisa o código estaticamente e aponta erros de sintaxe, más práticas e desvios de estilo antes de rodar. No Next.js vem empacotado na config `eslint-config-next`, que já entende Server/Client Components, hooks e regras do framework.

## Por que essa

É a ferramenta de qualidade adotada no projeto: `eslint` + `eslint-config-next` travam regra de código no CI e no editor.

## Versão

`^9` + `eslint-config-next 16.3.3` +
`@tanstack/eslint-plugin-query` (`package.json`).

## Como rodar

```bash
pnpm lint
```

## Configuração real

`eslint.config.mjs` do `base-front` herda a config do
Next e adiciona as regras recomendadas do React Query:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import pluginQuery from "@tanstack/eslint-plugin-query";

const eslintConfig = defineConfig([
  ...pluginQuery.configs["flat/recommended"],
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

## Convenção do projeto

Lint roda no editor e antes de fechar mudança.
`// eslint-disable` só entra com justificativa no mesmo ponto. Para hooks do
React Query, a query key precisa representar tudo que muda o resultado.
