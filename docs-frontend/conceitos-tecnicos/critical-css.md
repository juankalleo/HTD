---
video: bZpNSxOlCjs
videoEn: txAE6yT0Eu8
sidebar_label: Critical CSS
---

# Critical CSS

Técnica de extrair e injetar o CSS necessário para renderizar o topo da
página (above the fold) diretamente no HTML — evita que o navegador espere
o carregamento de uma folha de estilo externa inteira antes de pintar o
que já está visível na primeira dobra da tela.

## No padrão frontend

Não é usado — essa técnica existe pra acelerar o primeiro paint de página
**pública**, onde métrica de SEO/Core Web Vitals de visitante anônimo
importa. O padrão frontend não tem página pública (ver
[Progressive Enhancement](/padrao-frontend/conceitos-tecnicos/progressive-enhancement))
— toda tela fica atrás de autenticação, então não existe visitante anônimo
medindo essa métrica.

Tailwind v4 (Lightning CSS) e Next.js já fazem code splitting de CSS por
rota por padrão, e é essa a otimização que o padrão usa — suficiente pro
perfil de app interno autenticado.

**Quando usaríamos:** se o produto ganhar uma página pública de verdade
(landing, página de status), critical CSS vira uma técnica relevante pra
essa página específica — não pro app autenticado.
