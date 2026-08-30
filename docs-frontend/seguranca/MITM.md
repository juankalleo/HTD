---
video: kHTPsCMf9CA
videoEn: stMj5jlu1-4
sidebar_label: Man-in-the-Middle
---

# Man-in-the-Middle (MitM) no Frontend

Ataques de interceptação de tráfego, prevenidos na camada do cliente
através da exigência estrita de HTTPS e pinning de certificado — um
atacante posicionado entre o usuário e o servidor (rede wi-fi pública,
DNS comprometido) lê ou altera o tráfego se ele não estiver criptografado
de ponta a ponta.

## No padrão frontend

**HSTS** (`Strict-Transport-Security`, ver
[Cabeçalhos de Segurança HTTP](cabecalhos-de-seguranca-http.md)) é a
defesa que um frontend web consegue de fato aplicar contra MitM:

```ts
{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
```

Depois da primeira visita por HTTPS, o navegador **recusa** tentar HTTP
de novo naquele domínio por 2 anos (`max-age=63072000` segundos),
incluindo subdomínios — fecha a janela clássica de MitM onde um atacante
rebaixa a conexão pra HTTP antes do usuário perceber. O header não tem
efeito nenhum sobre conexão HTTP pura (é assim que navegador trata HSTS
por especificação) — só passa a valer de verdade quando o domínio real
estiver servido atrás de HTTPS.

A diretiva `upgrade-insecure-requests` do CSP (ver [CSP](csp.md)) reforça
isso numa camada diferente: qualquer sub-recurso que a página tentasse
buscar por HTTP é automaticamente trocado por HTTPS pelo próprio
navegador, antes da requisição sair.

**O que não se aplica:** *certificate pinning* é uma técnica de app
mobile/nativo, onde o app embute o certificado esperado e recusa qualquer
outro — o navegador não dá esse nível de controle pra uma página web
comum (não existe API de pinning de certificado acessível a JavaScript de
página), então essa parte da definição não tem equivalente possível aqui.
A garantia de "o certificado é válido" fica inteiramente a cargo da cadeia
de confiança TLS padrão do navegador/sistema operacional.
