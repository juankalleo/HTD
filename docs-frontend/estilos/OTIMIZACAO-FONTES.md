---
video: dCuGOXFC4RQ
videoEn: L8_98i_bMMA
date: "29 de agosto de 2026"
---

# Otimização de fontes

**O que é:** carregar a fonte sem travar a pintura da tela (sem FOIT/FOUT visível) e sem request extra de CSS. No Next.js o caminho nativo é `next/font`, que baixa a fonte em build time, hospeda localmente e exponha como CSS variable — sem `link` pro Google Fonts em runtime.

## Padrão adotado (HTD-Front)

Todas as fontes institucionais são carregadas via `next/font/google` em `app/layout.tsx`, cada uma numa CSS variable:

```ts
import { Geist, Geist_Mono, Inter, Roboto, Open_Sans /* ... */ } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"] });
// ...demais fontes do catálogo institucional
```

O `layout.tsx` aplica o `variable` no `<html>` e, no servidor, sobrescreve `--font-sans` com a fonte escolhida pelo admin (`theme/fonts.ts` → `cssVarDaFonte`):

```ts
<html style={{ "--font-sans": cssVarDaFonte(config.fonte) } as React.CSSProperties}>
```

O catálogo de fontes que o admin pode escolher está em `theme/fonts.ts` (`FONTES_INSTITUCIONAIS`) — espelha `CConfiguracao::FONTES` da API. Toda fonte listada precisa ter o `next/font/google` correspondente declarado no `layout.tsx`, senão a `cssVar` aponta pra variável inexistente.

## Regras

- **Nunca** usar `<link href="https://fonts.googleapis.com">` no `<head>` — `next/font` já faz o download em build e elimina o round-trip.
- Fontes com peso diferente de 400 declaram `weight: [...]` no `next/font` (ex.: `Poppins({ weight: ["400","500","700"] })`), senão o Next usa 400 e o peso some.
- A fonte padrão do projeto é **Geist** (`--font-geist-sans`); as demais entram só porque a Configuração Institucional deixa o admin trocar.
- Aplicar fonte sempre via CSS variable (`var(--font-sans)`), nunca setando `font-family` fixo no componente — assim a troca institucional funciona sem recompile de tela.

**Convenção:** `next/font` no `layout.tsx` + CSS variable; escolha de fonte em runtime vem da Configuração Institucional e só troca a variável, não o carregamento.

## Leitura de apoio

- [Next.js — Font optimization (next/font)](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) — download em build, hospedagem local, zero round-trip pro Google Fonts.
- [MDN — Variable fonts guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide) — por que fontes variáveis reduzem peso e FOIT/FOUT.
- [Why Tailwind CSS (swyx)](https://swyx.io/why-tailwind) — sistema de design via tokens.
