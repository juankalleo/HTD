---
video: 1APq9La22cs
videoEn: 7MWXTXjtl8s
sidebar_label: Cabeçalhos de Segurança HTTP
---

# Cabeçalhos de Segurança HTTP

Diretivas enviadas pelo servidor (como `X-Frame-Options`,
`X-Content-Type-Options` e `Strict-Transport-Security`) para blindar o
comportamento do navegador — cada uma desliga uma classe específica de
comportamento arriscado do navegador (permitir embutir em iframe,
adivinhar tipo de arquivo, aceitar HTTP depois de já ter visto HTTPS)
sem exigir mudança nenhuma no código da aplicação em si.

## No padrão frontend

Cabeçalho aplicado em toda rota, via `next.config.ts` (estático — mesmo
valor sempre) e `proxy.ts` (o CSP, que precisa de nonce novo a cada
requisição, ver [CSP](csp.md)):

```ts
// next.config.ts
async headers() {
  return [{
    source: "/:path*",
    headers: [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ],
  }];
}
```

O que cada um faz, e por que esse valor:

- **`X-Frame-Options: DENY`** — ver [Clickjacking](clickjacking.md).
- **`X-Content-Type-Options: nosniff`** — impede o navegador de
  "adivinhar" o tipo de um arquivo pelo conteúdo em vez de confiar no
  `Content-Type` declarado (MIME sniffing) — vetor clássico pra fazer um
  navegador tratar um upload como HTML/script executável.
- **`Referrer-Policy: strict-origin-when-cross-origin`** — ao navegar pra
  fora do app, manda só a origem (não a URL completa, que pode ter
  querystring sensível) como referrer; dentro da própria origem, manda
  completo normalmente.
- **`Strict-Transport-Security`** — ver [MITM](mitm.md).
- **`Permissions-Policy: camera=(), microphone=(), geolocation=()`** —
  nenhuma tela do padrão usa câmera, microfone ou geolocalização; nega os
  três de propósito, então nenhum script (nem um comprometido por XSS)
  consegue pedir permissão do usuário pra essas APIs.

Verificado ao vivo (`curl -D -` contra o servidor rodando), não só lido no
código:

```text
HTTP/1.1 200 OK
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Permissions-Policy: camera=(), microphone=(), geolocation=()
content-security-policy: default-src 'self'; script-src 'self' 'nonce-...' ...
```

Escopo desta página é só o que o Next.js serve (as páginas HTML/JS do
padrão). Um cabeçalho equivalente do lado da API Rails (JSON, não HTML) é
responsabilidade do backend, não coberto aqui.
