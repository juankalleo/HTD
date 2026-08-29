---
video: 87i0pejrULw
sidebar_label: Hydration
---

# Hydration

Processo em que o JavaScript do cliente anexa ouvintes de eventos ao HTML
estático pré-renderizado pelo servidor. O servidor manda HTML pronto (pra
carregar rápido e ser indexável); o React, no navegador, "reaproveita"
esse HTML — em vez de descartar e desenhar tudo de novo, ele confere se o
HTML bate com o que renderizaria e só anexa os handlers de evento por
cima. Quando o HTML do servidor diverge do HTML que o client geraria, o
React avisa como erro de hidratação.

## No padrão frontend

`suppressHydrationWarning` é reservado pra um caso específico e
consciente: o script de tema em `app/layout.tsx`. Esse script roda **antes**
da hidratação (via `<script>` inline no `<head>`), lê a preferência de tema
salva localmente e ajusta `data-theme` no HTML cru — pra evitar o flash de
tema errado no primeiro paint (o servidor, ao gerar o HTML, não sabe qual
tema o navegador vai preferir).

```tsx
<html lang="pt-BR" data-theme={config.tema} /* ... */ suppressHydrationWarning>
  <head>
    <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
  </head>
  <body className="min-h-full flex flex-col">
    <QueryProvider>{children}</QueryProvider>
  </body>
</html>
```

Isso cria uma divergência esperada entre o `data-theme` do HTML gerado no
servidor e o `data-theme` que o script já ajustou no client antes do React
hidratar — exatamente o tipo de coisa que o React normalmente sinaliza
como erro. `suppressHydrationWarning` silencia esse aviso **só nesse nó**
(não propaga pros filhos): é o único ponto do padrão onde esse atributo é
usado, e se aparecer um erro de hidratação em qualquer outro componente,
é bug de verdade, não ruído desse silenciamento.
