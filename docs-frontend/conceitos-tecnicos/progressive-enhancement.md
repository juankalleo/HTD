---
video: H2sHmB28O_M
videoEn: xnvIAHlbqI0
sidebar_label: Progressive Enhancement
---

# Progressive Enhancement

Estratégia de design web que prioriza o conteúdo e funcionalidades básicas
a todos, adicionando interações avançadas se suportadas — a ideia de que
conteúdo essencial deve funcionar mesmo sem JavaScript (ou com um
navegador limitado), com camadas de interação melhor sobrepostas por
cima quando o ambiente suporta.

## No padrão frontend

Não é usado — o pressuposto que justifica essa estratégia ("visitante
público, talvez sem JS") não existe aqui. Toda rota do padrão frontend,
sem exceção, fica atrás de autenticação (`AuthGuard`, montado uma vez em
`AppShell`, envolvendo as áreas admin e dashboard) — a raiz (`/`)
redireciona direto pra dentro da área autenticada, sem nenhuma página de
conteúdo público em nenhum lugar. Não existe "visitante anônimo" pra
progressivamente aprimorar a experiência: o usuário já chega autenticado
ou é mandado pro login, sempre com JavaScript disponível (é um app
interno, não um site de conteúdo).

**Quando usaríamos:** se o produto ganhar uma superfície pública de
verdade (uma landing, uma página de status), Progressive Enhancement vira
uma decisão real a tomar pra **essa página específica** — não pro app
autenticado.
