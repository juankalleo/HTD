---
sidebar_label: High Performance Browser Networking
---

# High Performance Browser Networking

![Capa de High Performance Browser Networking](https://covers.openlibrary.org/b/isbn/9781449344764-M.jpg)

**Ilya Grigorik** · O'Reilly Media, 2013 · ISBN 978-1449344764

O único livro desta lista escrito especificamente pra quem trabalha com
frontend/web — "o que todo desenvolvedor web deveria saber sobre rede e
performance de browser". Cobre desde o nível mais baixo (TCP, TLS) até o
que acontece de fato quando o navegador carrega uma página.

## Assuntos principais

- **TCP e TLS** — como a conexão é estabelecida antes de qualquer byte de
  HTTP trafegar, e o custo real de handshake/round-trip.
- **HTTP/1.1 vs HTTP/2** — multiplexação, head-of-line blocking, e por
  que HTTP/2 mudou tanta prática antiga (concatenar assets pra economizar
  conexão, por exemplo).
- **Performance de rede móvel** — latência de rádio, como rede móvel se
  comporta diferente de rede cabeada, e o impacto disso em UX.
- **WebSocket, WebRTC, XHR/fetch** — os mecanismos de transporte
  disponíveis no navegador, e quando cada um faz sentido.
- **Otimização de aplicação web** — como aplicar tudo isso: cache,
  compressão, priorização de recurso crítico.

## Onde aparece no padrão frontend

- [CORS](/padrao-frontend/conceitos-tecnicos/cors) — a mecânica exata de
  preflight/simple request que o capítulo de HTTP cobre em detalhe.
- [Critical CSS](/padrao-frontend/conceitos-tecnicos/critical-css) —
  priorização de recurso crítico é tema direto do livro, mesmo esse
  projeto concluindo que não se aplica ao próprio perfil.
- [CSP](/padrao-frontend/seguranca/csp) e
  [MitM](/padrao-frontend/seguranca/mitm) — TLS/HTTPS como base de tudo
  que os cabeçalhos de segurança do padrão pressupõem.

## Leitura de apoio

- [hpbn.co](https://hpbn.co/) — o livro inteiro, disponível gratuitamente online, mantido atualizado pelo autor.
