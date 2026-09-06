---
video: H2sHmB28O_M
videoEn: xnvIAHlbqI0
sidebar_label: Progressive Enhancement
date: "29 de agosto de 2026"
---

# Progressive Enhancement

Estratégia de design web que prioriza o conteúdo e funcionalidades básicas
a todos, adicionando interações avançadas se suportadas — a ideia de que
conteúdo essencial deve funcionar mesmo sem JavaScript (ou com um
navegador limitado), com camadas de interação melhor sobrepostas por
cima quando o ambiente suporta.

## Quando decide se você precisa disso

A pergunta central é: existe visitante anônimo, sem sessão garantida,
possivelmente sem JavaScript funcionando (rede lenta, script bloqueado,
navegador limitado)? Progressive Enhancement só é uma decisão real em
páginas de conteúdo público — landing page, blog, página de status,
qualquer coisa que alguém possa abrir sem estar logado.

Num app que fica inteiro atrás de autenticação (login obrigatório antes
de qualquer tela), o pressuposto que justifica a técnica não se aplica: o
usuário só chega lá autenticado, com JavaScript já carregado — não tem
"experiência básica sem JS" pra ser a camada de baixo. Nesse caso a
estratégia certa é Server-Side Rendering pra performance (ver [SSR](/padrao-frontend/conceitos-tecnicos/ssr)), não Progressive Enhancement pra resiliência.

Quando ela se aplica de verdade, o padrão é: HTML semântico funcional por
si só primeiro (formulário que faz submit normal, link que navega), então
JavaScript camadas em cima pra melhorar (submit via fetch sem reload,
validação inline, feedback instantâneo) — nunca o inverso, onde a página
só funciona depois que um bundle JS carrega e hidrata.
