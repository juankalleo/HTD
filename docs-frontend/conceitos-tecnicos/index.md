---
sidebar_label: Conceitos técnicos
---

# Conceitos técnicos

22 conceitos técnicos de frontend: o que cada um é, quando decide se você
precisa dele, e como tratar na prática. Onde o padrão frontend realmente
usa um conceito, o exemplo vem de código real do projeto, não de um
exemplo genérico.

## Índice

| Tópico | Abrange |
|---|---|
| [CORS](cors.md) | Same-origin policy; config real do Rack::Cors; por que `expose_headers` é obrigatório |
| [Debounce & Throttle](debounce-throttle.md) | Diferença entre os dois; debounce de 350ms na busca; como implementar throttle |
| [Virtual Scrolling](virtual-scrolling.md) | Quando decide se você precisa: paginação no servidor já resolve boa parte dos casos |
| [Hydration](hydration.md) | O único `suppressHydrationWarning` do padrão, e por quê |
| [Code Splitting](code-splitting.md) | Split automático por rota do Next.js + `next/dynamic` pra componente condicional |
| [Tree Shaking](tree-shaking.md) | Barrel de ícones com exports nomeados como padrão de reexportação |
| [SSR](ssr.md) | Server Components por padrão; `app/layout.tsx` assíncrono |
| [Atomic Design](atomic-design.md) | Por que o padrão usa taxonomia por papel em vez de átomo/molécula/organismo |
| [State Management](state-management.md) | Por que o cache do TanStack Query já cobre o caso que pediria Zustand |
| [Web Accessibility (a11y)](acessibilidade.md) | O que o SweetAlert2 já cobre; a regra do padrão pra `<dialog>` nativo |
| [Critical CSS](critical-css.md) | Quando importa: página pública com Core Web Vitals; code splitting por rota como primeira linha |
| [Lazy Loading](lazy-loading.md) | `next/dynamic` como estratégia de lazy loading; por que os `<img>` não usam `loading="lazy"` |
| [BFF](bff.md) | Por que o padrão chama a API direto, sem proxy; quando um BFF faria sentido |
| [Progressive Enhancement](progressive-enhancement.md) | Quando decide se você precisa: existe visitante anônimo sem JS garantido? |
| [Lost Update](lost-update.md) | Optimistic locking: versão no fetch, versão no save, 409 de conflito tratado na UI |
| [Web Concurrency](web-concurrency.md) | Como o TanStack Query evita resultado fora de ordem; o padrão `cancelado` nos hooks fora dele |
| [Reverse Proxy](reverse-proxy.md) | Como tratar `X-Forwarded-*`; por que nunca montar URL absoluta a partir do host da requisição |
| [Idempotência](idempotencia.md) | Proteção de clique duplo na UI; por que isso não é o mesmo que idempotência de rede |
| [WebSocket](websocket.md) | Polling vs. WebSocket; reconexão, estado de conexão, provider próprio |
| [WebRTC](webrtc.md) | Quando decide se você precisa: produto envolve áudio/vídeo/P2P |
| [XHR / fetch](xhr-fetch.md) | Só `fetch()` no padrão; por que XHR não é necessário (sem upload com progresso) |
| [Fetch x TanStack Query](fetch-tanstack-query.md) | A divisão exata: `fetch()` só em `services/`, TanStack Query só em `hooks/` |
