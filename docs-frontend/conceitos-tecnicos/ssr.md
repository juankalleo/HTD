---
video: njTL7-eZ1AI
videoEn: ObrSuDYMl1s
sidebar_label: SSR
date: "29 de agosto de 2026"
---

# Server-Side Rendering (SSR)

Geração do HTML completo da página no servidor antes de enviá-lo ao
navegador, melhorando SEO e performance inicial. Em vez do navegador
receber uma página quase vazia e montar tudo via JavaScript (client-side
rendering puro), o servidor já manda o HTML pronto — o usuário vê conteúdo
mais rápido, e motores de busca conseguem indexar sem executar JS.

## No padrão frontend

É o padrão default do Next.js App Router, e o padrão deste projeto não foge
disso: todo componente é Server Component a menos que declare `"use
client"` explicitamente no topo do arquivo. A maior parte das telas do
[HTD-Front](https://github.com/juankalleo/HTD-Front) são Server Components — só as folhas que precisam de
interatividade real (formulário, estado local, hook de dado no client)
ganham `"use client"`.

`app/layout.tsx` é o exemplo mais importante do padrão: Server Component
**assíncrono**, busca a configuração institucional (tema, nome, ícone)
direto no servidor antes de montar o HTML — assim o branding já chega
pronto no primeiro paint, sem piscar. Ver
[Configuração institucional](/padrao-frontend/layout/configuracao-institucional)
pro trade-off que isso traz (esse fetch sem cache a cada request tira o
app inteiro de prerender estático — aceitável porque o app é 100%
autenticado, nunca serviria uma página cacheada/pública de qualquer jeito).

A regra prática do padrão: um arquivo só ganha `"use client"` quando
precisa de fato de algo que só existe no navegador — estado (`useState`),
efeito (`useEffect`), evento (`onClick`), ou um hook que dependa de um
desses (como `useForm`/`useQuery`). Tudo que só busca dado e desenha HTML
fica Server Component — é o comportamento padrão do framework, o padrão só
evita quebrar isso à toa.
