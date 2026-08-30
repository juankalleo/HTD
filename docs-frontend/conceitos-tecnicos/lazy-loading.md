---
video: DQoH30T7vu4
videoEn: IpuOnfjY82E
sidebar_label: Lazy Loading
---

# Lazy Loading

Estratégia de carregar imagens, vídeos ou componentes apenas quando eles
estão prestes a entrar na área visível da tela — evita gastar banda e
tempo de carregamento com conteúdo que o usuário talvez nunca role até
ver.

## No padrão frontend

Pra **componente**, o padrão usa `next/dynamic` — ver
[Code Splitting](/padrao-frontend/conceitos-tecnicos/code-splitting) — que
é essa mesma estratégia aplicada a um bloco de UI condicional em vez de
uma imagem.

Pra **imagem**, o padrão não usa `next/image`: as imagens institucionais
vêm de um host configurável em runtime (`NEXT_PUBLIC_API_URL`), incompatível
com a exigência de domínio fixo do `next/image` em `next.config.ts` (ver
[Otimização de imagem](/padrao-frontend/estilos/otimizacao-imagem)). As
duas únicas imagens nativas (`<img>`) do padrão — o ícone do sistema na
sidebar e o preview de imagem no formulário de Identidade institucional —
não usam `loading="lazy"`, porque as duas ficam sempre visíveis assim que
a respectiva tela carrega: `loading="lazy"` só traz ganho pra imagem
**abaixo da dobra**, e aplicado numa imagem já visível pode até atrasar
levemente o carregamento dela em alguns navegadores.

**Quando usaríamos:** se aparecer uma tela com imagem genuinamente fora da
área visível inicial (por exemplo, uma galeria longa), `loading="lazy"`
entra especificamente nessa imagem — não como atributo padrão em todo
`<img>` do projeto.
