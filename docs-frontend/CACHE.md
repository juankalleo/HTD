---
video: I8iGQjKGjDA
videoEn: 6FyXURRVmR0
---

# Cache

**O que é:** camada que evita buscar de novo dados que já foram trazidos do servidor. No [HTD-Front](https://github.com/juankalleo/HTD-Front) o cache de dados remotos é do **React Query**; o cache de HTML/rotas é do próprio **Next.js (App Router)**.

## Cache de dados (React Query)

Todo dado assíncrono passa por um hook `useQuery` (ver [Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api)), então o cache é implícito: mesma `queryKey` → mesmo dado em memória, sem novo `fetch`.

**Padrão de validade** — definido no `QueryClient` global (`shared/query/query-client.ts`):

```ts
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 2 * 60 * 1000 } }, // 2 min
  });
}
```

`staleTime` é quanto tempo o dado é considerado "fresco" (não refaz fetch ao remontar a tela). A sessão do usuário usa janela maior pra não bater `/auth/me` a todo momento (`features/autenticacao/login/hooks/use-session.ts`):

```ts
useQuery({
  queryKey: ["auth", "session"],
  queryFn: fetchCurrentUser,
  staleTime: 5 * 60 * 1000, // 5 min
});
```

**Invalidação (escreveu → leu stale):** após uma mutação, o React Query não adivinha o novo valor — quem mudou o dado pede a invalidação da `queryKey` correspondente. Ex.: salvar configuração institucional (`features/admin/config-institucional/hooks/use-update-configuracao-institucional.ts`):

```ts
onSuccess: () => {
  qc.invalidateQueries({ queryKey: configInstitucionalKeys.atual });
};
```

Já o login faz `queryClient.clear()` pra **zerar tudo** antes de entrar como o novo usuário — evita vazar cache de sessão anterior (`features/autenticacao/login/hooks/use-login-form.ts`).

**Regra do projeto:** `queryKey` mora em arquivo de `keys` da feature (ex.: `configInstitucionalKeys`), nunca string solta, pra invalidação e leitura baterem.

## Cache de rota/HTML (Next.js)

App Router cacheia Server Component e `fetch` por padrão. Padrão adotado:

- Rotas que dependem de sessão/usuário logado **não** devem ser estáticas — mantém `dynamic` (o `layout.tsx` raiz é Server Component assíncrono que aplica branding institucional no servidor, então essas páginas são renderizadas por request).
- `fetch` de `services/` que precisar de cache explícito usa a opção `next: { revalidate: N }` ou `cache: "no-store"` quando o dado é porusuário (ver [Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api)). Hoje o [HTD-Front](https://github.com/juankalleo/HTD-Front) não usa `revalidate` em rotas públicas porque o conteúdo é autenticado; esse é o **padrão a seguir** caso surja página pública/cacheável.

**Convenção:** nunca desligar o cache do Next com `export const dynamic = "force-dynamic"` por reflexo — só quando a rota realmente precisa de request por usuário.

## Leitura de apoio

- [TanStack Query — Overview (docs oficiais)](https://tanstack.com/query/latest/docs/framework/react/overview) — cache, deduplicação e invalidação de server state.
- [React Query as a State Manager (TkDodo)](https://tkdodo.eu/blog/react-query-as-a-state-manager) — por que o cache do React Query é a fonte de verdade do dado assíncrono.
- [Next.js — App Router (docs)](https://nextjs.org/docs/app) — cache de rota/HTML e `revalidate`/`no-store`.
