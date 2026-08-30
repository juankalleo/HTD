---
video: WEitNRycnpI
videoEn: Fu_YFp-9xoQ
---

# Relatórios

Relatórios ficam em uma área própria da sidebar porque têm uma composição
diferente de CRUD comum: filtros, KPIs, tabela analítica e exportação
precisam seguir o mesmo contrato em todas as telas.

## Visão geral

A tela de relatório começa pelos filtros, mostra os KPIs logo abaixo,
renderiza a tabela e deixa a exportação no cabeçalho do conteúdo. A regra é
não misturar filtro local, contador calculado no componente e geração de
PDF dentro do browser.

**Sem MUI X Charts nem shadcn/ui** — os dois foram avaliados na spec
original e descartados por criarem um segundo design system em paralelo ao
DaisyUI que o resto do projeto usa (ver
[`../tecnologias/mui-x-charts.md`](../tecnologias/mui-x-charts.md) e
[`../tecnologias/shadcn-ui.md`](/padrao-frontend/tecnologias/shadcn-ui)). Tabela usa
TanStack Table (headless) por cima da `<table>` do DaisyUI; gráfico fica
pra quando um relatório precisar de verdade e o backend expuser o campo
temporal necessário, com uma lib compatível com o tema institucional.

## Estrutura padrão

```text
features/
  relatorios/
    usuarios/
      types/index.ts
      hooks/
        use-relatorio-usuarios-kpis.ts
        use-exportar-relatorio-usuarios-pdf.ts
      components/
        relatorio-usuarios-view.tsx
        relatorio-usuarios-kpis.tsx
services/
  api-relatorio-pdf.ts
app/
  api/relatorios/usuarios/pdf/route.ts   # única rota em app/api/*, ver ARQUITETURA.md
  (admin)/relatorios/usuarios/page.tsx
```

O relatório segue a estrutura por feature descrita em
[`../DADOS-E-API.md`](/padrao-frontend/tratamento-de-dados/dados-e-api): componente não chama `fetch`
direto, hook resolve a chamada, type espelha o contrato real da API
(nada de campo inventado), serviço de PDF fica fora do componente React.

## Relatórios disponíveis

- [`Relatórios de usuários`](usuarios.md) — o primeiro, referência pros
  próximos: filtros reais, KPIs por contagem, tabela com TanStack Table e
  PDF com Puppeteer.

## Contrato mínimo

| Parte | Padrão |
|---|---|
| Campos | Só o que o serializer real da API devolve — nunca inventa campo (ver [`../ADMINISTRACAO-RBAC.md`](/padrao-frontend/seguranca/administracao-rbac) pros limites reais do `UserSerializer`) |
| Filtros | Busca (Ransack `_cont`) + filtro (Ransack `_eq`), mesmo padrão de [`../TABELAS.md`](../TABELAS.md) |
| KPIs | Contagem real via `pagy.total_count`, nunca `.length` de array já carregado nem número calculado no JSX |
| Tabelas | TanStack Table (`shared/ui/tabelas/data-table.tsx`) + `shared/ui/tabelas/table.tsx` (DaisyUI com shape shadcn) |
| PDF | Puppeteer no servidor (`app/api/.../route.ts`, runtime `nodejs`), nunca no Client Component |

Detalhe completo (decisões, exemplos, checklist) em
[`ARQUITETURA.md`](ARQUITETURA.md).

## Leitura de apoio

- [TanStack Table — Docs](https://tanstack.com/table/latest/docs/intro) — por que tabela headless sobre DaisyUI (em vez de MUI X / shadcn).
- [Apache ECharts — Docs](https://echarts.apache.org) — gráficos compatíveis com o tema institucional.
- [Next.js — App Router (docs)](https://nextjs.org/docs/app) — por que o PDF roda em `app/api/*` (Route Handler, runtime nodejs).
