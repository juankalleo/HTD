---
video: ikjo5JUcTf4
videoEn: eWEgUcHPle0
sidebar_label: CSRF
---

# CSRF (Cross-Site Request Forgery)

Ataque que força o navegador de um usuário autenticado a enviar uma
requisição maliciosa para uma aplicação web vulnerável. O clássico: a
vítima está logada num banco (sessão guardada em cookie), visita um site
malicioso, que dispara um `<form>`/`fetch` escondido pro banco — o
navegador anexa o cookie de sessão automaticamente, e o banco não tem como
distinguir esse request forjado de um clique real da vítima.

## No padrão frontend

Não se aplica, por decisão de arquitetura: o padrão não usa cookie pra
autenticação. O token JWT fica em `localStorage` e é anexado manualmente
em cada chamada, via header `Authorization: Bearer` — nunca automático
pelo navegador:

```ts
// services/api-admin.ts (padrão repetido em todo services/*)
const token = getAccessToken();
fetch(url, { headers: { Authorization: `Bearer ${token}` } });
```

CSRF depende justamente do comportamento automático do navegador de anexar
cookie em qualquer requisição pro domínio dono do cookie, de qualquer
origem. Um site malicioso não tem como ler `localStorage` de outra origem
(isso é bloqueado pelo *same-origin policy* do navegador, sem relação com
CSRF) nem forçar um header `Authorization` customizado numa requisição
cross-site simples (só JavaScript da própria origem consegue setar esse
header) — então não existe forma de forjar uma chamada autenticada pra
essa API a partir de outro site.

**Trade-off:** essa escolha desloca o risco pra outro lugar — token em
`localStorage` é legível por **qualquer** script que rode na própria
página (diferente de cookie `HttpOnly`, ver
[Cookies HttpOnly & Secure](cookies-httponly-secure.md)). Por isso XSS (ver
[XSS](xss.md)) é a ameaça que mais importa pra esse padrão de auth — não
CSRF.
