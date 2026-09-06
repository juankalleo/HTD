---
video: SbXldeAb2D4
videoEn: -LjPRzFR5f0
sidebar_label: CSP
date: "29 de agosto de 2026"
---

# CSP (Content Security Policy)

Camada de segurança (via cabeçalho HTTP) que define quais origens de
recursos (scripts, estilos, imagens) o navegador tem permissão para
carregar. Mesmo que um script malicioso consiga entrar na página de
alguma forma, o navegador se recusa a executá-lo se ele não bater com a
política declarada — é uma segunda barreira, depois (não em vez) de
qualquer escape/sanitização feito no código.

## No padrão frontend

Implementado via `proxy.ts`, que roda em toda requisição e gera um
**nonce novo a cada vez** — um valor aleatório que só aquela requisição
conhece, usado pra marcar como "confiável" o único script inline real do
projeto:

```ts
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const apiOrigin = /* origem da API, de NEXT_PUBLIC_API_URL */;

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: ${apiOrigin}`,
    "font-src 'self'",
    `connect-src 'self' ${apiOrigin}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}
```

O nonce também é repassado como header de requisição (`x-nonce`), pra
`app/layout.tsx` (Server Component) ler via `headers()` do
`next/headers` e aplicar no único script inline do padrão:

```tsx
const nonce = (await headers()).get("x-nonce") ?? undefined;
// ...
<script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
```

O Next.js propaga esse mesmo nonce automaticamente pros próprios `<script>`
e `<link rel="stylesheet">` que ele injeta pra hidratar a página — não é
preciso fazer nada manual pra isso, é comportamento nativo do framework
quando detecta esse padrão de CSP.

Cada diretiva existe por um motivo real do projeto, não é lista genérica:

- **`script-src ... 'strict-dynamic'`** — cobre os chunks carregados sob
  demanda via `next/dynamic` (ver
  [Code Splitting](/padrao-frontend/conceitos-tecnicos/code-splitting)) sem
  precisar listar cada um manualmente. Em desenvolvimento, ganha também
  `'unsafe-eval'` — o Fast Refresh do Next usa `eval`, e isso não entra no
  build de produção.
- **`style-src 'self' 'unsafe-inline'`** — exceção consciente, não
  descuido: a aparência institucional configurável (ver
  [Configuração institucional](/padrao-frontend/layout/configuracao-institucional))
  depende de muito `style` inline via prop do React (cor de sidebar,
  tamanho de fonte, etc.), incompatível com uma política restrita de
  `style-src`. O risco de um ataque baseado só em CSS injetado é bem menor
  que um baseado em script — por isso essa é a única diretiva relaxada.
- **`img-src`/`connect-src` incluem a origem da API** — a página busca dado
  e imagem institucional (ícone, fundo do login) direto da API Rails
  configurada (`NEXT_PUBLIC_API_URL`), sem proxy no meio (ver
  [BFF](/padrao-frontend/conceitos-tecnicos/bff)) — sem essas duas linhas,
  o próprio fluxo normal do app seria bloqueado pela política.
- **`frame-ancestors 'none'`** — ver [Clickjacking](clickjacking.md).
- **`object-src 'none'`** — bloqueia plugin tipo Flash; zero uso legítimo
  no projeto.

Verificado ao vivo (não só lido no código) — cabeçalho real recebido do
servidor:

```text
content-security-policy: default-src 'self'; script-src 'self' 'nonce-...' 'strict-dynamic' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: http://localhost:3001; font-src 'self'; connect-src 'self' http://localhost:3001; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests
```

## Leitura de apoio

- [MDN — Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [Next.js — Content Security Policy (guia oficial)](https://nextjs.org/docs/app/guides/content-security-policy) — a receita de nonce por middleware seguida aqui.
