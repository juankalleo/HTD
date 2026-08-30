---
video: L6raE_UfweY
videoEn: Y9qpEa0oqcs
sidebar_label: Filtros
---

# Filtros (`FilterSelect`)

Filtro padrão das listas admin, em `shared/ui/filtros/filter-select.tsx`.
Um `<select>` que representa um filtro do backend e alimenta a querystring
de listagem.

```tsx
import { FilterSelect } from "@/shared/ui/filtros/filter-select";

const [tipo, setTipo] = useState("");

<FilterSelect
  label="Tipo"
  valor={tipo}
  onChange={setTipo}
  opcoes={[
    { valor: "admin", label: "Administrador" },
    { valor: "user", label: "Usuário" },
  ]}
/>
```

## Props

| Prop       | Tipo                                  | Descrição                              |
| ---------- | ------------------------------------- | -------------------------------------- |
| `label`    | `string`                              | Rótulo à esquerda do select.           |
| `valor`    | `string`                              | Valor selecionado (controlado pelo pai). |
| `opcoes`   | `{ valor: string; label: string }[]`  | Opções; `""` vira "Todos".             |
| `onChange` | `(valor: string) => void`             | Atualiza o estado de filtro do pai.    |

## Convenção Ransack + Pagy

Toda listagem admin segue o padrão do backend Rails: paginação via **Pagy**
e filtros via **Ransack** (`q[<campo>_eq]`).

- `FilterSelect` com `valor` vazio significa **"Todos"** — a opção `""` é
  sempre renderizada e **nunca** manda o parâmetro para a API quando vazia
  (evita filtrar por string vazia).
- O valor selecionado vira `q[<campo>_eq]=<valor>` no `params` repassado a
  `useAdminList` (ver [Tipos](/padrao-frontend/componentes/tipos) e
  `shared/hooks/use-admin-resource.ts`).
- O `queryString` de `services/api-admin.ts` descarta `""` e `undefined`,
  então "Todos" simplesmente some da URL.

## Paginação (Pagy)

`useAdminList` devolve `PagedResult<T> = { items, pagy }`, onde
`pagy: PagyInfo = { current_page, total_pages, total_count, per_page }`.
Use `pagy` para montar a paginação e o contador de resultados
(`<ResultsCount pagy={pagy} />`), documentados em
[Tabelas](/padrao-frontend/tabelas).

## Visual

`select select-sm w-auto` dentro de um `<label>` com texto
`text-base-content/60`.

## Leitura de apoio

- [React Query — useAdminList (padrão do projeto)](/padrao-frontend/tratamento-de-dados/dados-e-api) — de onde vêm os dados filtrados.
- [TanStack Table — Docs](https://tanstack.com/table/latest/docs/intro) — ordenação/paginação que os filtros alimentam.
- [Ransack (Rails)](https://github.com/activerecord-hackery/ransack) — `q[<campo>_eq]` que o `FilterSelect` monta.
