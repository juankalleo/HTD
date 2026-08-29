---
video: Q-206WRzOHQ
---

# TanStack React Query

## O que é

Biblioteca de estado assíncrono — busca, cacheia, invalida e
sincroniza dados de servidor (aqui: sessão do usuário) sem precisar de
`useState`/`useEffect` manual.

## Por que essa

É a escolha do projeto pra todo dado assíncrono — busca,
cache e invalidação saem de graça do React Query. O Provider é estrutural
(envolve o app inteiro), então entra cedo na fundação do projeto. Leitura de
apoio: [TanStack Query — Overview (docs oficiais)](https://tanstack.com/query/latest/docs/framework/react/overview)
e [Beyond useEffect: why TanStack Query is the professional standard](https://dev.to/devactivity/beyond-useeffect-why-tanstack-query-is-the-professional-standard-for-react-data-fetching-5h34)
— por que cache, deduplicação e invalidação de server state saem de graça.

## Versão

`^5.102.5` (`package.json`).

## Como importar

```bash
pnpm add @tanstack/react-query
```

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
```

## Exemplo real

Provider global (`shared/query/`):

```tsx
// shared/query/query-client.ts
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { extrairMensagem } from "@/lib/error-utils";
import { Toast } from "@/shared/ui/sistema";

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.state.data !== undefined) return;
        if (query.meta?.suppressGlobalErrorToast === true) return;

        void Toast.error({
          title: "Não foi possível carregar os dados",
          description: extrairMensagem(error, "Tente novamente."),
        });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}
```

```tsx
// shared/query/query-provider.tsx
"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "./query-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

Uso real — sessão do usuário logado (`features/autenticacao/login/hooks/use-session.ts`):

```ts
export function useSession() {
  const query = useQuery({
    queryKey: ["auth", "session"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { user: query.data, isLoading: query.isLoading, isError: query.isError };
}
```

Convenção do projeto: toda submissão de formulário usa `useMutation` (ver
`use-login-form.ts`), nunca `fetch` direto dentro do componente.

Queries que renderizam erro próprio podem silenciar o toast global:

```ts
useQuery({
  queryKey,
  queryFn,
  meta: { suppressGlobalErrorToast: true },
});
```

O ESLint usa `@tanstack/eslint-plugin-query` para pegar query key instável e
uso perigoso de dependências do React Query ainda durante desenvolvimento.
