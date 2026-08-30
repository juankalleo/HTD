---
sidebar_label: WebSocket
---

# WebSocket

Protocolo de conexão persistente e full-duplex sobre uma única conexão
TCP — depois do handshake inicial (que começa como uma requisição HTTP
normal, com `Upgrade: websocket`), cliente e servidor podem mandar
mensagem um pro outro a qualquer momento, sem que o cliente precise
perguntar primeiro. É o oposto do modelo request/response do HTTP comum:
o servidor pode **empurrar** dado sem esperar o cliente pedir.

## Quando decide se você precisa disso

A alternativa mais simples de tudo é *polling* — buscar de novo depois de
X segundos (`refetchInterval` do TanStack Query, por exemplo, ver
[Fetch x TanStack Query](/padrao-frontend/conceitos-tecnicos/fetch-tanstack-query)).
Polling resolve a maioria dos casos de "dado que muda por fora" sem a
complexidade operacional extra de manter uma conexão persistente
(reconexão automática, keep-alive, servidor stateful por trás). A
pergunta que decide entre os dois: o atraso de alguns segundos até a
próxima busca é aceitável, ou o caso de uso exige entrega quase
instantânea (chat, notificação de presença, colaboração em tempo real)?

Quando o WebSocket é a escolha certa, o front precisa tratar: reconexão
automática com backoff quando a conexão cai (rede instável, servidor
reiniciando), um estado local de "conectado/reconectando/offline" visível
pro usuário, e — porque a conexão sobrevive além de um único componente —
geralmente um provider/context próprio em vez de abrir a conexão dentro
de cada tela que precisa dela.

## Leitura de apoio

- [MDN — WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) — a API nativa do navegador.
- [Distributed Systems — Tanenbaum & Van Steen](/padrao-frontend/leitura-recomendada/distributed-systems) — comunicação assíncrona entre processos, o princípio por trás do modelo push do WebSocket.
