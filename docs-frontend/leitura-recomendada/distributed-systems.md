---
sidebar_label: Distributed Systems
date: "29 de agosto de 2026"
---

# Distributed Systems

![Capa de Distributed Systems](https://covers.openlibrary.org/b/id/11158985-M.jpg)

**Andrew S. Tanenbaum, Maarten van Steen** · 3ª edição, 2017 ·
ISBN 978-1543057386

O texto-base acadêmico sobre sistema distribuído — qualquer coisa que
envolva mais de uma máquina se comunicando (um front chamando uma API já
é o caso mais simples desse espectro). Cobre desde os princípios
(por que distribuir é difícil) até os padrões de solução (replicação,
tolerância a falha, coordenação) que aparecem disfarçados em praticamente
toda ferramenta de infraestrutura moderna.

## Assuntos principais

- **Arquiteturas** — cliente-servidor, peer-to-peer, arquitetura em
  camadas — o vocabulário que descreve como este próprio projeto está
  organizado (browser → API Rails, sem camada intermediária, ver
  [BFF](/padrao-frontend/conceitos-tecnicos/bff)).
- **Comunicação** — RPC, mensageria, multicast — os mecanismos por trás
  de qualquer `fetch()`.
- **Nomeação** — como um sistema encontra outro (DNS é o exemplo mais
  familiar), relevante pra qualquer discussão de proxy/roteamento.
- **Coordenação** — relógio lógico, eleição de líder, exclusão mútua
  distribuída — a base teórica de "como dois processos concordam sobre
  algo sem compartilhar memória".
- **Replicação e tolerância a falha** — o que acontece quando uma parte do
  sistema para de responder, e como o resto continua funcionando (ou não).
- **Segurança** — autenticação, controle de acesso e canal seguro em
  sistema distribuído — a mesma preocupação de
  [CORS](/padrao-frontend/conceitos-tecnicos/cors) e
  [CSP](/padrao-frontend/seguranca/csp), em escala maior.

## Onde aparece no padrão frontend

- [Reverse Proxy](/padrao-frontend/conceitos-tecnicos/reverse-proxy) — um
  proxy é uma peça clássica de arquitetura distribuída, coberta em
  profundidade no capítulo de arquiteturas.
- [CORS](/padrao-frontend/conceitos-tecnicos/cors) — same-origin policy
  é, na prática, uma política de segurança entre dois sistemas
  distribuídos (o browser e a API).

## Leitura de apoio

- [distributed-systems.net](https://www.distributed-systems.net/index.php/books/ds3/) — página oficial da 3ª edição, com material de apoio gratuito.
