---
video: lC0cr-fdZ2s
videoEn: DBdo7mmuGx4
sidebar_label: Virtual Scrolling
date: "29 de agosto de 2026"
---

# Virtual Scrolling

Renderização dinâmica de listas longas na tela, desenhando apenas os itens
visíveis no momento para economizar memória do navegador. Uma lista de
10.000 linhas, sem essa técnica, criaria 10.000 nós de DOM de uma vez; com
virtualização, só os ~20 que cabem na tela existem no DOM a cada momento —
o resto é calculado sob demanda conforme o usuário rola.

## Quando decide se você precisa disso

Virtual scrolling resolve um problema específico: uma lista *já
carregada no client* que é longa o bastante pra pesar no DOM (milhares de
linhas). Se a tela já usa paginação real no servidor — o client nunca
recebe mais que uma página de linhas por vez — esse problema nunca chega
a existir, porque a lista renderizada de cada vez já é curta por
natureza. Nesse caso, virtualizar não tem o que resolver: a técnica
importa quando NÃO há paginação, não quando há.

Onde ela realmente se aplica: um `<select>`/autocomplete com milhares de
opções carregadas de uma vez, um feed infinito sem paginação por página,
ou qualquer lista que precisa mostrar um conjunto grande inteiro na tela
ao mesmo tempo (não fatiado em páginas). `@tanstack/react-virtual` é a
biblioteca padrão do ecossistema React pra isso hoje — mede a altura
disponível, calcula quais itens estariam visíveis, e só desenha esses no
DOM real, trocando o resto por um espaçador do tamanho certo.
