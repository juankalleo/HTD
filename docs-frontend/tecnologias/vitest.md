---
video: MtuCkfLxXDk
videoEn: CxSL0knFxAs
sidebar_label: Vitest
---

# Vitest

## O que é

Runner de testes para TypeScript/React, usado aqui para testes
unitários de helpers, schemas e conversores.

## Por que essa

É leve e roda bem com Vite/Next. No [HTD-Front](https://github.com/juankalleo/HTD-Front), entra
para testar contratos compartilhados (helpers de autenticação, parsing de
API e schemas) antes que virem bug em várias telas. Leitura de apoio:
[documentação oficial do Vitest](https://vitest.dev/) — por que um runner
sobre Vite/Next pega contratos compartilhados cedo.

## Versão

`^4.1.11` (`package.json`).

## Como rodar

```bash
pnpm test
pnpm test:watch
pnpm test:ui
```

## Configuração real

```ts
// vitest.config.mts
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
});
```

## Onde usar

Helpers puros (`lib/`), schemas Zod, conversores de payload,
montagem de query key/query string e utilitários de relatório. Tela inteira só
entra em teste quando o comportamento do usuário justificar Testing Library.
