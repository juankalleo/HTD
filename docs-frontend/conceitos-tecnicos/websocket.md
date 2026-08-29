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

## No padrão frontend

Não é usado — confirmado por grep, zero `WebSocket`/`socket.io` em
qualquer lugar do projeto. Não existe hoje nenhuma tela que precise
receber atualização do servidor sem o usuário disparar uma ação: toda
tela de listagem admin busca dado sob demanda (ao montar, ao mudar
filtro, ao invalidar cache depois de uma mutation — ver
[Fetch x TanStack Query](/padrao-frontend/conceitos-tecnicos/fetch-tanstack-query)),
nunca fica "escutando" o servidor.

**Quando usaríamos:** o candidato mais concreto, dado o resto desta
documentação, é uma notificação de conflito em tempo real — ver
[Lost Update](/padrao-frontend/conceitos-tecnicos/lost-update). Hoje, se
dois admins abrem o mesmo `a_papel` pra editar, nenhum sabe que o outro
está lá; um WebSocket poderia avisar "fulano também está editando este
registro agora" assim que o segundo admin abrisse a tela — mas isso
pressupõe a API expor esse canal primeiro (nenhuma rota de WebSocket
existe no backend Rails hoje), e o problema de fundo (lost update em si)
já não ter proteção nenhuma é a lacuna mais urgente antes dessa.

## Leitura de apoio

- [MDN — WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) — a API nativa do navegador.
- [Distributed Systems — Tanenbaum & Van Steen](/padrao-frontend/leitura-recomendada/distributed-systems) — comunicação assíncrona entre processos, o princípio por trás do modelo push do WebSocket.
