---
video: bFycRzkXp1U
videoEn: W9_x8pc_bh8
sidebar_label: Poluição de Protótipo
date: "29 de agosto de 2026"
---

# Poluição de Protótipo (Prototype Pollution)

Vulnerabilidade JavaScript onde invasores modificam as propriedades base
de objetos globais, alterando o comportamento da aplicação. Acontece
tipicamente quando código faz merge/set recursivo de um objeto vindo de
fora (JSON de usuário, querystring) num objeto real, sem filtrar chaves
como `__proto__`/`constructor`/`prototype` — o invasor injeta uma dessas
chaves no JSON, e o merge "vaza" pro protótipo global de `Object`,
afetando todo objeto da aplicação a partir daquele ponto.

## No padrão frontend

Não se aplica — o padrão de tratamento de dado do projeto não tem o
padrão de código que abre essa vulnerabilidade. Verificado: nenhuma lib de
merge profundo (`lodash.merge`, `lodash.set`, `deepmerge`) está instalada;
nenhum `Object.assign`/spread recursivo mistura JSON vindo de fora com um
objeto compartilhado ou global. `JSON.parse` aparece só em
`lib/auth.ts`, pra ler o cache local do usuário — o resultado vira uma
variável tipada isolada, nunca é mesclado em outro objeto:

```ts
export function getStoredUser<T = unknown>(): T | null {
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
```

O resto do dado dinâmico do app (resposta da API, valores de formulário)
passa por schema Zod, que também não faz merge recursivo — cada campo é
validado e atribuído individualmente ao objeto de saída.

**Quando isso importaria:** se uma lib de merge profundo entrar no projeto
no futuro (por exemplo, pra combinar configuração vinda de múltiplas
fontes), o cuidado nesse momento é usar uma versão da lib que já filtra
`__proto__`/`constructor`/`prototype` (as libs modernas de merge já fazem
isso por padrão) ou validar essas chaves manualmente antes do merge.
