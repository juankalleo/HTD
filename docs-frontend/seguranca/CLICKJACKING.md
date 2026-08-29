---
sidebar_label: Clickjacking
video: xUgCMMVZ2_A
---

# Clickjacking (UI Redressing)

Ataque que engana o usuário fazendo-o clicar em um elemento invisível ou
disfarçado sobreposto a uma página legítima — um site malicioso carrega a
aplicação real dentro de um `<iframe>` invisível, por cima de um botão
falso; o clique da vítima "vaza" pro elemento real por baixo, executando
uma ação na aplicação legítima sem ela perceber.

## No padrão frontend

Bloqueado nas duas camadas possíveis, redundantes de propósito (a segunda
é fallback pra navegador sem suporte à primeira):

- `frame-ancestors 'none'` — diretiva do CSP (ver [CSP](csp.md)), o
  mecanismo moderno: nenhuma página, de nenhuma origem, tem permissão de
  colocar este app num `<iframe>`.
- `X-Frame-Options: DENY` — o cabeçalho legado equivalente, definido em
  `next.config.ts`, cobrindo navegador que ainda não suporta
  `frame-ancestors`.

```ts
// next.config.ts
{ key: "X-Frame-Options", value: "DENY" }
```

`DENY`/`'none'` (nunca embutível, nem pela própria origem) é a escolha
certa aqui porque não existe nenhum caso legítimo de embutir o
`base-front` num iframe — é um painel admin autenticado, não um widget
feito pra ser incorporado em outra página.
