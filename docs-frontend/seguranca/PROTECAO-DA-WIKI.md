---
sidebar_label: Proteção da wiki
---

# Proteção da própria wiki

Toda página desta seção documenta, em detalhe real (código, threshold
exato, nome de arquivo), o que protege — e o que ainda não protege — o
`base-front` e a API por trás dele. Isso é bom pra quem devia ler
(o time), e ajuda quem não devia: os thresholds exatos do rack-attack, a
confirmação de que autorização negada não gera log, o comportamento
403-vs-404 no acesso cross-tenant — nada disso é perigoso escondido numa
wiki interna, mas vira reconhecimento pronto se a wiki em si estiver
acessível sem controle nenhum. A postura certa não é documentar menos —
é garantir que só quem devia ler, leia.

## No padrão frontend: HTTP Basic Auth em toda a wiki

`How to Dev` (este site) é um app Next.js próprio, separado do
`base-front`, sem base de usuário própria — conteúdo estático, sem
conceito de "conta". `proxy.ts` (raiz do projeto) roda antes de
qualquer rota, exige `Authorization: Basic` válido contra
`WIKI_BASIC_AUTH_USER`/`WIKI_BASIC_AUTH_PASS` (variável de ambiente, nunca
hardcoded — em produção na Vercel, configurada em Project Settings →
Environment Variables, nunca commitada), com comparação resistente a
timing attack e sem cache disponível:

```ts
export function proxy(request: NextRequest): NextResponse {
  const usuarioEsperado = process.env.WIKI_BASIC_AUTH_USER;
  const senhaEsperada = process.env.WIKI_BASIC_AUTH_PASS;

  if (!usuarioEsperado || !senhaEsperada) {
    return process.env.NODE_ENV === "production" ? naoAutorizado() : NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const [usuario, senha] = Buffer.from(header.slice(6), "base64").toString("utf-8").split(":");
    if (comparacaoSeguraContraTempo(usuario, usuarioEsperado) && comparacaoSeguraContraTempo(senha, senhaEsperada)) {
      return NextResponse.next();
    }
  }

  return naoAutorizado();
}
```

**Falha fechada em produção**: sem as duas variáveis de ambiente
configuradas, `NODE_ENV=production` bloqueia tudo (401) — nunca fica
aberto por omissão de configuração. Em desenvolvimento local (sem as
env vars), libera, pra não travar quem só quer rodar `next dev` sem
configurar credencial ainda.

Verificado ao vivo, não só lido no código — três cenários reais contra um
build de produção (`next start`, `NODE_ENV=production`):

```text
sem credencial:        401 (com WWW-Authenticate: Basic realm="How to Dev")
credencial errada:     401
credencial certa:      200
```

Como a proteção fecha por padrão quando as env vars não existem, o
deploy na Vercel **precisa** das duas variáveis configuradas antes do
primeiro acesso — sem elas, o próprio dono fica fora (401), o que é o
comportamento correto: nunca abrir por esquecimento de configuração.

## Por que o padrão do `base-front` não se aplica direto aqui

O `base-front` protege rota admin com `AuthGuard`
(`features/autenticacao/login/components/auth-guard.tsx`) — mas
`AuthGuard` é **client-side** de propósito (`"use client"`, roda num
`useEffect`, decide renderizar `children` ou redirecionar só depois de
checar `localStorage` no navegador). Isso funciona lá porque o dado
protegido de verdade (a resposta da API admin) só chega via
`useQuery`/`fetch` disparado do client — a página em si não carrega dado
sensível no HTML inicial; ela carrega depois, sob condição de token, e a
API real (Rails) rejeita token ausente/inválido de qualquer forma. Ver
[Fetch x TanStack Query](/padrao-frontend/conceitos-tecnicos/fetch-tanstack-query).

O `How to Dev` é o oposto: o conteúdo (o markdown inteiro da página) **já
está no HTML** que o servidor manda na primeira resposta — não tem
`fetch` condicional nenhum acontecendo depois. Um `AuthGuard`
client-side aqui não protegeria nada: o navegador (ou um crawler, ou
`curl`) já recebeu o conteúdo completo antes de qualquer JavaScript
rodar pra "esconder" ele. Proteção real, pra esse tipo de conteúdo,
**precisa ser server-side**, antes da página renderizar — exatamente o
que o `proxy.ts` do `base-front` já demonstra: roda no servidor,
intercepta toda requisição antes da rota, só que lá com outro conteúdo
(CSP, ver [CSP](CSP.md)), não checagem de autenticação. Aqui, mesmo
mecanismo (`proxy.ts`), conteúdo diferente (Basic Auth).

## Outras camadas (defesa em profundidade, não a proteção principal)

A Basic Auth acima é a barreira real. As duas abaixo não substituem
ela — só reduzem ruído e evitam vazamento acidental por fora dela:

- **`public/robots.txt`** — `Disallow: /` pra todo agente. Não impede
  acesso (a Basic Auth já faz isso); só evita que um buscador tente
  indexar a URL e o 401 apareça em resultado de busca.
- **`X-Robots-Tag: noindex`** (header HTTP, `next.config.ts`) —
  reforço do `robots.txt` no nível de header, pro caso de algum crawler
  ignorar o arquivo. Junto com `X-Frame-Options: DENY` e
  `X-Content-Type-Options: nosniff`, os mesmos headers estáticos de
  baixo custo que o `base-front` já aplica (ver
  [Cabeçalhos de segurança HTTP](CABECALHOS-DE-SEGURANCA-HTTP.md)).
