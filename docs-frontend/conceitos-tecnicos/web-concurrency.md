---
sidebar_label: Web Concurrency
date: "29 de agosto de 2026"
---

# Web Concurrency (concorrência no navegador)

JavaScript no navegador roda numa única thread — não existe race condition
de memória compartilhada como em linguagem multi-thread. Mas isso não
elimina concorrência: chamadas assíncronas (`fetch`, `setTimeout`) ainda
podem **resolver fora de ordem**. Um exemplo real: o usuário digita um
filtro, dispara uma busca; digita de novo antes da primeira resposta
voltar, dispara uma segunda; se a primeira responder **depois** da
segunda, a tela acaba mostrando o resultado desatualizado — mesmo que
nada tenha corrompido, a UI ficou inconsistente com a intenção mais
recente do usuário.

## No padrão frontend

Duas estratégias diferentes convivem no projeto, cada uma no lugar certo:

**Toda tela que busca dado via `useQuery`/`useAdminGet`/`useAdminList`**
(a maioria do projeto, ver [Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api))
já não sofre esse problema — o TanStack Query rastreia cada chamada por
`queryKey`; se o filtro muda e dispara uma nova busca antes da anterior
responder, o resultado da busca antiga é descartado internamente, mesmo
que a requisição HTTP em si ainda esteja em voo. Nenhum código deste
projeto precisa de guarda manual pra isso — é comportamento de biblioteca,
de graça.

**Nuance real, não escondida:** isso evita a UI mostrar dado velho, mas
**não cancela a requisição HTTP em si** — o navegador ainda espera a
resposta antiga chegar, só ignora o resultado. Cancelamento de verdade
exigiria passar o `signal` que o TanStack Query already oferece pro
`queryFn` adiante, até o `fetch()` real
(`services/api-admin.ts#request()`, que já aceita `RequestInit` — inclusive
`signal` — mas nenhum hook do projeto passa isso hoje). Não é bug: pra
requisição GET idempotente e rápida contra a API interna deste projeto, o
custo de deixar a resposta antiga terminar (e ser descartada) é
desprezível — cancelamento explícito só valeria a pena pra requisição
cara/lenta.

**As duas exceções que usam guarda manual** — os hooks de preview de
relatório (`use-relatorio-usuarios-pdf-preview.ts`,
`use-relatorio-usuarios-excel-preview.ts`) — ficam **fora** do TanStack
Query de propósito (são geração de arquivo com efeito colateral, não uma
query cacheável), então precisam da própria guarda contra resposta fora de
ordem:

```ts
useEffect(() => {
  let cancelado = false;

  (async () => {
    const resultado = await adminList(/* ... */);
    const novoBlob = await gerarRelatorioUsuariosPdf(/* ... */);
    if (!cancelado) setBlob(novoBlob);
  })();

  return () => {
    cancelado = true;
  };
}, [/* deps */]);
```

O flag `cancelado`, fechado sobre esse efeito específico, garante que se o
componente desmontar (ou os parâmetros mudarem, disparando o efeito de
novo) antes da geração terminar, o resultado antigo nunca chega a
`setState` — é o mesmo problema do TanStack Query, resolvido à mão porque
esses dois hooks estão fora do alcance dele.

## Leitura de apoio

- [Designing Data-Intensive Applications — cap. 8/9](/padrao-frontend/leitura-recomendada/designing-data-intensive-applications) — concorrência distribuída em profundidade (o mesmo princípio de "resultado fora de ordem", em escala de sistema).
- [TanStack Query — Query Cancellation (docs)](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation) — como o `signal` funciona, caso o projeto precise cancelar a requisição de verdade no futuro.
- [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) — a API nativa por trás de `signal`.
