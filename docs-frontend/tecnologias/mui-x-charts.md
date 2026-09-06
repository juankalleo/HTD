---
video: WEitNRycnpI
videoEn: haVAA43wVV8
date: "29 de agosto de 2026"
---

# MUI X Charts — avaliado, não adotado

## O que é

Pacote de gráficos React da MUI X para visualização de dados:
linha, barra, pizza, scatter, gauge, sparkline. Documentação oficial em
[MUI X Charts](https://mui.com/x/react-charts/).

## Por que não entrou

A spec original de relatórios propunha `LineChart`
do MUI X Charts pra evolução temporal. Decisão real: **não** — precisaria
de `@mui/material` + `@emotion/react` + `@emotion/styled`, reintroduzindo
exatamente o stack que este projeto evita (Tailwind sem MUI/shadcn). O tema
institucional (DaisyUI, `data-theme`) não alcançaria um gráfico MUI sem uma
ponte de tema própria — dois sistemas de cor coexistindo.

## O que ficou no lugar

O primeiro relatório real (`/relatorios/usuarios`,
ver [`../relatorios/ARQUITETURA.md`](../relatorios/ARQUITETURA.md)) usa só `KpiCounter`
(`shared/ui/kpi-counter.tsx`, `stat` do DaisyUI) pra contador — sem gráfico
de série temporal ainda, porque o backend também não expõe nenhum campo de
data (ex.: usuário criado em X) que justificasse um gráfico de evolução
sem inventar dado. Quando um relatório precisar de gráfico de verdade, a
escolha de lib nessa hora deve continuar DaisyUI-compatível (SVG puro,
`recharts` com tema custom, ou similar) — não retomar MUI por conveniência.
