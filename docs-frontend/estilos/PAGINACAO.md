---
video: uKUA4N2oPxY
videoEn: wAGIOCqS8tk
---

# Paginação

> Componente único de paginação das listas admin —
> `shared/ui/sistema/pagination.tsx`. Controlado pelo pai (a página real vem
> da API via Ransack, ver [TABELAS.md](../TABELAS.md)).

## O componente

```tsx
"use client";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const goTo = (raw: number) => {
    const target = Math.min(Math.max(1, Math.trunc(raw) || 1), totalPages);
    if (target !== page) onPageChange(target);
  };
  // ...
}
```

- **Sempre visível**, mesmo com 1 página só — os botões ficam `disabled` nos
  limites (`«` desabilita em `page <= 1`, `»` em `page >= totalPages`). Isso
  mantém o mesmo lugar/tamanho de tela em toda lista, sem o componente
  "piscar" somindo/aparecendo conforme o resultado da busca muda de 1 pra
  várias páginas.
- Navegação via DaisyUI `join`: `«` / `{page} / {totalPages}` / `»`.
- Campo **"Ir para"**: `<input type="number">` que aceita o número da página
  e faz `goTo` no `Enter` (e no `blur`). O valor é clampado entre `1` e
  `totalPages` (`Math.min(Math.max(1, ...), totalPages)`) — nunca sai do
  intervalo válido.

## Uso

O componente é **apenas a view**: ele não busca dado, só emite `onPageChange`.
Quem decide a página é a lista que o usa (normalmente um `useQuery` com
`page` no estado, mandando `q[page]`/`q[per_page]` pro Rails via Ransack —
ver [TABELAS.md](../TABELAS.md), seção de paginação/ordenamento).

```tsx
<Pagination
  page={pagina}
  totalPages={dados.totalPages}
  onPageChange={(p) => setPagina(p)}
/>
```
