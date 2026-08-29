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

## No padrão frontend

Não há reverse proxy configurado hoje — o projeto roda `next dev`/`next
start` direto, sem Nginx/load balancer documentado no deploy. Verificado:
zero leitura de `X-Forwarded-*` em qualquer lugar do código (nem
esperado, já que nada precisa disso ainda).

**A parte boa, confirmada por grep:** o front não constrói URL absoluta
própria em lugar nenhum — nenhum `window.location.origin`, nenhuma
leitura de `request.headers.get("host")` pra montar link. Toda URL do
padrão é relativa (`ROUTES`, ver [Roteamento](/padrao-frontend/roteamento))
ou aponta pra API configurada explicitamente via `NEXT_PUBLIC_API_URL` —
nenhuma delas depende de "adivinhar" o host/protocolo a partir da
requisição recebida. Isso significa que colocar um reverse proxy na
frente deste app **hoje** não quebraria nada por conta própria — não
existe o padrão de bug que normalmente aparece nesse cenário.

**O que passaria a importar se um reverse proxy entrar no deploy:**

1. O proxy precisa mandar `X-Forwarded-Proto`/`X-Forwarded-Host`
   corretos, e o Next.js (ou o servidor Node por trás dele) precisa
   confiar nesses headers — comportamento de infraestrutura, não de
   código deste projeto.
2. O CSP (ver [CSP](/padrao-frontend/seguranca/csp)) e o
   `Strict-Transport-Security` (ver
   [MitM](/padrao-frontend/seguranca/mitm)) já enviados por este projeto
   continuam corretos nesse cenário — nenhum dos dois depende do host que
   a requisição chegou, são estáticos ou derivados só de
   `NEXT_PUBLIC_API_URL`.
3. Se algum código futuro vier a construir uma URL absoluta a partir da
   requisição (um redirect pós-login pro host "real", por exemplo), esse
   é o momento de ler `X-Forwarded-Proto`/`X-Forwarded-Host` em vez do
   host que o processo Node vê diretamente — nunca antes disso ser uma
   necessidade real.

## Leitura de apoio

- [MDN — X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) — o header clássico de proxy, e por que não basta confiar nele sem validação.
- [Distributed Systems — Tanenbaum & Van Steen](/padrao-frontend/leitura-recomendada/distributed-systems) — proxies e camadas intermediárias como parte de um sistema distribuído maior.
