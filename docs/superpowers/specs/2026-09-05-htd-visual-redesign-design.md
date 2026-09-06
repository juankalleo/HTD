# HTD — Redesign visual (paleta, topbar, sidebar, busca em command palette)

Data: 2026-09-05
Status: aprovado, pronto para virar plano de implementação

## Contexto

O HTD (`./HTD`) é um site Next.js que reimplementa manualmente um tema estilo
Docusaurus/Confluence (classes `navbar`, `dropdown`, `container`, `row`, `col`
vêm de um bundle CSS vendorizado em `public/assets/css/styles.cfff3e98.css`;
o tema próprio do projeto — cores, sidebar, topbar, busca — vive em
`src/app/nexttech.css` sob o prefixo `nexttech-`).

Hoje a topbar (`--nexttech-topbar-bg: #252a32`) e a sidebar
(`--nexttech-sidebar-bg: #2c313a` → `#22272f`) usam uma escala cinza-chumbo
quase preta. O pedido é parar de parecer com o layout atual, sem perder
profissionalismo: trocar essa escala por azul-marinho, reestruturar bastante
a topbar (não só recolorir) e trazer busca em estilo command palette (⌘K).

Este documento cobre só essa parte (paleta + topbar + sidebar + busca global).
A reformulação da página inicial com um roadmap real e a nova seção "Aprenda"
são um projeto à parte, com spec própria — aqui elas só aparecem como
**fora de escopo**, para deixar claro o que este spec não mexe.

## Fora de escopo

- Conteúdo e layout da home (`home-content.tsx`) além de receber a nova
  paleta por herança das variáveis CSS. Roadmap "de verdade" e a seção
  Aprenda ficam para o próximo spec.
- Busca full-text no corpo dos artigos (decidido: só título/seção).
- Qualquer serviço de busca externo (Algolia etc.) — o índice é local,
  gerado a partir do que `docs.ts` já lê do disco.

## 1. Paleta de cores

Em `src/app/nexttech.css`, dentro de `:root`, substituir a escala cinza por
uma escala azul-marinho. O acento `--nexttech-blue` (`#0c66e4`) já é azul e
**não muda** — ele é reusado em conteúdo (links, ícones de código, TOC) e
trocar quebraria consistência com o resto do site.

```css
--nexttech-topbar-bg:       #0b1a33;   /* era #252a32 */
--nexttech-sidebar-bg:      #0f2247;   /* era #2c313a */
--nexttech-sidebar-bg-deep: #081426;   /* era #22272f */
--nexttech-sidebar-bg-soft: #16305c;   /* era #383f49 — hover/paineis */
--nexttech-sidebar-border:  rgba(255,255,255,.12); /* mantém */
```

Remover a regra especial `[data-theme="light"] body:has(.home-main) .theme-layout-navbar.navbar`
(e a variante `.credits-markdown`) em `nexttech.css` — hoje ela forçava a
topbar pra `#4051b5` só na home no tema claro. Com a topbar navy permanente
em toda página (igual já acontece hoje independente de light/dark do
conteúdo), esse caso especial deixa de existir e a regra correspondente é
apagada, não mantida como dead code.

## 2. Topbar (`navbar.tsx` + `nexttech.css`)

Estrutura da esquerda pra direita passa a ser:

1. **Marca** ("How to Dev") — like hoje.
2. **Dropdown "Documentação"** — substitui os 4 links soltos de área
   (`padrao-frontend`, `padrao-api`, `padrao-banco-de-dados`,
   `padrao-infraestrutura`) por um único item de menu com essas 4 opções.
   Implementado com o mesmo padrão de dropdown hover já usado pelo seletor
   de idioma/versão (`dropdown dropdown--hoverable`), sem biblioteca nova.
3. **Link "Exemplos"** — continua solto (não é doc de "padrão", é catálogo).
4. Espaço flexível.
5. **Botão de busca** (pill) — ver seção 4.
6. Dropdown de idioma, toggle de tema, link de Créditos — mantidos como
   estão hoje, só repintados pra nova paleta.

O dropdown de versão (`v1.0`) que hoje é decorativo (só tem uma opção) sai —
não tinha função e não foi pedido; simplifica a topbar em vez de só
recolorir. Se isso for útil no futuro (múltiplas versões do padrão), volta
como item novo, não como debt escondido.

No mobile (`navbar-sidebar`, menu drawer), os 4 links de área somem do topo
do menu do mesmo jeito, e entram como um grupo expansível "Documentação"
dentro do drawer (reaproveitando `nexttech-mobile-link` para cada área
dentro do grupo).

## 3. Sidebar (`sidebar.tsx`)

Sem mudança estrutural — árvore, filtro de título, colapsar/expandir,
mobile drawer continuam exatamente como hoje. A única mudança é herdar a
nova paleta navy das variáveis do item 1 (o CSS já é 100% orientado a
variável, então não precisa editar `sidebar.tsx` em si, só `nexttech.css`).

## 4. Busca em command palette (⌘K)

**Índice**: novo `src/lib/search-index.ts`, função
`getGlobalSearchIndex(locale): SearchEntry[]` — `SearchEntry = { label, href, group }`.
Constrói o índice chamando `getSidebarTree(area, locale)` (já existe em
`docs.ts`) para as 5 áreas (`padrao-frontend`, `padrao-api`,
`padrao-banco-de-dados`, `padrao-infraestrutura`, `examples`) e achatando
cada árvore em entradas com `group` = nome da área. Roda só no servidor
(mesmas leituras de `fs` que a sidebar já faz por request).

**Componente**: novo `src/components/search-command.tsx` (`"use client"`),
usando a lib `cmdk` (nova dependência, ~5KB, sem chamada de rede) para o
combobox com fuzzy match e navegação por teclado. Recebe `entries: SearchEntry[]`
como prop.

- Botão-gatilho na topbar: pill com ícone de lupa + texto
  "Buscar..." + badge "⌘K" à direita (estilo GitHub/Linear).
  No mobile o texto some, fica só o ícone.
- Atalho global `⌘K` (Mac) / `Ctrl+K` (Windows/Linux) abre o modal de
  qualquer página — listener de teclado dentro do próprio
  `search-command.tsx`, seguindo o mesmo padrão de `useEffect` +
  `addEventListener("keydown", ...)` que `navbar.tsx` já usa pro `Escape`
  do menu mobile.
- Modal: overlay + painel centralizado no topo, resultados agrupados por
  área (label do grupo como cabeçalho de seção do `cmdk`), `↑`/`↓` navega,
  `Enter` abre a página (`router.push`), `Esc` ou clique fora fecha.
- Fuzzy match roda 100% client-side sobre os `entries` recebidos (o
  `cmdk` já resolve isso) — sem round-trip ao servidor depois do load
  inicial da página.

**Onde a prop é passada**: `Navbar` passa a aceitar `searchEntries:
SearchEntry[]`. Os 3 pontos que hoje renderizam `<Navbar activeHref=... />`
passam a computar e passar isso também:

- `src/app/page.tsx`
- `src/app/creditos/page.tsx`
- `src/components/docs-layout.tsx` (usado por todo `AreaDocsLayout`, ou
  seja, as 4 áreas de padrão + exemplos)

Todos já são Server Components com acesso a `getServerLocale()`, então o
índice é computado com `getGlobalSearchIndex(locale)` no servidor e passado
como prop serializável (array de objetos simples) — sem precisar de rota de
API nova.

## 5. i18n (`src/lib/i18n.ts`)

Novas chaves em `en` e `pt`, seguindo o padrão de dicionário existente:

```ts
search: {
  buttonLabel: string;       // "Search..." / "Buscar..."
  placeholder: string;       // dentro do modal
  noResults: (query: string) => string;
  shortcutHint: string;      // "⌘K" (mesmo texto nos dois locales)
};
nav: {
  docsMenu: string;          // "Documentation" / "Documentação"
};
```

## 6. Verificação

- `pnpm dev`, revisar visualmente: home, uma página de doc
  (`/padrao-frontend/seguranca`), o drawer mobile (viewport estreito),
  em light e dark mode.
- Testar ⌘K/Ctrl+K abrindo de qualquer página, navegação por teclado,
  clique num resultado navega e fecha o modal.
- Confirmar que o dropdown "Documentação" e o menu mobile ainda alcançam
  as 4 áreas, e que "Exemplos" e "Créditos" continuam acessíveis.
- Rodar os testes existentes (`@playwright/test` está no projeto) se
  houver algum cobrindo navbar/sidebar, e checar `pnpm build` sem erros
  de tipo (nova dependência `cmdk` entra no `package.json`).

## Arquivos tocados (resumo)

- `src/app/nexttech.css` — paleta, remoção do caso especial de home,
  estilos novos do botão/modal de busca, ajuste do dropdown "Documentação".
- `src/components/navbar.tsx` — estrutura da topbar, dropdown de
  documentação, botão de busca, drawer mobile.
- `src/components/search-command.tsx` — novo.
- `src/lib/search-index.ts` — novo.
- `src/lib/i18n.ts` — novas chaves `search` e `nav.docsMenu`.
- `src/app/page.tsx`, `src/app/creditos/page.tsx`,
  `src/components/docs-layout.tsx` — passam `searchEntries` pro `Navbar`.
- `package.json` — nova dependência `cmdk`.
