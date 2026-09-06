---
video: EOsigJta6cI
videoEn: MHm-2YmWEek
sidebar_label: Busca
date: "29 de agosto de 2026"
---

# Busca (`SearchInput`)

Campo de busca padrão das listas admin, em `shared/ui/filtros/search-input.tsx`.
Cliente (`"use client"`), com **debounce de 350ms** embutido para não disparar
uma request por tecla.

```tsx
import { SearchInput } from "@/shared/ui/filtros/search-input";

const [termo, setTermo] = useState("");

<SearchInput valor={termo} onChange={setTermo} placeholder="Buscar usuários..." />
```

## Props

| Prop          | Tipo                          | Padrão        | Descrição                                         |
| ------------- | ----------------------------- | ------------- | ------------------------------------------------- |
| `valor`       | `string`                      | —             | Termo "assentado" (pós-debounce), vindo do estado pai. |
| `onChange`    | `(valor: string) => void`     | —             | Chamado após 350ms de inatividade.                |
| `placeholder` | `string`                      | `"Buscar..."` | Texto do placeholder.                             |

## Como funciona

- O componente guarda o **rascunho** localmente (`rascunho`) enquanto o
  usuário digita, e só chama `onChange` após 350ms sem digitar. Assim a
  listagem (filtrada via React Query) não refaz fetch a cada tecla.
- `valor` é a fonte da verdade externa: ao mudar de fora (ex.: limpar o
  filtro), o rascunho é sincronizado de volta.
- Visual: `input input-sm w-full max-w-xs`, com ícone `Search` de
  `@/theme/icons`.

## Uso típico

Combine com a listagem paginada (`useAdminList`) passando o termo como
parâmetro de busca no `params` — ver [Filtros](/padrao-frontend/componentes/filtros)
e [Tabelas](/padrao-frontend/tabelas).

## Leitura de apoio

- [React Query — useAdminList (padrão do projeto)](/padrao-frontend/tratamento-de-dados/dados-e-api) — listagem que o termo filtra.
- [TanStack Query — Overview](https://tanstack.com/query/latest/docs/framework/react/overview) — debounce evita refetch por tecla (cache/deduplicação).
- [MDN — Timers (debounce)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Timing_of_settimeout_and_setinterval) — por que 350ms de inatividade antes do `onChange`.
