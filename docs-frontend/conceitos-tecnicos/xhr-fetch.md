---
sidebar_label: XHR / fetch
---

# XHR / fetch

As duas APIs nativas do navegador pra fazer requisição HTTP a partir de
JavaScript. `XMLHttpRequest` (XHR) é a mais antiga — API baseada em
evento/callback (`onreadystatechange`), de antes de Promise existir no
JavaScript. `fetch()` é a substituta moderna — baseada em Promise,
sintaxe mais limpa, mas com diferenças reais de comportamento, não só de
estilo: `fetch()` só rejeita a Promise em falha de rede — uma resposta
`404`/`500` ainda é "sucesso" do ponto de vista da Promise, é preciso
checar `response.ok` manualmente.

## No padrão frontend

**Só `fetch()`** — confirmado por grep, zero `XMLHttpRequest` em qualquer
lugar do projeto. Toda chamada de rede passa por um único ponto,
`request<T>()` em `services/api-admin.ts` (o mesmo padrão se repete nos
outros arquivos de `services/`), que já resolve a pegadinha do
`response.ok`:

```ts
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) { handleUnauthorized(); throw new AdminApiError("Sem sessão.", 401); }
  if (!response.ok) throw new AdminApiError(/* ... */);

  return response.json();
}
```

Não existe motivo pra XHR aqui: o caso clássico que ainda justificaria
XHR sobre `fetch()` é acompanhar progresso de **upload** byte a byte
(`xhr.upload.onprogress`, que `fetch()` só passou a suportar de forma
mais recente e menos madura) — o padrão tem exatamente um fluxo de upload
(`identidade-form.tsx`, ícone/fundo institucional via `FormData`, ver
[Upload de imagem](/padrao-frontend/arquivos)), e nenhuma tela mostra
barra de progresso de upload — confirmado, zero `onProgress` no projeto.
Sem essa necessidade, `fetch()` sozinho já resolve tudo.

## Leitura de apoio

- [MDN — Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN — XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- [Fetch x TanStack Query](/padrao-frontend/conceitos-tecnicos/fetch-tanstack-query) — o próximo nível: onde `fetch()` para e onde o TanStack Query assume.
