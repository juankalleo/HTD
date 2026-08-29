---
video: L8_98i_bMMA
---

# Tipografia

> Como o `base-front` trata texto: fonte institucional (troca em runtime),
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
