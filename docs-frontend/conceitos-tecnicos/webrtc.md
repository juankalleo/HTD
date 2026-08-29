---
sidebar_label: WebRTC
---

# WebRTC

Conjunto de APIs do navegador pra comunicação **peer-to-peer** em tempo
real — áudio, vídeo e dado trafegando direto entre dois navegadores (ou
entre navegador e um servidor de mídia), sem passar pelo servidor de
aplicação como intermediário de cada byte. É a tecnologia por trás de
chamada de vídeo direto no navegador, sem plugin.

## No padrão frontend

Não é usado — confirmado por grep, zero `RTCPeerConnection`/
`getUserMedia`/WebRTC em qualquer lugar do projeto. Diferente de
[WebSocket](/padrao-frontend/conceitos-tecnicos/websocket) (onde pelo
menos existe um cenário plausível pra justificar), aqui nem isso: o
`base-front` é um painel administrativo — nenhuma tela do padrão envolve
áudio, vídeo, compartilhamento de tela ou canal de dado ponto a ponto
entre usuários. Não é um caso de "ainda não precisou", é um caso de "não
é o tipo de produto que usaria isso".

## Leitura de apoio

- [MDN — WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) — a referência completa da API, caso um produto derivado deste padrão precise de chamada de vídeo no futuro.
