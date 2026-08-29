---
video: 7zb1-pR3Jxk
---

# Resposta de consulta (lista paginada)

A pergunta "o que a API me devolve quando faço uma **consulta**?" é recorrente — e a
resposta mora no front mesmo que o *formato* venha do backend. Aqui está o contrato
real de como o `base-front` recebe, desenvelopa e consome uma resposta de consulta
(lista paginada), e onde cada pedaço desse fluxo vive no código.

> Complementa [Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api) (onde o
> `fetch` mora) e [Dados em mutação](/padrao-frontend/tratamento-de-dados/dados-em-mutacao)
> (criar/atualizar/excluir, que **não** devolvem paginação).

## O envelope `{ data: T }`

Toda resposta passa por `request<T>` em `services/api-admin.ts`, que **desenvelopa** o
payload antes de entregar pro hook:

```ts
const payload = await response.json().catch(() => null);
// ...tratamento de 401 / erro...
return (payload as { data: T }).data;
```

Ou seja, o backend envelopa tudo em `data` e o front tira essa camada na camada de
serviço. Os hooks React Query recebem `T` limpo — nunca `{ data: T }`. Ex.:
`adminGet<T>` retorna o recurso `T`, não o envelope.

## Lista paginada: `PagedResult<T>`

Uma consulta de lista vem assim (ver `services/api-admin.ts`):

```ts
export type PagyInfo = {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
};
export type PagedResult<T> = { items: T[]; pagy: PagyInfo };
```

O backend usa **Pagy** (Rails — ver o comentário em `use-admin-resource.ts`: "nascem do
gerador `bin/rails g api_scaffold`"). Então a resposta crua da API é
`{ data: { items: [...], pagy: {...} } }`; depois do envelope vira `PagedResult<T>`.

| campo | significado |
| --- | --- |
| `items` | array de registros da página atual |
| `pagy.current_page` | página atual |
| `pagy.total_pages` | total de páginas |
| `pagy.total_count` | total de registros (pro "X registros encontrados") |
| `pagy.per_page` | tamanho da página |

## Onde cada coisa mora

- **`fetch` + parse + erros:** só em `services/api-admin.ts` (e demais `services/*.ts`).
- **Hooks genéricos:** `shared/hooks/use-admin-resource.ts` — `useAdminList`,
  `useAdminGet`, `useAdminCreate/Update/Delete`. Toda feature de admin monta seu hook de
  domínio (ex.: `usePapeis`, `useTiposUsuario`) em cima desses, sem reimplementar
  paginação/fetch.
- **Hooks de domínio:** `features/**/hooks/*` usam os genéricos e só adicionam regra de
  negócio.

## Consumindo no componente

```ts
const { data, isLoading, isError, error } = useAdminList<Usuario>(
  "usuarios",
  { page, per_page },
  ["usuarios"],
);

// data.items        -> linhas da tabela
// data.pagy.total_count -> "X registros"
// data.pagy.total_pages -> montar o paginador
```

A `queryKey` inclui os `params` (`[...queryKey, resource, params]`), então **página
diferente = entrada de cache diferente** — páginas não se misturam e voltar pra uma
página já vista é hit de cache, sem novo `fetch`.

Estados da UI derivam do React Query:

- `isLoading` → skeleton da tabela
- `isError` → erro amigável (vem de `AdminApiError`)
- `data.items.length === 0` → empty state

## Paginação na prática

`page`/`per_page` viram query string via `queryString()` e vão pro backend, que pagina;
o front só repassa e lê `pagy`. Ao trocar de página, um novo `useAdminList` com novos
`params` dispara a busca (ou resolve do cache, se já visitou).

## Erros

`AdminApiError` carrega `status` + mensagem. Dois caminhos:

- **401** → `handleUnauthorized()` limpa a sessão e manda pro login (`?expirado=1`).
- **outros** → `Toast.error` com a mensagem extraída de `extrairMensagem(payload)`.

A mensagem exibida é a do backend quando disponível (`mensagemDeErro` em
`use-admin-resource.ts`), então o usuário vê o erro real da consulta.

## Relatórios / KPIs

Consultas de agregação também trazem `pagy` — ex.:
`features/relatorios/usuarios/hooks/use-relatorio-usuarios-kpis.ts` lê
`data?.pagy.total_count` e ainda retorna formas agregadas como
`kpis: { total, porTipo }`. O contrato de "consulta tem `items` + `pagy`" vale tanto
pro CRUD de admin quanto pros relatórios.

## Quando NÃO é consulta

Criar / atualizar / excluir usam `useMutation` + `qc.invalidateQueries(...)` pra
refletir a lista em cache — e **não** devolvem `pagy`. Veja
[Dados em mutação](/padrao-frontend/tratamento-de-dados/dados-em-mutacao).

## Leitura de apoio

- [TanStack Query — Paginated Queries (docs oficiais)](https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries)
  — como paginar com `useQuery` e `keepPreviousData`.
- [Pagy (gem de paginação do backend Rails)](https://ddnexus.github.io/pagy/) — de onde
  vêm os campos `current_page` / `total_count` / `total_pages`.
- [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys) — por
  que incluir `params` na `queryKey` (páginas separadas em cache).
