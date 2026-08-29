---
sidebar_label: Fetch x TanStack Query
---

# Fetch x TanStack Query

`fetch()` só faz uma coisa: manda uma requisição, devolve uma Promise da
resposta. Não cacheia, não sabe se o dado já foi buscado antes, não
refaz sozinho se falhar, não compartilha resultado entre dois
componentes que pedem a mesma coisa. TanStack Query é a camada por cima
que resolve tudo isso — cache por chave, invalidação, refetch, estado de
loading/erro prontos — mas ele não substitui `fetch()`, ele **orquestra**
chamadas que, no fundo, ainda usam `fetch()` (ou XHR, ou qualquer coisa
que devolva uma Promise) pra buscar o dado de verdade.

## No padrão frontend

Divisão de responsabilidade rígida, por pasta — confirmada por grep, sem
exceção:

- **`services/*.ts`** — só `fetch()`. Cada arquivo (`api-admin.ts`,
  `api-identity.ts`, `api-institucional.ts`, `api-relatorio-pdf.ts`,
  `api-relatorio-excel.ts`) exporta função tipada por endpoint, sem
  nenhum import de React, sem `useQuery`/`useMutation` — confirmado, zero
  ocorrência. É a mesma regra já documentada em
  [Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api#services--só-fetch-zero-react).
- **`shared/hooks/`** e **`features/*/hooks/`** — só TanStack Query. 11
  arquivos usam `useQuery`/`useMutation`; **nenhum** deles chama
  `fetch()` diretamente — confirmado por grep, zero ocorrência. Todo hook
  chama uma função de `services/` como `queryFn`/`mutationFn`.

A cadeia completa, do genérico
(`shared/hooks/use-admin-resource.ts`) até o `fetch()` de verdade:

```ts
// shared/hooks/use-admin-resource.ts — só TanStack Query
export function useAdminList<T>(resource: string, params = {}, queryKey: QueryKey) {
  return useQuery<PagedResult<T>>({
    queryKey: [...queryKey, resource, params],
    queryFn: () => adminList<T>(resource, params), // chama services/, nunca fetch direto
  });
}
```

```ts
// services/api-admin.ts — só fetch, zero React
export function adminList<T>(resource: string, params?: ListParams): Promise<PagedResult<T>> {
  return request<T>(`/api/v1/admin/${resource}${queryString(params)}`);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers: { /* ... */ } });
  if (!response.ok) throw new AdminApiError(/* ... */);
  return response.json();
}
```

`useAdminList` nunca vê `fetch`; `adminList`/`request` nunca veem
`useQuery`. Cada camada só conhece a de baixo, nunca pula uma etapa — é
o que permite trocar o motor de cache (TanStack Query por outra coisa, um
dia) sem tocar em `services/`, ou trocar `fetch()` por outra forma de
buscar dado sem tocar em nenhum hook.

**Por que TanStack Query entra, em vez de só `fetch()` espalhado:**
cache automático por `queryKey` (duas telas pedindo o mesmo recurso não
duplicam requisição, ver
[State Management](/padrao-frontend/conceitos-tecnicos/state-management)
pra como isso já substitui a necessidade de um Zustand/Redux),
invalidação declarativa depois de mutation (`qc.invalidateQueries`, sem
`refetch()` manual espalhado), e o descarte automático de resultado fora
de ordem (ver
[Web Concurrency](/padrao-frontend/conceitos-tecnicos/web-concurrency)).
`fetch()` sozinho não dá nada disso de graça.

**As duas exceções que usam `fetch()`/promise pura, fora de
`useQuery`/`useMutation`:** os hooks de preview de relatório
(`use-relatorio-usuarios-{pdf,excel}-preview.ts`) — não porque quebram a
regra, mas porque não são uma *query* no sentido do TanStack Query (não
há um dado cacheável e reutilizável, é uma geração de arquivo com efeito
colateral, disparada uma vez). Ver
[Web Concurrency](/padrao-frontend/conceitos-tecnicos/web-concurrency)
pra como esses dois hooks se protegem de resultado fora de ordem sem o
cache do TanStack Query por trás.

## Leitura de apoio

- [Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api) — a regra completa de organização de `services/`/`hooks/`/`features/`.
- [TanStack Query — Overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [XHR / fetch](/padrao-frontend/conceitos-tecnicos/xhr-fetch) — a camada de baixo desta mesma cadeia.
