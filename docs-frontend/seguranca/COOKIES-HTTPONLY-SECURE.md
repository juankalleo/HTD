---
video: rCVivc9-rWs
videoEn: GhrvZ5nUWNg
sidebar_label: Cookies HttpOnly & Secure
date: "29 de agosto de 2026"
---

# Cookies HttpOnly & Secure

Atributos de segurança para cookies; `HttpOnly` impede o acesso via
JavaScript (bloqueando XSS de roubar o cookie), `Secure` força o envio
apenas por HTTPS. Um cookie de sessão sem esses atributos pode ser lido
por qualquer script na página e vazado em texto claro numa conexão HTTP.

## No padrão frontend

Não se aplica hoje — o padrão não usa cookie nenhum. Confirmado no código:
zero `document.cookie`, zero lib de cookie (`js-cookie` etc.), zero
`cookies()` do Next em qualquer rota. Autenticação usa token JWT em
`localStorage` (ver [CSRF](csrf.md) pro porquê dessa escolha e o
trade-off que ela desloca — token em `localStorage` é legível por
JavaScript da própria página, então protegido por XSS estar sob controle,
não por um atributo de cookie).

**Quando usaríamos:** se o padrão migrar pra sessão via cookie no futuro
(por exemplo, adotando o proxy Next.js que hoje é decisão explícita contra
— ver [BFF](/padrao-frontend/conceitos-tecnicos/bff)), `HttpOnly` +
`Secure` + `SameSite=Strict` (ou `Lax`) passam a ser obrigatórios no
cookie de sessão, não opcionais — é o que teria evitado o vazamento via
XSS que o `localStorage` de hoje está exposto a.
