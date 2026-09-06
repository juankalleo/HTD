---
video: bZpNSxOlCjs
videoEn: txAE6yT0Eu8
sidebar_label: Critical CSS
date: "29 de agosto de 2026"
---

# Critical CSS

Técnica de extrair e injetar o CSS necessário para renderizar o topo da
página (above the fold) diretamente no HTML — evita que o navegador espere
o carregamento de uma folha de estilo externa inteira antes de pintar o
que já está visível na primeira dobra da tela.

## Quando decide se você precisa disso

Essa técnica existe pra acelerar o primeiro paint de página **pública**,
onde métrica de SEO/Core Web Vitals de visitante anônimo importa — o
tempo até a primeira pintura de tela influencia ranqueamento de busca e
taxa de abandono de quem nunca usou o produto antes. Numa tela que só
existe atrás de login (ver
[Progressive Enhancement](/padrao-frontend/conceitos-tecnicos/progressive-enhancement)
pro mesmo raciocínio), esse visitante anônimo medindo a métrica não
existe — o ganho de otimizar o primeiro paint de uma tela que só abre
depois de autenticar é marginal comparado ao de uma landing pública.

Onde a técnica ajuda de verdade: qualquer framework moderno com SSR
(Next.js incluso) já resolve boa parte disso via code splitting de CSS
por rota — a página só carrega o CSS que a rota específica usa, não a
folha de estilo inteira do app. Extrair manualmente o "critical CSS"
(above the fold) só passa a valer a pena além disso quando a página
pública em questão tem uma folha de estilo grande o bastante pra o code
splitting por rota não ser suficiente sozinho.
