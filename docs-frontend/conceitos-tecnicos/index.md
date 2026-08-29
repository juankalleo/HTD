---
sidebar_label: Conceitos técnicos
---

# Conceitos técnicos

22 conceitos técnicos padrão de frontend, documentando o padrão real deste
projeto: o que é cada conceito, se e como o padrão frontend usa (com
código real do projeto, não exemplo genérico), o porquê da decisão, e —
quando não é usado — em que cenário passaria a ser.

## Índice

| Tópico | Abrange |
|---|---|
| [CORS](cors.md) | Same-origin policy; config real do Rack::Cors; por que `expose_headers` é obrigatório |
| [Debounce & Throttle](debounce-throttle.md) | Diferença entre os dois; debounce de 350ms na busca; quando usaríamos throttle |
| [Virtual Scrolling](virtual-scrolling.md) | Por que paginação no servidor já resolve o problema que essa técnica resolveria |
| [Hydration](hydration.md) | O único `suppressHydrationWarning` do padrão, e por quê |
| [Code Splitting](code-splitting.md) | Split automático por rota do Next.js + `next/dynamic` pra componente condicional |
| [Tree Shaking](tree-shaking.md) | Barrel de ícones com exports nomeados como padrão de reexportação |
| [SSR](ssr.md) | Server Components por padrão; `app/layout.tsx` assíncrono |
| [Atomic Design](atomic-design.md) | Por que o padrão usa taxonomia por papel em vez de átomo/molécula/organismo |
| [State Management](state-management.md) | Por que o cache do TanStack Query já cobre o caso que pediria Zustand |
| [Web Accessibility (a11y)](acessibilidade.md) | O que o SweetAlert2 já cobre; a regra do padrão pra `<dialog>` nativo |
| [Critical CSS](critical-css.md) | Por que não se aplica a um app interno sem página pública |
| [Lazy Loading](lazy-loading.md) | `next/dynamic` como estratégia de lazy loading; por que os `<img>` não usam `loading="lazy"` |
| [BFF](bff.md) | Por que o padrão chama a API direto, sem proxy; quando um BFF faria sentido |
| [Progressive Enhancement](progressive-enhancement.md) | Por que não se aplica a um app 100% autenticado |
| [Lost Update](lost-update.md) | Não tratado nem na API nem no front; o que faltaria dos dois lados pra tratar |
| [Web Concurrency](web-concurrency.md) | Como o TanStack Query evita resultado fora de ordem; o padrão `cancelado` nos hooks fora dele |
| [Reverse Proxy](reverse-proxy.md) | Não configurado hoje; por que o front já não depende de host/protocolo da requisição |
| [Idempotência](idempotencia.md) | Proteção de clique duplo na UI; por que isso não é o mesmo que idempotência de rede |
| [WebSocket](websocket.md) | Não usado hoje; onde entraria (notificação de conflito, ligado a Lost Update) |
| [WebRTC](webrtc.md) | Não se aplica — sem caso de uso de áudio/vídeo/P2P no produto |
| [XHR / fetch](xhr-fetch.md) | Só `fetch()` no padrão; por que XHR não é necessário (sem upload com progresso) |
| [Fetch x TanStack Query](fetch-tanstack-query.md) | A divisão exata: `fetch()` só em `services/`, TanStack Query só em `hooks/` |
