# Source

Este projeto **não é mais sincronizado** com nenhuma fonte externa. `public/feature-sliced-page.html` foi higienizado manualmente em 2026-08-26 e agora é um protótipo estrutural estático — a página inteira está marcada com avisos "[MOCK]" / "(mock)" no título, no h1, no autor e num banner no topo do artigo.

## Origem (histórico)

A página foi originalmente gerada por `scripts/sync-feature-sliced-page.mjs`, que baixava e rebrandava ao vivo o post público: https://feature-sliced.design/blog/nextjs-app-router-guide (projeto licenciado em MIT pelo Feature-Sliced Design core-team: https://github.com/feature-sliced/documentation/blob/master/LICENSE).

A barra lateral esquerda ("Conteúdo do desenvolvedor") foi modelada visualmente a partir da navegação pública do Confluence do Open Finance Brasil:
https://openfinancebrasil.atlassian.net/wiki/spaces/OF/pages/17367092/Comunicados+Eventos+T+cnicos

## O que foi higienizado

- Título, `<h1>`, autor ("Evan Carter" → "Autor Exemplo (mock)") e metatags (`og:title`, `og:description`, `og:url`, `og:image`, `twitter:image`, `canonical`, hreflangs) — não apontam mais para o domínio feature-sliced.design.
- Todos os links reais para os canais do Feature-Sliced Design (Discord, Telegram, Twitter, GitHub, Open Collective, YouTube, "Edit this page", "Discussions") foram trocados por `href=#`.
- Banner de aviso "Conteúdo mock" inserido no topo do artigo; badges "MOCK" na seção "Conteúdo do desenvolvedor" e no rótulo "Glossário" da barra lateral.
- O corpo do artigo (parágrafos, tabela comparativa, code block) **não foi reescrito frase a frase** — ficou como esqueleto de layout (títulos, imagens, listas) para não perder a estrutura visual que serviu de referência. Todo esse conteúdo deve ser tratado como placeholder e substituído pelo padrão real conforme a wiki for alimentada a partir do `base-front`.

## Não rodar mais

`scripts/sync-feature-sliced-page.mjs` continua no repo só como registro histórico de como o mockup foi montado. Ele **não está mais** no `package.json` (removido o script `sync:source`) porque rodá-lo de novo baixaria o artigo real e desfaria essa higienização.
