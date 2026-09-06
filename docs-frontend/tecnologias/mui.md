---
sidebar_label: MUI
date: "30 de agosto de 2026"
---

# MUI — avaliado, não adotado

## O que é

**MUI** (`@mui/material`) é o design system de componentes React mais estabelecido do
ecossistema — biblioteca completa de componente (botão, input, tabela, modal, data grid) que
implementa o Material Design do Google, estilizado via CSS-in-JS (Emotion) por baixo.

**MUI X** é a família de pacotes **avançados** construída em cima do MUI core — não é uma lib
separada, é uma extensão: Data Grid (tabela com filtro/agrupamento/edição avançada), Date/Time
Pickers, e Charts (linha, barra, pizza — ver
[MUI X Charts](/padrao-frontend/tecnologias/mui-x-charts), já avaliado e documentado
separadamente). Parte do catálogo do MUI X é paga (Pro/Premium), diferente do MUI core, que é
inteiramente MIT.

## Por que não entrou

Mesmo raciocínio já documentado em
[MUI X Charts](/padrao-frontend/tecnologias/mui-x-charts) e
[shadcn/ui](/padrao-frontend/tecnologias/shadcn-ui): trazer `@mui/material` significa trazer
junto `@emotion/react` + `@emotion/styled` — um sistema de estilização CSS-in-JS **completo**,
concorrente com o Tailwind + DaisyUI que já é o design system único do projeto. Os dois sistemas
coexistindo não é só redundância de bundle — é dois jeitos diferentes de resolver tema
(`data-theme` do DaisyUI vs. `ThemeProvider` do MUI) que não conversam entre si sem uma ponte
própria, e cada componente novo passaria a exigir a pergunta "isso é DaisyUI ou é MUI?".

## O que o MUI faz bem (pra contexto, não pra uso aqui)

Vale reconhecer o motivo de ser tão adotado no mercado: catálogo de componente enorme e maduro
(inclusive muito do que o MUI X Data Grid resolve — ordenação/filtro/agrupamento avançado de
tabela — é trabalho real que teria que ser construído à mão por cima do TanStack Table headless
usado aqui), acessibilidade cuidada por padrão, e documentação extensa. A régua de decisão não é
"MUI é ruim" — é "traz um segundo design system pra um projeto que já tem um single source of
truth visual", o mesmo trade-off que já descartou shadcn/ui.

## Leitura de apoio

- [MUI — documentação oficial](https://mui.com/material-ui/) — o catálogo completo de componente core.
- [MUI X — documentação oficial](https://mui.com/x/introduction/) — Data Grid, Date Pickers e Charts.
