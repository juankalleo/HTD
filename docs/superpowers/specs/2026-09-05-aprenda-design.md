# HTD — Seção "Aprenda" (plataforma de estudo estilo W3Schools) + home redesenhada

Data: 2026-09-05
Status: rascunho para revisão do usuário

## Contexto e objetivo

O HTD hoje documenta *padrões* (decisões arquiteturais já tomadas, com o
porquê) nas 4 áreas `padrao-*` + `examples`, sempre em Markdown lido do
disco por `docs.ts`. Isso continua existindo exatamente como está — é a
base de referência.

"Aprenda" é um produto diferente: ensinar do zero, no estilo W3Schools —
aula, exemplo de código, "tente você mesmo", quiz no final — para quem
ainda não sabe a tecnologia, não para quem já decidiu como estruturar o
projeto. Vira **a parte principal do site** (é o que a home passa a vender
primeiro), com as documentações existentes seguindo como referência de
apoio, linkadas a partir de cada aula.

Este é o segundo dos dois specs desta rodada — o primeiro
(`2026-09-05-htd-visual-redesign-design.md`) cobre paleta, topbar, sidebar e
busca em command palette; este aqui assume que já existe (dropdown
"Documentação", botão de busca, paleta navy).

## Fora de escopo (v1)

- **Sandbox remota paga rodando Ruby on Rails/Docker de verdade.** Decidido:
  fica para uma fase/spec 2, depois que o resto do Aprenda estiver no ar —
  exigiria backend novo (proxy pra um provedor tipo e2b.dev/Daytona a
  partir de uma function da Vercel), rate-limit/proteção contra abuso
  (o site não tem login) e custo recorrente por execução.
- **Tradução para inglês.** V1 é 100% PT-BR. Segue o mesmo padrão de
  fallback que o resto do site já usa (se não existir versão `-en`,
  mostra a versão em português) — então isso não precisa de nenhuma
  lógica nova, só significa que, por enquanto, não existe conteúdo `-en`
  de Aprenda pra cair.
- **Conta de usuário / login.** Progresso é só local (localStorage),
  por navegador.

## 1. Estrutura de conteúdo e rotas

Diferente de `padrao-*`, aulas do Aprenda são **componentes TSX**, não
Markdown (decisão do usuário: quer o visual controlado por completo,
diferente da documentação). Pra isso não virar "escrever HTML na mão" a
cada aula, existe um conjunto de blocos reutilizáveis (seção 2) — uma aula
normal é só uma composição desses blocos com o texto e o código daquela
aula específica.

```
src/content/aprenda/
  tracks.ts                    // registro dos 3 tracks (meta: título, ícone, resumo, slug)
  frontend/
    index.ts                   // lista ordenada das lições do track, com meta de cada uma
    01-por-que-tailwind.tsx
    02-classes-fundamentais.tsx
    ...
  rails/
    index.ts
    01-ruby-essencial.tsx
    ...
  docker/
    index.ts
    01-por-que-containers.tsx
    ...
```

Cada arquivo de lição exporta:
```tsx
export const meta = {
  slug: "01-por-que-tailwind",
  title: "Por que Tailwind",
  summary: "Utility-first na prática, comparado com CSS tradicional.",
  estimatedMinutes: 12,
};
export default function Licao() {
  return (
    <LessonBody>
      <p>...</p>
      <CodeExample ... />
      <Quiz questions={[...]} />
    </LessonBody>
  );
}
```

Rotas (Next.js App Router):

- `src/app/aprenda/page.tsx` — hub: os 3 tracks como cards grandes +
  "continuar de onde parei" (lê o progresso do localStorage).
- `src/app/aprenda/[track]/page.tsx` — visão geral do track: lista de
  capítulos com status (não iniciado / em andamento / concluído).
- `src/app/aprenda/[track]/[lesson]/page.tsx` — a aula em si, com
  `generateStaticParams` gerado a partir do registro em `index.ts` de cada
  track (as lições são conhecidas em build time, não vêm de leitura de
  disco em runtime como os docs).

## 2. Blocos reutilizáveis de lição (`src/components/aprenda/`)

- `LessonLayout` — chrome comum: sidebar com a lista de capítulos do track
  atual (destaca o ativo, mostra check nos concluídos), barra de progresso
  do track, botões "Anterior" / "Próxima aula".
- `CodeExample` — bloco de código com abas **Código** / **Resultado**
  (a aba "Resultado" mostra saída esperada como texto/terminal simulado —
  pra Rails/Docker é a única forma, já que não roda de verdade).
- `LiveEditor` — **só no track Frontend**, ver seção 3.
- `Quiz` — pergunta de múltipla escolha, várias por aula, corrige na hora
  no client (sem backend), mostra "X de Y corretas" ao final, salva no
  localStorage.
- `Exercise` — enunciado de exercício + botão "Ver solução" que revela um
  `CodeExample` (sem correção automática, só o enunciado + solução).
- `Callout` — aviso/dica/link "aprofunde-se em `<link para a doc padrao-*
  relevante>`" — é o mecanismo de cross-link pro conteúdo de referência
  existente.

## 3. Editor ao vivo do track Frontend

Ajuste em relação à conversa inicial: em vez de WebContainers, a
recomendação técnica é **Sandpack** (mesma tecnologia usada pela
CodeSandbox, já adotada por sites de documentação como Chakra UI/MUI).
Motivo: WebContainers sobe um Node.js completo e é pensado pra rodar um
projeto inteiro (com dev server) — pesado pra abrir a cada aula. Sandpack é
mais leve, feito exatamente pra isso (preview ao vivo de um componente
React/Tailwind isolado), 100% no navegador do visitante, sem custo de
servidor — o mesmo objetivo (execução real, zero infra paga) com a
ferramenta certa pro tamanho do problema (trecho de aula, não projeto
inteiro). Se isso não for aceitável me avisa que eu ajusto de volta pra
WebContainers.

Limite importante a documentar na própria aula quando relevante: Sandpack
roda componente/classe isolado muito bem (Tailwind, hooks, um componente
React), mas **não** simula App Router de verdade (rotas, layouts
aninhados, Server Components, data fetching no servidor) — pra esses
tópicos a aula usa `CodeExample` estático como as outras trilhas, com uma
nota explicando o motivo.

## 4. Progresso (`src/lib/aprenda-progress.ts`)

Schema salvo em `localStorage["htd-aprenda-progress"]`:
```ts
type Progress = {
  [track: string]: {
    [lessonSlug: string]: {
      completed: boolean;
      quizScore?: { correct: number; total: number };
    };
  };
};
```
Helpers: `markLessonComplete`, `saveQuizScore`, `getTrackPercent(track)`,
`getLastVisitedLesson()` (pro "continuar de onde parei" na home/hub).
Tudo client-side, sem chamada de rede.

## 5. Home redesenhada (`home-content.tsx`)

Sai o modelo atual (texto/lista vindo do dicionário i18n, parecendo mais
um artigo). Vira componente TSX estruturado assim:

1. **Hero** — título + CTA principal grande "Começar a aprender" →
   `/aprenda`, CTA secundário menor "Ver documentação" → dropdown/link pra
   `padrao-frontend`.
2. **Árvore de estudo** — o elemento central da home: os 3 tracks como
   nós lado a lado (Frontend, Rails, Docker), cada um com sua lista de
   capítulos em miniatura por baixo, ligados por uma linha (mesma ideia
   visual que `home-roadmap-list::before` já usa hoje, só que aplicada aos
   3 tracks reais em vez de uma lista de itens de doc). Cada capítulo é um
   botão clicável que já leva direto pra aquela lição — não só o card do
   track. Se houver progresso salvo, mostra o check/percentual ali mesmo.
   Esboço em texto:
   ```
   [ Frontend ●●●○○ 60% ]   [ Rails ●○○○○ 10% ]   [ Docker ○○○○○ ]
     └ Tailwind ✓               └ Ruby essencial       └ Por que containers
     └ Classes fund. ✓          └ O que é Rails        └ Dockerfile
     └ Next.js (atual→)         └ Scaffold             └ ...
     └ ...                      └ ...
   ```
3. **Documentação de referência** (mantido, redimensionado pra segundo
   plano) — os cards que já existem hoje para `padrao-frontend`,
   `padrao-api`, `padrao-banco-de-dados`, `padrao-infraestrutura`,
   `examples`, agora como uma seção "Base de referência" mais compacta
   abaixo da árvore de estudo, não mais o conteúdo principal da página.
4. Seções que já existem e continuam (Sobre mim, links do projeto) —
   mantidas, só reposicionadas pra depois da árvore de estudo.

## 6. Topbar (integra no que o spec de redesign visual já define)

Adiciona um item **"Aprenda"** na topbar, com destaque (botão preenchido
usando `--nexttech-blue`, diferente dos links de texto simples de
"Documentação"/"Exemplos") — reflete que é o CTA principal do site, não
só mais um item de navegação.

## 7. Cross-link com a documentação existente

Cada aula que tiver uma página `padrao-*` equivalente termina com um
`Callout` "Quer o padrão completo de produção? Veja `<título da doc>`" +
link direto. Ex.: a aula de Service Objects linka pra
`padrao-api/conceitos-tecnicos/service-result`; a aula de Devise linka pra
`padrao-frontend/seguranca/autenticacao` e `padrao-api/seguranca/autenticacao`.
Isso é decidido aula a aula na hora de escrever (não dá pra automatizar com
segurança sem mapear manualmente), mas o componente `Callout` já padroniza
o visual desse link em todo lugar.

## 8. Esqueleto de currículo inicial (v1)

**Trilha Frontend — Tailwind → Next.js**
1. Por que Tailwind (utility-first vs. CSS tradicional)
2. Classes fundamentais (spacing, cor, tipografia, flex/grid)
3. Responsividade e variantes (hover, dark mode, breakpoints)
4. Componentizando com Tailwind (`clsx`/`cva`)
5. Next.js: o que é, App Router na prática
6. Rotas, layouts, pastas privadas/públicas
7. Componentes de servidor vs. cliente
8. Data fetching e cache
9. Formulários com React Hook Form + Zod
10. Projeto guiado: tela CRUD do zero

**Trilha Ruby on Rails**
1. Ruby essencial (só o necessário pra ler Rails)
2. O que é Rails, convenção sobre configuração
3. Scaffold: gerando um recurso e entendendo cada arquivo
4. Models e migrations
5. Controllers e rotas REST
6. Serializers
7. Service objects
8. Autenticação com Devise
9. Autorização (CanCanCan) e RBAC
10. Projeto guiado: API REST completa, do scaffold ao endpoint autenticado

**Trilha Infraestrutura — Docker**
1. Por que containers
2. Dockerfile: anatomia
3. Imagens, camadas, cache de build
4. docker-compose: orquestrando múltiplos serviços
5. Variáveis de ambiente e volumes
6. Rede entre containers
7. Deploy: do compose local a um ambiente real
8. Projeto guiado: containerizar a app Rails + Next.js das outras trilhas

Este esqueleto define o escopo do primeiro plano de implementação — dá pra
crescer depois (mais capítulos) sem mudar a arquitetura, só adicionando
arquivo + entrada no `index.ts` do track.

## 9. Verificação

- `pnpm dev`: navegar hub → track → lição → quiz → próxima aula,
  conferir progresso salvo (recarregar a página e ver o check persistindo).
- Testar o `LiveEditor` (Sandpack) num exemplo Tailwind e num de React —
  preview atualiza ao editar.
- Testar em mobile (sidebar de capítulos vira painel, like o
  `DocsSidebarPanel` já faz hoje).
- Conferir que os links de `Callout` pras páginas `padrao-*` realmente
  existem (não apontam pra rota inexistente).
- `pnpm build` sem erro de tipo (novas dependências: `cmdk` já vinha do
  outro spec; aqui entra `@codesandbox/sandpack-react`).

## Arquivos tocados/criados (resumo)

- `src/content/aprenda/**` — novo (tracks + lições TSX).
- `src/components/aprenda/**` — novo (`LessonLayout`, `CodeExample`,
  `LiveEditor`, `Quiz`, `Exercise`, `Callout`).
- `src/lib/aprenda-progress.ts` — novo.
- `src/app/aprenda/page.tsx`, `src/app/aprenda/[track]/page.tsx`,
  `src/app/aprenda/[track]/[lesson]/page.tsx` — novo.
- `src/components/home-content.tsx` — reescrito (árvore de estudo +
  seção de referência).
- `src/components/navbar.tsx` — novo item "Aprenda" em destaque (some
  aqui do que já foi decidido no spec de redesign visual).
- `package.json` — nova dependência `@codesandbox/sandpack-react`.
