---
sidebar_label: HTTP, HTTPS e TLS
date: "30 de agosto de 2026"
---

# HTTP, HTTPS e TLS

## HTTP — o protocolo da web

O protocolo que um cliente usa pra pedir uma página/dado a um servidor e receber a resposta.
Funciona em ciclos de requisição-resposta: o cliente manda um **método** (`GET` pra buscar,
`POST` pra criar, `PUT`/`PATCH` pra atualizar, `DELETE` pra remover) mais um **caminho** e
cabeçalhos; o servidor responde com um **código de status** (`200` OK, `302` redirecionamento,
`404` não encontrado, `429` muitas requisições, `500` erro no servidor) mais o corpo da resposta.

## HTTPS — HTTP dentro de uma camada de criptografia

Sem HTTPS, qualquer um no caminho da rede (o provedor, um Wi-Fi público malicioso, um roteador
comprometido) consegue ler tudo que trafega — inclusive senha digitada em texto puro. HTTPS sem
exceção é o padrão mínimo aceitável hoje pra qualquer aplicação séria.

## TLS — como a criptografia funciona

**TLS** (sucessor do antigo SSL — o nome "SSL" ainda aparece informalmente, mas na prática hoje é
sempre TLS). Antes de qualquer dado HTTP trafegar, cliente e servidor fazem um **handshake TLS**:
o servidor apresenta um **certificado** (assinado por uma Autoridade Certificadora confiável,
como a Let's Encrypt) provando que é quem diz ser, as duas pontas negociam uma chave de
criptografia só pra essa sessão, e a partir daí todo tráfego vai cifrado.

## SNI — um detalhe que importa pra qualquer infra com múltiplos domínios

**SNI (Server Name Indication)**: um servidor pode hospedar vários domínios diferentes, com
certificados diferentes, no mesmo IP e porta 443 — pra isso funcionar, o cliente precisa dizer,
**antes mesmo da criptografia começar**, qual domínio ele quer falar. Isso é o SNI. O servidor usa
essa informação pra escolher qual certificado e configuração aplicar.

É exatamente o mecanismo que um proxy reverso (ver
[Proxy reverso e CDN](/padrao-infraestrutura/conceitos-tecnicos/proxy-reverso-e-cdn)) usa pra
rotear múltiplos domínios na mesma porta — e também um ponto de atenção real de segurança: se o IP
real de origem por trás de um CDN/WAF vaza (por exemplo, num header de e-mail, num registro DNS
antigo, ou por engano numa configuração), quem descobrir esse IP consegue mandar o SNI certo
**direto** pro servidor de origem, contornando qualquer filtro que o CDN/WAF aplicaria — o
domínio sozinho, sem esconder o IP real por trás dele, não é suficiente como camada de proteção.

## Leitura de apoio

- [MDN — Transport Layer Security (TLS)](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security) — o protocolo em detalhe.
- [Cloudflare — What is SNI?](https://www.cloudflare.com/learning/ssl/what-is-sni/) — explicação focada no mecanismo de SNI e por que ele existe.
