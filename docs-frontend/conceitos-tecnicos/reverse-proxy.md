---
sidebar_label: Reverse Proxy
---

# Reverse Proxy (tratamento de proxy)

Um reverse proxy (Nginx, um load balancer, Cloudflare) fica na frente da
aplicação, recebendo a requisição real do navegador e repassando pra
aplicação por trás — a aplicação nunca vê o IP/host/protocolo original do
cliente diretamente, só o que o proxy decide repassar, normalmente nos
headers `X-Forwarded-For`, `X-Forwarded-Proto` e `X-Forwarded-Host`. Se a
aplicação constrói uma URL absoluta própria (um redirect, um link
completo) usando o host/protocolo que ela mesma enxerga em vez de
confiar nesses headers, o resultado pode apontar pro endereço interno
errado (por exemplo, `http://` quando o proxy já terminou HTTPS).

## Como tratar no frontend

A defesa mais simples é evitar o problema por completo: nunca construir
URL absoluta a partir do que a requisição recebida "acha" que é o host —
nem `window.location.origin` no client pra montar link que devia ser
relativo, nem `request.headers.get("host")` no server pra montar redirect
ou link de e-mail. Toda URL interna do app deve ser relativa; toda URL
externa (a API, por exemplo) deve vir de configuração explícita
(variável de ambiente), nunca inferida da requisição.

Quando um reverse proxy entra no deploy, duas coisas passam a importar:

1. O proxy precisa mandar `X-Forwarded-Proto`/`X-Forwarded-Host`
   corretos, e o servidor por trás dele precisa confiar nesses headers —
   comportamento de infraestrutura, configurado uma vez no nível de
   deploy.
2. Se algum código vier a montar uma URL absoluta a partir da requisição
   (um redirect pós-login pro host "real", por exemplo), esse é o
   momento de ler `X-Forwarded-Proto`/`X-Forwarded-Host` em vez do
   host que o processo por trás do proxy enxerga diretamente — o host
   "de verdade", do ponto de vista do navegador, é o que está nesses
   headers, não o que o servidor interno vê.

## Leitura de apoio

- [MDN — X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) — o header clássico de proxy, e por que não basta confiar nele sem validação (qualquer cliente pode mandar esse header também — só é confiável quando o proxy da borda o sobrescreve).
- [Distributed Systems — Tanenbaum & Van Steen](/padrao-frontend/leitura-recomendada/distributed-systems) — proxies e camadas intermediárias como parte de um sistema distribuído maior.
