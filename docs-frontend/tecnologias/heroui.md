---
sidebar_label: HeroUI
date: "30 de agosto de 2026"
---

# HeroUI — não adotado

## O que é

Biblioteca de componente React (`@heroui/react`, antes chamada NextUI) estilizada com Tailwind
CSS por baixo, usando React Aria (da Adobe) pra acessibilidade e Framer Motion pra animação —
diferente do MUI, não usa CSS-in-JS: os componentes vêm com classe Tailwind já aplicada,
customizável via tema próprio.

## Por que não é o que este projeto usa

Mesmo sendo Tailwind-based (sem o conflito de dois sistemas de CSS-in-JS que descarta o MUI — ver
[MUI](/padrao-frontend/tecnologias/mui)), HeroUI ainda é um **componente React com runtime
próprio**: cada botão/modal/input é JavaScript importado da lib, com o próprio comportamento e
dependência (React Aria, Framer Motion) embutidos. [DaisyUI](/padrao-frontend/tecnologias/daisyui)
resolve o mesmo problema visual de um jeito estruturalmente diferente — é **só classe CSS**
(um plugin Tailwind), sem componente JavaScript nenhum: o HTML/JSX continua sendo escrito à mão
(`<button class="btn btn-primary">`), sem importar comportamento de lugar nenhum. Isso significa
zero dependência de runtime adicional, zero decisão de "como estender o componente da lib quando
ele não faz exatamente o que preciso" — o CSS é só aplicado em cima de qualquer marcação.

## O trade-off real entre as duas abordagens

HeroUI dá comportamento pronto (acessibilidade de teclado, foco, animação) de graça — DaisyUI
exige que esse comportamento seja implementado à mão ou venha de outra lib headless (o TanStack
Table já cumpre esse papel pra tabela, ver
[TanStack Table](/padrao-frontend/tecnologias/tanstack-table)). Pra um projeto que já tem essa
peça (headless, comportamento) resolvida caso a caso e busca controle total sobre a marcação
final, DaisyUI continua sendo a peça mais simples — HeroUI voltaria a fazer sentido se o projeto
precisasse de um catálogo de componente pronto muito maior do que o DaisyUI oferece, mais rápido
do que construir/estender componente por componente.

## Leitura de apoio

- [HeroUI — documentação oficial](https://www.heroui.com/) — catálogo de componente e customização de tema.
- [React Aria — Adobe](https://react-spectrum.adobe.com/react-aria/) — a base de acessibilidade que o HeroUI usa por baixo.
