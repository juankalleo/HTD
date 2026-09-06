---
video: q_ZoX98uopM
videoEn: ZVnjOPwW4ZA
sidebar_label: Tecnologias
date: "29 de agosto de 2026"
---

# Tecnologias do sistema

Pasta de tecnologias — um arquivo por lib, atualizada conforme cada
tecnologia entra em uso no [HTD-Front](https://github.com/juankalleo/HTD-Front). Cada arquivo segue o mesmo molde
(ver abaixo) e vira uma página de tecnologia do wiki.

Molde de cada arquivo:

- **O que é** — uma frase.
- **Por que essa** — motivo real da escolha (não genérico).
- **Versão** — a que está no `package.json` agora.
- **Como importar** — instalação/import de verdade.
- **Exemplo** — código real do projeto (não inventado), copiável.

## Índice

| Tecnologia | Usada em |
|---|---|
| [Next.js (App Router)](nextjs.md) | Base de todo o projeto |
| [pnpm](pnpm.md) | Gerenciador de pacote |
| [Tailwind CSS](tailwind.md) | Estilização |
| [DaisyUI](daisyui.md) | Componentes (botão, input, tabela, modal, drawer...) |
| [MUI](/padrao-frontend/tecnologias/mui) | Avaliado, **não adotado** — conflito de design system com DaisyUI |
| [HeroUI](/padrao-frontend/tecnologias/heroui) | Não adotado — comparação estrutural com DaisyUI |
| [Class Variance Authority](class-variance-authority.md) | Variantes tipadas de UI, começando por `Button` |
| [shadcn/ui](/padrao-frontend/tecnologias/shadcn-ui) | Avaliado, **não adotado** — ver `relatorios/ARQUITETURA.md` |
| [TanStack Table](tanstack-table.md) | Estado/comportamento das tabelas (por cima do DaisyUI) |
| [ECharts / EvilCharts](echarts-evilcharts.md) | Gráficos dos relatórios |
| [MUI X Charts](mui-x-charts.md) | Avaliado, **não adotado** — ver `relatorios/ARQUITETURA.md` |
| [lucide-react](lucide-react.md) | Ícones |
| [Hugeicons](/padrao-frontend/tecnologias/hugeicons) | Avaliado, **não adotado** — ver `lucide-react.md` |
| [TanStack React Query](react-query.md) | Estado assíncrono / cache de dados |
| [React Hook Form + Zod](react-hook-form-zod.md) | Todos os formulários |
| [SweetAlert2](sweetalert2.md) | Feedback de sucesso/erro (toast) |
| [Vitest](vitest.md) | Testes unitários de helpers, schemas e conversores |
| [clsx + tailwind-merge](clsx-tailwind-merge.md) | className condicional (`cn()`) |
| [Puppeteer](puppeteer.md) | Automação Chromium e geração de PDF de relatório |
| [react-easy-crop](react-easy-crop.md) | Recorte/posicionamento de imagem antes do upload (ver [`(../UPLOAD-DE-IMAGEM.md`](../arquivos/UPLOAD-DE-IMAGEM.md)) |
