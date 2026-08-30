---
sidebar_label: Proteção da wiki
---

# Proteção da própria wiki

Toda página desta seção documenta, em detalhe (código, configuração,
nome de arquivo), o que protege — e o que ainda não protege — o
[HTD-Front](https://github.com/juankalleo/HTD-Front) e a API por trás dele. Isso é bom pra quem devia ler
(o time), e ajuda quem não devia: os thresholds exatos do rack-attack, a
confirmação de que autorização negada não gera log, o comportamento
403-vs-404 no acesso cross-tenant — nada disso é perigoso escondido numa
wiki interna. A postura certa não é documentar menos — é ser claro sobre
o que está exposto e por quê.

## Este site é público, de propósito

O `How to Dev` chegou a rodar atrás de HTTP Basic Auth (todo o site,
`proxy.ts` na raiz, credencial por variável de ambiente) — feito quando
a ideia era "wiki fechada, só o time acessa". Essa proteção foi
**removida deliberadamente**: o objetivo mudou pra portfólio pessoal,
pensado pra aparecer em busca (ver SEO em [`README.md`](../../README.md))
— um site que ninguém encontra no Google não cumpre esse objetivo.
`robots.txt` e os headers HTTP hoje permitem indexação (`Allow: /`, sem
`X-Robots-Tag: noindex`), ao contrário de antes.

Isso é uma troca consciente, não um descuido: nada neste site depende de
sigilo pra ser seguro. O conteúdo é documentação técnica escrita pra ser
lida — inclusive por quem está avaliando o autor pra uma vaga, o que só
funciona se o site for achável.

## Por que um `AuthGuard` client-side não serviria aqui (se algum dia precisasse)

Fica registrado o motivo técnico, útil caso alguma seção volte a
precisar de controle de acesso no futuro: o [HTD-Front](https://github.com/juankalleo/HTD-Front) protege rota
admin com `AuthGuard` (`features/autenticacao/login/components/auth-guard.tsx`)
— mas `AuthGuard` é **client-side** de propósito (`"use client"`, roda
num `useEffect`, decide renderizar `children` ou redirecionar só depois
de checar `localStorage` no navegador). Isso funciona lá porque o dado
protegido de verdade (a resposta da API admin) só chega via
`useQuery`/`fetch` disparado do client — a página em si não carrega dado
sensível no HTML inicial. Ver
[Fetch x TanStack Query](/padrao-frontend/conceitos-tecnicos/fetch-tanstack-query).

O `How to Dev` é o oposto: o conteúdo (o markdown inteiro da página)
**já está no HTML** que o servidor manda na primeira resposta — não tem
`fetch` condicional nenhum acontecendo depois. Um `AuthGuard`
client-side aqui não protegeria nada: o navegador (ou um crawler, ou
`curl`) já recebeu o conteúdo completo antes de qualquer JavaScript
rodar pra "esconder" ele. Proteção real, pra esse tipo de conteúdo,
precisaria ser server-side, antes da página renderizar — era exatamente
o papel que o `proxy.ts` (removido) cumpria aqui.

## Headers de segurança que continuam ativos

Remover a Basic Auth não significa abrir mão de higiene básica.
`next.config.ts` ainda aplica, em toda rota: `X-Frame-Options: DENY`
(anti-clickjacking), `X-Content-Type-Options: nosniff` (anti MIME
sniffing) e `Referrer-Policy: strict-origin-when-cross-origin` — os
mesmos headers estáticos de baixo custo que o
[HTD-Front](https://github.com/juankalleo/HTD-Front) já aplica (ver
[Cabeçalhos de segurança HTTP](CABECALHOS-DE-SEGURANCA-HTTP.md)).
