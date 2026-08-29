---
video: e6FigV2fLC8
---

# Next.js (App Router)

## O que é

Framework React que dá roteamento por pastas, server/client
components, e o servidor de dev/build do projeto inteiro.

## Por que essa

É o framework adotado no projeto. App Router (não Pages
Router) porque é o modelo atual do Next.js. Leitura de apoio:
[Server & Client Components (docs oficiais do Next.js)](https://nextjs.org/docs/app/getting-started/server-and-client-components)
e [Understanding React Server Components (Vercel)](https://vercel.com/blog/understanding-react-server-components)
— o porquê de Server Components serem o padrão (menos JS no cliente, fetch
perto da fonte, sem waterfall de dados).

## Versão

`16.3.3` (`package.json`).

## Como importar

Não se importa — é a base do projeto. Scaffold via
`pnpm create next-app`. Rotas são pastas dentro de `app/`; cada uma vira uma
URL pelo nome da pasta.

## Exemplo real

Grupo de rotas (o parêntese na pasta não entra na URL) e
`layout.tsx` de área protegida:

```tsx
// app/(dashboard)/layout.tsx
"use client";

import { AuthGuard } from "@/features/autenticacao/login/components/auth-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
```

```tsx
// app/(dashboard)/inicio/page.tsx — vira a rota /inicio
"use client";

export default function InicioPage() {
  return <div>...</div>;
}
```

Página que lê `useSearchParams()` precisa de um boundary de `<Suspense>` em
volta (ver `app/(auth)/login/page.tsx`), senão o build quebra.

## Rotas no código

A URL continua sendo definida pelo App Router, mas links e
redirects devem usar os helpers de `lib/routes.ts`, documentados em
[Roteamento](/padrao-frontend/roteamento).
