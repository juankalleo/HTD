---
video: m54omTveWa8
videoEn: Y5TYDo9Qcv4
date: "29 de agosto de 2026"
---

# Tipografia

> Como o [HTD-Front](https://github.com/juankalleo/HTD-Front) trata texto: fonte institucional (troca em runtime),
> escala tipográfica padrão e as regras pra nunca fixar fonte/tamanho no
> componente. Complementa [Otimização de fontes](OTIMIZACAO-FONTES.md), que
> cobre o carregamento em si.

## Onde a fonte mora

A fonte não é escolhida por componente — vem de um lugar só:

- `theme/fonts.ts` declara a fonte (via `next/font/google`) e a expõe como
  token/variável CSS.
- `app/layout.tsx` carrega a fonte no servidor e aplica no `<html>` — nada de
  `<link>` pro Google Fonts (ver [Otimização de fontes](OTIMIZACAO-FONTES.md)).
- A **Configuração Institucional** troca a fonte em runtime (por tenant) — o
  usuário/admin escolhe e o servidor aplica sem flash. Nenhum componente sabe
  qual fonte está ativa; ele só usa a variável de tema.

`font-sans` (Tailwind v4) aponta pra essa fonte institucional. Todo texto do
sistema herda dela por padrão — não se redefine `font-family` em lugar nenhum.

## Escala tipográfica padrão

Não existe um componente de tipografia próprio: usa-se utilitários Tailwind +
tokens DaisyUI (`text-base-content`, `text-base-content/60` pra texto
secundário). O que se repete em toda tela:

| Uso | Classe |
|---|---|
| Título de seção / modal | `text-lg font-bold text-base-content` |
| Rótulo de campo | `text-sm text-base-content/60` |
| Texto de corpo | `text-sm` / `text-base` |
| Texto de apoio / dica | `text-xs text-base-content/60` |
| Valor de KPI / número | `font-semibold` |

## O catálogo de fontes institucionais — e o que faz uma fonte boa pra UI

`FONTES_INSTITUCIONAIS` (`theme/fonts.ts`) lista as fontes que a Configuração Institucional pode
aplicar: Geist (padrão), Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Source Sans, Nunito,
Work Sans, Rubik, Raleway, IBM Plex Sans. Nenhuma escolhida ao acaso — todas compartilham um
punhado de característica que faz uma fonte funcionar bem em UI de produto (diferente de fonte
boa pra título de marketing ou impressão):

- **x-height alta** — a altura das letras minúsculas relativa às maiúsculas. Texto de interface é
  majoritariamente minúsculo e pequeno (rótulo, dado de tabela); x-height baixa fica ilegível
  cedo demais quando o tamanho de fonte cai.
- **Peso variável disponível** (`next/font` carrega múltiplos `font-weight` da mesma família) —
  permite usar `font-semibold`/`font-bold` pra hierarquia sem precisar de uma segunda fonte só
  pra destaque.
- **Cobertura de caractere ampla** — acento, cedilha, todo o alfabeto latino estendido sem
  glyph faltando (relevante pra qualquer sistema em português).
- **Neutra o bastante pra não competir com o conteúdo** — a fonte de um painel administrativo não
  deveria "chamar atenção" pra si mesma; é uma característica de design deliberada, não falta de
  personalidade.

**Inter** é hoje talvez a fonte mais usada em produto de software do mercado — desenhada
especificamente pra tela (o nome vem de "interface"), x-height generosa, ótima legibilidade em
tamanho pequeno. **Nunito** é geométrica com cantos arredondados — mais amigável/menos corporativa
que Inter, ainda mantendo boa legibilidade. **Geist** (a fonte padrão aqui, da Vercel) segue a
mesma família de raciocínio — moderna, neutra, feita pra interface. As outras do catálogo (Roboto,
Open Sans, Lato, Montserrat, Poppins, Work Sans, Rubik...) seguem o mesmo critério — cada uma um
ponto ligeiramente diferente de personalidade (mais geométrica, mais humanista, mais compacta),
mas todas dentro da mesma categoria "sans-serif desenhada pra tela, com bom x-height e peso
variável". Escolher fonte pra uma UI nova é escolher dentro dessa categoria — não vale a pena sair
dela pra algo decorativo/serifado no corpo do texto de um sistema administrativo.

## Texto longo (prose)

Quando há um bloco de texto corrido (termos, descrição de relatório, preview),
usa-se o `prose` do Tailwind Typography já ajustado aos tokens do DaisyUI —
nunca HTML de parágrafo solto sem classe, que foge do tema (cor/escala).

## Regras

- Nunca `<link>` pro Google Fonts — só `next/font`.
- Nunca fonte hardcoded num componente — vem do tema institucional.
- Respeitar `--app-scale` (escala da Configuração Institucional): ela afeta o
  `rem`, então tamanho fixo em `px` dentro de texto pode desalinhar com o
  resto do shell.
- Heading de tela segue o padrão `text-lg font-bold` — não inventar tamanho
  só pra "dar destaque", alinha com o resto do sistema.
