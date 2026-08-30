---
sidebar_label: WebRTC
---

# WebRTC

Conjunto de APIs do navegador pra comunicação **peer-to-peer** em tempo
real — áudio, vídeo e dado trafegando direto entre dois navegadores (ou
entre navegador e um servidor de mídia), sem passar pelo servidor de
aplicação como intermediário de cada byte. É a tecnologia por trás de
chamada de vídeo direto no navegador, sem plugin.

## Quando decide se você precisa disso

A pergunta é simples: o produto envolve áudio, vídeo, compartilhamento de
tela ou canal de dado ponto a ponto entre dois usuários? Se sim, WebRTC é
a única API nativa do navegador pra isso — não tem alternativa mais
simples pra transmissão de mídia em tempo real com baixa latência. Se
não, a API não tem o que resolver: painel administrativo, dashboard,
CRUD — nenhum desses perfis de produto tem esse tipo de necessidade por
natureza.

Vale notar que WebRTC quase nunca é 100% peer-to-peer na prática — um
servidor de sinalização (normalmente via WebSocket, ver
[WebSocket](/padrao-frontend/conceitos-tecnicos/websocket)) ainda é
necessário pra dois navegadores descobrirem um ao outro e negociarem a
conexão antes do tráfego de mídia começar a fluir direto entre eles.

## Leitura de apoio

- [MDN — WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) — a referência completa da API.
