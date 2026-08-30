---
video: er_QPBldsXE
videoEn: wcTzlJi2Oz4
sidebar_label: shadcn/ui
---

# shadcn/ui — avaliado, não adotado

**Status:** avaliado na spec inicial dos relatórios e **não adotado**.

## Por que foi descartado

O projeto inteiro segue o design system do **DaisyUI** + Tailwind. Trazer o
pacote `shadcn/ui` criaria um **segundo sistema de design** rodando só em
parte da aplicação (relatórios), quebrando a consistência visual e o tema
institucional (`data-theme`, `--app-scale`, overrides de aparência).

A alternativa adotada mantém um único padrão:

| Necessidade            | Escolha                                  | Motivo                                         |
| ---------------------- | ---------------------------------------- | ---------------------------------------------- |
| Tabela de dados        | TanStack Table (`shared/ui/tabelas`)     | Headless — respeita o tema DaisyUI.            |
| Gráficos               | ECharts (via wrapper local EvilCharts)   | Entra atrás de wrapper, sem trocar design.     |
| Componentes de UI      | DaisyUI + Tailwind                      | Design system único de todo o app.             |

O mesmo raciocínio valeu para **MUI X Charts** (ver
[`mui-x-charts.md`](/padrao-frontend/tecnologias/mui-x-charts)): `@mui/material`
+ `@emotion` também introduziria um sistema de design paralelo.

## Onde isso é aplicado

Documentado na decisão de arquitetura de relatórios
(`relatorios/ARQUITETURA.md`, seção "Decisões") e em
[Tailwind CSS](/padrao-frontend/tecnologias/tailwind).
