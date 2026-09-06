---
video: NhUr8cwDiiM
videoEn: WaFBiDgqctY
date: "August 29, 2026"
---

# Frontend Standard

> Evolving content: this documentation reflects the concepts and patterns applied in How to Dev's frontend standards.

## Overview

This area documents the frontend standard used as the base for How to Dev's systems. The main rule is simple: `app/` exists for routes, layouts, and screen composition; product rules live in `features/`; and whatever is genuinely reusable lives in `shared/`. This keeps the routes folder from turning into a dumping ground of mixed components, hooks, services, and business rules.

The standard follows the Next.js App Router idea: folders inside `app/` define URL segments, while files like `page.tsx` and `layout.tsx` assemble that segment's interface. The official docs show how this works in [Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) and also cover strategies to [keep project files outside of `app`](https://nextjs.org/docs/app/getting-started/project-structure#store-project-files-outside-of-app) or [split files by feature or route](https://nextjs.org/docs/app/getting-started/project-structure#split-project-files-by-feature-or-route).

## Next.js version

The project uses `next@latest` in `package.json`, and the current lockfile resolves to `Next.js 16.3.3`. In practice, this means the documentation here assumes App Router, Server Components by default, nested layouts, filesystem-based routes, and an explicit split between server components and components marked `"use client"`.

## Folder structure

The real structure of [HTD-Front](https://github.com/juankalleo/HTD-Front) (no `src/` — folders sit at the project
root) keeps the route thin and moves implementation into modules with a clear
owner:

```text
app/
  (auth)/          # login, logout, forgot-password, change-password, first-access
  (admin)/         # management: users, user types, roles, permissions,
                   #   institutional config, reference data
  (config)/        # personal settings
  (dashboard)/
  api/             # server routes (e.g.: /api/relatorios/pdf)
  layout.tsx        # async Server Component — applies institutional branding
  page.tsx, loading.tsx, error.tsx, global-error.tsx, not-found.tsx
features/
  autenticacao/     # login/ logout/ forgot-password/ change-password/ first-access/
                    #   each with components/ hooks/ schemas/ types/ constants/
  admin/            # users/ user-types/ roles/ permissions/
                    #   institutional-config/ reference-data/
  sistema/          # config/ themes/ errors/
  relatorios/       # users/ orgaos/ unidades/ shared/
                    #   each with components/ hooks/ schemas/ types/
shared/
  ui/               # domain-free building blocks:
                    #   sistema/ (Button, Pagination, Toast, ResultsCount,
                    #     ConfirmDialog, FormScreen, PageTitle, ImageCropperModal)
                    #   filtros/ (SearchInput, FilterSelect)
                    #   tabelas/ (DataTable, table)
                    #   graficos/evilcharts/ (ECharts wrappers)
                    #   relatorios/ (KpiCounter, ReportChartCard, ReportKpisGrid)
  layout/           # AppShell, AppSidebar, AppHeader, navigation.ts
  forms/            # FormField
  hooks/            # use-admin-resource.ts (generic CRUD via React Query),
                    #   use-configuracao-institucional.ts
  query/            # QueryProvider (React Query)
services/
  api-admin.ts        # generic fetch for any /api/v1/admin/<resource>
  api-identity.ts     # /api/v1/auth/*
  api-institucional.ts# /api/v1/c_configuracoes/*
  api-relatorio-pdf.ts / api-relatorio-excel.ts  # export
lib/
  auth.ts, cn.ts, avatar.ts, error-utils.ts, routes.ts
  image-crop.ts, download-arquivo.ts, ransack.ts
  server/             # auth-guard.ts, relatorio-pdf/, relatorio-excel/
  __tests__/          # helper and schema tests
theme/
  colors.ts, fonts.ts, icons.tsx, index.ts   # tokens and icons — no dedicated docs
```

> This front is the **base standard**: new projects derive from it, so the
> structure above is the mandatory reference. The `shared/hooks` hooks
> (`use-admin-resource`, `use-configuracao-institucional`) are the starting
> point for any list/registration feature — see
> [Data and API](/padrao-frontend/tratamento-de-dados/dados-e-api).

`app/` decides which screen shows up at each URL. `features/` holds each
domain's behavior, like authentication, users, or institutional config —
each feature with its own `types/`, `schemas/`, `hooks/`,
`constants/`, and `components/` (see [Data and API](/padrao-frontend/tratamento-de-dados/dados-e-api)
for the detail on each). `shared/` gathers components and hooks that don't
belong to a specific feature. `services/` holds **only** `fetch` calls — no
component calls `services/` directly, always through a React Query hook.

## Why features

The feature-based model scales better because it keeps what changes together, together. If authentication changes, that flow's components, schemas, types, and calls stay close by. This reduces cross-imports, avoids duplicating rules across different pages, and makes it clearer where to touch code when a business rule changes.

`app/` still matters, but as an entry layer. A page can import a ready-made screen from `features/autenticacao`, apply metadata, pick a layout, and stop there. The rest of the implementation doesn't need to live buried inside a URL tree.

## Compared to AI-generated structures

When a tool like Claude generates screens without knowing the system's history, it tends to follow a generic path: create `components/`, `hooks/`, `utils/`, and sometimes drop route-specific components straight into `app/my-route`. That works for a small prototype, but gets fragile as the system grows, because the boundary between product, layout, and infrastructure disappears.

Here the rule is more concrete: a component that belongs to a product rule lives in the feature; a domain-free visual component goes to `shared/ui`; a persistent layout goes to `shared/layout`; and a Next.js route stays thin, without accumulating rules.

## Authentication

[Authentication](/padrao-frontend/seguranca/autenticacao) covers login, logout, session, and the password recovery/setup flows: what actually works today and what still depends on the backend.

## Data and API

[Data and API](/padrao-frontend/tratamento-de-dados/dados-e-api) explains the rule that organizes every network call in the project: `fetch` only exists in `services/`, every component talks to remote data through a React Query hook — and where each piece (`types/`, `schemas/`, `hooks/`, `constants/`, `lib/`) lives inside a feature.

## Forms

[Forms](/padrao-frontend/formularios) documents the Zod schema → React Hook Form → mutation → toast chain, the convention of a dedicated route for create/edit (instead of a modal), and the file upload pattern outside of React Hook Form.

## Routing

[Routing](/padrao-frontend/roteamento) documents the Hungarian/Rails-like naming used in the front: `a_papeis_path`, `new_a_papel_path`, `edit_a_papel_path(id)`, when to use `id`, when to use `slug`, and how to build a report query string with `withQuery()`.

## Tables

[Tables](/padrao-frontend/tabelas) covers the mandatory pattern for a real-data table: shadcn/ui Table for the visual markup, Tailwind for finishing touches, and TanStack Table for sorting, pagination, and controlled state.

## Reports

[Reports](/padrao-frontend/relatorios) documents how analytical screens are composed: filters reusing the form pattern, KPIs and charts with MUI X Charts, standardized tables, and PDF (Puppeteer) and Excel (ExcelJS) generation — see [Files](/padrao-frontend/arquivos) for export formats. The first complete standard is [User reports](/padrao-frontend/relatorios/usuarios).

## Files

[Files](/padrao-frontend/arquivos) documents file input and output in [HTD-Front](https://github.com/juankalleo/HTD-Front): image upload with cropping (react-easy-crop) before sending, and server-side PDF (Puppeteer) and Excel (ExcelJS) report generation — with a mandatory preview before download.

## Administration and RBAC

[Administration and RBAC](/padrao-frontend/seguranca/administracao-rbac) explains how the front's users, user types, roles, and permissions talk to the granular RBAC already built into the Rails backend — including why **resources** don't have a registration screen.

## Institutional configuration

[Institutional configuration](/padrao-frontend/layout/configuracao-institucional) documents how an admin sets theme, font, scale, sidebar/topbar size (draggable), name, and default visual identity for everyone in the tenant — applied server-side, with no flash.

## Application layout

[Application layout](/padrao-frontend/layout/layout-da-aplicacao) documents the authenticated shell: sidebar, topbar, mobile drawer via pure CSS, and how the shell's size comes from institutional config instead of a fixed value.

## Cache

[Cache](/padrao-frontend/cache) explains the project's two cache layers — React Query (remote data, `staleTime`, invalidation) and the App Router's route cache — and the `revalidate`/`no-store` pattern for authenticated vs. public content.

## Mutating data

[Mutating data](/padrao-frontend/tratamento-de-dados/dados-em-mutacao) documents the server write chain: React Hook Form + Zod → `useMutation` → `services/` → Toast, and how the cache is updated (invalidate/set/clear) after each mutation.

## Image optimization

[Image optimization](/padrao-frontend/estilos/otimizacao-imagem) covers the `next/image` pattern and [HTD-Front](https://github.com/juankalleo/HTD-Front)'s real exception: images come from the API on a dynamic host, so they use a deliberate `<img>` with a justified `eslint-disable`.

## Font optimization

[Font optimization](/padrao-frontend/estilos/otimizacao-fontes) documents loading via `next/font/google` in `app/layout.tsx`, runtime font switching through Institutional Configuration, and the rule to never use a `<link>` for Google Fonts.

## Technical concepts

[Technical concepts](/padrao-frontend/conceitos-tecnicos) documents, one per page, 18 standard frontend concepts (CORS, debounce/throttle, virtual scrolling, hydration, code splitting, tree shaking, SSR, Atomic Design, state management, accessibility, critical CSS, lazy loading, BFF, progressive enhancement, lost update, web concurrency, reverse proxy, idempotency): what each one is, whether and how the frontend standard uses it, the reasoning behind the decision, and when each one would start to matter if it isn't used today.

## Recommended reading

Five foundational books behind real decisions in this standard — each with its
own page in [Recommended reading](/padrao-frontend/leitura-recomendada),
cited on the concept pages where it genuinely applies.

| Cover | Book | Main subjects |
|---|---|---|
| [![Designing Data-Intensive Applications](https://covers.openlibrary.org/b/id/8434671-S.jpg)](/padrao-frontend/leitura-recomendada/designing-data-intensive-applications) | **[Designing Data-Intensive Applications](/padrao-frontend/leitura-recomendada/designing-data-intensive-applications)** — Martin Kleppmann | Replication, partitioning, transactions, *lost update*, eventual consistency |
| [![Software Engineering at Google](https://covers.openlibrary.org/b/id/10450993-S.jpg)](/padrao-frontend/leitura-recomendada/software-engineering-at-google) | **[Software Engineering at Google](/padrao-frontend/leitura-recomendada/software-engineering-at-google)** — Titus Winters, Tom Manshreck, Hyrum Wright | Code sustainability, testing and review culture, Hyrum's Law |
| [![Distributed Systems](https://covers.openlibrary.org/b/id/11158985-S.jpg)](/padrao-frontend/leitura-recomendada/distributed-systems) | **[Distributed Systems](/padrao-frontend/leitura-recomendada/distributed-systems)** — Andrew S. Tanenbaum, Maarten van Steen | Architecture, communication, coordination, fault tolerance across machines |
| [![High Performance Browser Networking](https://covers.openlibrary.org/b/isbn/9781449344764-S.jpg)](/padrao-frontend/leitura-recomendada/high-performance-browser-networking) | **[High Performance Browser Networking](/padrao-frontend/leitura-recomendada/high-performance-browser-networking)** — Ilya Grigorik | TCP, TLS, HTTP/2, and browser network performance |
| [![Refactoring](https://covers.openlibrary.org/b/id/8507565-S.jpg)](/padrao-frontend/leitura-recomendada/refactoring) | **[Refactoring](/padrao-frontend/leitura-recomendada/refactoring)** — Martin Fowler, Kent Beck | Catalog of how to improve code structure without changing behavior |

## How this gets filled in

The content above describes [HTD-Front](https://github.com/juankalleo/HTD-Front)'s current standard.

## Further reading

- [Next.js — App Router (docs)](https://nextjs.org/docs/app) — routing, layout, and Server Components foundation adopted here.
- [Tailwind CSS v4 — Docs](https://tailwindcss.com/docs) and [daisyUI — Docs](https://daisyui.com) — token-based styling system.
- [TanStack Query — Overview](https://tanstack.com/query/latest/docs/framework/react/overview) — source of truth for async data on the front.
