---
video: NhUr8cwDiiM
videoEn: WaFBiDgqctY
description: "Padrão frontend do How to Dev para aprender e estruturar aplicações Next.js com rotas, componentes, dados, formulários, arquivos, cache e segurança."
date: "30 de agosto de 2026"
---

# Padrão Frontend

> **Tecnologia principal: Next.js 16** (App Router, TypeScript). Conteúdo em evolução: esta documentação reflete os conceitos e formas aplicadas nos padrões de frontend do How to Dev.

## Visão geral

Esta área documenta o padrão de front-end usado como base para os sistemas do How to Dev. A regra principal é simples: o `app/` existe para rotas, layouts e composição de tela; a regra de produto fica em `features/`; e o que for realmente reutilizável fica em `shared/`. Isso evita que a pasta de rotas vire um depósito de componentes, hooks, serviços e regras de negócio misturados.

O padrão segue a ideia do App Router do Next.js: pastas dentro de `app/` definem segmentos de URL, enquanto arquivos como `page.tsx` e `layout.tsx` montam a interface daquele segmento. A documentação oficial mostra esse funcionamento em [Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) e também mostra estratégias para [manter arquivos de projeto fora do `app`](https://nextjs.org/docs/app/getting-started/project-structure#store-project-files-outside-of-app) ou [separar arquivos por feature ou rota](https://nextjs.org/docs/app/getting-started/project-structure#split-project-files-by-feature-or-route).

## Versão do Next.js

O projeto usa `next@latest` no `package.json`, e o lockfile atual resolve para `Next.js 16.3.3`. Na prática, isso significa que a documentação daqui assume App Router, Server Components por padrão, layouts aninhados, rotas por sistema de arquivos e separação explícita entre componentes de servidor e componentes marcados com `"use client"`.

## Estrutura de pastas

A estrutura real do [HTD-Front](https://github.com/juankalleo/HTD-Front) (sem `src/` — as pastas ficam na raiz do
projeto) mantém a rota pequena e move a implementação para módulos com dono
claro:

```text
app/
  (auth)/          # login, logout, esqueci-senha, alterar-senha, primeiro-acesso
  (admin)/         # gestão: usuários, tipos de usuário, papéis, permissões,
                   #   config institucional, referenciais
  (config)/        # configurações pessoais
  (dashboard)/
  api/             # rotas de servidor (ex.: /api/relatorios/pdf)
  layout.tsx        # Server Component assíncrono — aplica branding institucional
  page.tsx, loading.tsx, error.tsx, global-error.tsx, not-found.tsx
features/
  autenticacao/     # login/ logout/ esqueci-senha/ alterar-senha/ primeiro-acesso/
                    #   cada um com components/ hooks/ schemas/ types/ constants/
  admin/            # usuarios/ tipos-usuario/ papeis/ permissoes/
                    #   config-institucional/ referenciais/
  sistema/          # config/ temas/ erros/
  relatorios/       # usuarios/ orgaos/ unidades/ shared/
                    #   cada um com components/ hooks/ schemas/ types/
shared/
  ui/               # building blocks sem domínio:
                    #   sistema/ (Button, Pagination, Toast, ResultsCount,
                    #     ConfirmDialog, FormScreen, PageTitle, ImageCropperModal)
                    #   filtros/ (SearchInput, FilterSelect)
                    #   tabelas/ (DataTable, table)
                    #   graficos/evilcharts/ (wrappers ECharts)
                    #   relatorios/ (KpiCounter, ReportChartCard, ReportKpisGrid)
  layout/           # AppShell, AppSidebar, AppHeader, navigation.ts
  forms/            # FormField
  hooks/            # use-admin-resource.ts (CRUD genérico via React Query),
                    #   use-configuracao-institucional.ts
  query/            # QueryProvider (React Query)
services/
  api-admin.ts        # fetch genérico p/ qualquer /api/v1/admin/<recurso>
  api-identity.ts     # /api/v1/auth/*
  api-institucional.ts# /api/v1/c_configuracoes/*
  api-relatorio-pdf.ts / api-relatorio-excel.ts  # exportação
lib/
  auth.ts, cn.ts, avatar.ts, error-utils.ts, routes.ts
  image-crop.ts, download-arquivo.ts, ransack.ts
  server/             # auth-guard.ts, relatorio-pdf/, relatorio-excel/
  __tests__/          # testes de helpers e schemas
theme/
  colors.ts, fonts.ts, icons.tsx, index.ts   # tokens e ícones — sem docs próprios
```

> Este front é o **padrão-base**: novos projetos derivam daqui, então a
> estrutura acima é a referência obrigatória. Os hooks de `shared/hooks`
> (`use-admin-resource`, `use-configuracao-institucional`) são o ponto de
> partida pra qualquer feature de listagem/cadastro — ver
> [Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api).

O `app/` decide qual tela aparece em cada URL. `features/` guarda o
comportamento de cada domínio, como autenticação, usuários ou configuração
institucional — cada feature com sua própria `types/`, `schemas/`, `hooks/`,
`constants/` e `components/` (ver [Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api)
pro detalhe de cada uma). `shared/` concentra componentes e hooks que não
pertencem a uma feature específica. `services/` guarda **só** chamada
`fetch` — nenhum componente chama `services/` direto, sempre por um hook do
React Query.

## Por que features

O modelo por feature escala melhor porque junta o que muda junto. Se a autenticação muda, os componentes, schemas, tipos e chamadas desse fluxo ficam próximos. Isso reduz importação cruzada, evita duplicação de regra em páginas diferentes e deixa mais claro onde mexer quando uma regra de negócio muda.

O `app/` continua importante, mas como camada de entrada. Uma página pode importar uma tela pronta de `features/autenticacao`, aplicar metadata, escolher layout e encerrar ali. O restante da implementação não precisa ficar enterrado dentro de uma árvore de URL.

## Comparação com estruturas geradas por IA

Quando uma ferramenta como Claude gera telas sem conhecer o histórico do sistema, ela costuma seguir um caminho genérico: criar `components/`, `hooks/`, `utils/` e às vezes jogar componentes específicos dentro de `app/minha-rota`. Isso funciona para protótipo pequeno, mas fica frágil quando o sistema cresce, porque a fronteira entre produto, layout e infraestrutura some.

Aqui a regra é mais objetiva: componente que pertence a uma regra de produto fica na feature; componente visual sem domínio vai para `shared/ui`; layout persistente vai para `shared/layout`; e rota do Next fica fina, sem acumular regra.

## Autenticação

[Autenticação](/padrao-frontend/seguranca/autenticacao) cobre login, logout, sessão e os fluxos de recuperação/definição de senha: o que já funciona de verdade e o que ainda depende do backend.

## Dados e API

[Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api) explica a regra que organiza toda chamada de rede no projeto: `fetch` só existe em `services/`, todo componente fala com dado remoto por um hook do React Query — e onde fica cada coisinha (`types/`, `schemas/`, `hooks/`, `constants/`, `lib/`) dentro de uma feature.

## Formulários

[Formulários](/padrao-frontend/formularios) documenta a cadeia schema Zod → React Hook Form → mutation → toast, a convenção de rota própria pra criar/editar (em vez de modal) e o padrão de upload de arquivo fora do React Hook Form.

## Roteamento

[Roteamento](/padrao-frontend/roteamento) documenta a nomeação húngara/Rails-like usada no front: `a_papeis_path`, `new_a_papel_path`, `edit_a_papel_path(id)`, quando usar `id`, quando usar `slug`, e como montar query string de relatório com `withQuery()`.

## Tabelas

[Tabelas](/padrao-frontend/tabelas) cobre o padrão obrigatório de tabela de dado real: shadcn/ui Table para a marcação visual, Tailwind para o acabamento e TanStack Table para sorting, paginação e estado controlado.

## Relatórios

[Relatórios](/padrao-frontend/relatorios) documenta a composição de telas analíticas: filtros reaproveitando o padrão de formulário, KPIs e gráficos com MUI X Charts, tabelas padronizadas e geração de PDF (Puppeteer) e Excel (ExcelJS) — ver [Arquivos](/padrao-frontend/arquivos) para os formatos de exportação. O primeiro padrão completo é o de [Relatórios de usuários](/padrao-frontend/relatorios/usuarios).

## Arquivos

[Arquivos](/padrao-frontend/arquivos) documenta a entrada e saída de arquivo no [HTD-Front](https://github.com/juankalleo/HTD-Front): o upload de imagem com recorte (react-easy-crop) antes de enviar, e a geração de relatórios em PDF (Puppeteer) e Excel (ExcelJS) no servidor — com preview obrigatório antes do download.

## Administração e RBAC

[Administração e RBAC](/padrao-frontend/seguranca/administracao-rbac) explica como usuários, tipos de usuário, papéis e permissões do front conversam com o RBAC granular já pronto no backend Rails — incluindo por que **recursos** não tem tela de cadastro.

## Configuração institucional

[Configuração institucional](/padrao-frontend/layout/configuracao-institucional) documenta como um admin define tema, fonte, escala, tamanho de sidebar/topbar (arrastável), nome e identidade visual padrão pra todo mundo do tenant — aplicado no servidor, sem flash.

## Layout de aplicação

[Layout de aplicação](/padrao-frontend/layout/layout-da-aplicacao) documenta o shell autenticado: sidebar, topbar, drawer mobile via CSS puro e como o tamanho do shell vem da configuração institucional em vez de valor fixo.

## Cache

[Cache](/padrao-frontend/cache) explica as duas camadas de cache do projeto — React Query (dados remotos, `staleTime`, invalidação) e o cache de rota do App Router — e o padrão de `revalidate`/`no-store` pra conteúdo autenticado vs. público.

## Dados em mutação

[Dados em mutação](/padrao-frontend/tratamento-de-dados/dados-em-mutacao) documenta a cadeia de escrita no servidor: React Hook Form + Zod → `useMutation` → `services/` → Toast, e como o cache é atualizado (invalidate/set/clear) depois de cada mutação.

## Otimização de imagem

[Otimização de imagem](/padrao-frontend/estilos/otimizacao-imagem) cobre o padrão `next/image` e a exceção real do [HTD-Front](https://github.com/juankalleo/HTD-Front): imagens vêm da API em host dinâmico, então usam `<img>` consciente com `eslint-disable` justificado.

## Otimização de fontes

[Otimização de fontes](/padrao-frontend/estilos/otimizacao-fontes) documenta o carregamento via `next/font/google` em `app/layout.tsx`, a troca de fonte em runtime pela Configuração Institucional e a regra de nunca usar `<link>` pro Google Fonts.

## Conceitos técnicos

[Conceitos técnicos](/padrao-frontend/conceitos-tecnicos) documenta, um por página, 18 conceitos padrão de frontend (CORS, debounce/throttle, virtual scrolling, hydration, code splitting, tree shaking, SSR, Atomic Design, state management, acessibilidade, critical CSS, lazy loading, BFF, progressive enhancement, lost update, web concurrency, reverse proxy, idempotência): o que é cada um, se e como o padrão frontend usa, o porquê da decisão, e quando cada um passaria a valer se hoje não for usado.

## Leitura recomendada

Cinco livros de base por trás de decisões reais deste padrão — cada um com
página própria em [Leitura recomendada](/padrao-frontend/leitura-recomendada),
citado nas páginas de conceito onde ele se aplica de verdade.

| Capa | Livro | Assuntos principais |
|---|---|---|
| [![Designing Data-Intensive Applications](https://covers.openlibrary.org/b/id/8434671-S.jpg)](/padrao-frontend/leitura-recomendada/designing-data-intensive-applications) | **[Designing Data-Intensive Applications](/padrao-frontend/leitura-recomendada/designing-data-intensive-applications)** — Martin Kleppmann | Replicação, partição, transação, *lost update*, consistência eventual |
| [![Software Engineering at Google](https://covers.openlibrary.org/b/id/10450993-S.jpg)](/padrao-frontend/leitura-recomendada/software-engineering-at-google) | **[Software Engineering at Google](/padrao-frontend/leitura-recomendada/software-engineering-at-google)** — Titus Winters, Tom Manshreck, Hyrum Wright | Sustentabilidade de código, cultura de teste e revisão, Lei de Hyrum |
| [![Distributed Systems](https://covers.openlibrary.org/b/id/11158985-S.jpg)](/padrao-frontend/leitura-recomendada/distributed-systems) | **[Distributed Systems](/padrao-frontend/leitura-recomendada/distributed-systems)** — Andrew S. Tanenbaum, Maarten van Steen | Arquitetura, comunicação, coordenação, tolerância a falha entre máquinas |
| [![High Performance Browser Networking](https://covers.openlibrary.org/b/isbn/9781449344764-S.jpg)](/padrao-frontend/leitura-recomendada/high-performance-browser-networking) | **[High Performance Browser Networking](/padrao-frontend/leitura-recomendada/high-performance-browser-networking)** — Ilya Grigorik | TCP, TLS, HTTP/2 e performance de rede no navegador |
| [![Refactoring](https://covers.openlibrary.org/b/id/8507565-S.jpg)](/padrao-frontend/leitura-recomendada/refactoring) | **[Refactoring](/padrao-frontend/leitura-recomendada/refactoring)** — Martin Fowler, Kent Beck | Catálogo de como melhorar estrutura de código sem mudar comportamento |

## Como preencher

O conteúdo acima descreve o padrão atual do [HTD-Front](https://github.com/juankalleo/HTD-Front).

## Leitura de apoio

- [Next.js — App Router (docs)](https://nextjs.org/docs/app) — base de roteamento, layouts e Server Components adotada aqui.
- [Tailwind CSS v4 — Docs](https://tailwindcss.com/docs) e [daisyUI — Docs](https://daisyui.com) — sistema de estilo por tokens.
- [TanStack Query — Overview](https://tanstack.com/query/latest/docs/framework/react/overview) — fonte de verdade do dado assíncrono no front.
