---
video: cK_oUe6MbH8
sidebar_label: Tree Shaking
---

# Tree Shaking

Processo de otimização dos empacotadores (como Webpack ou Vite) que
elimina códigos mortos ou não utilizados do bundle final. O bundler
analisa estaticamente os `import`/`export` (por isso só funciona bem com
ES Modules, não com `require` do CommonJS) e corta do resultado final tudo
que nunca é referenciado em lugar nenhum do código.

## No padrão frontend

O padrão pra reexportar qualquer lib de terceiros é um barrel com
**exports nomeados**, contendo só o que já está em uso — nunca `export *`
de um módulo inteiro. Exemplo real, `theme/icons.tsx` (ícones
`lucide-react`):

```ts
/**
 * Barrel de ícones do projeto — lucide-react. Reexporta só os que já são
 * usados em algum componente (nada especulativo); cresce conforme a
 * necessidade real aparecer, igual o resto do projeto.
 */
export {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  // ...só os que algum componente do projeto realmente usa
} from "lucide-react";
```

É esse formato (exports nomeados, um barrel enxuto) que permite o bundler
provar estaticamente quais dos milhares de ícones da lib nunca são
referenciados, e descartar o resto. Next.js/Turbopack já fazem tree
shaking por padrão em cima disso — não precisa de configuração extra em
`next.config.ts`.

O trabalho manual do padrão é a disciplina de manter o barrel só com o que
está em uso: tree shaking não ajuda se o barrel reexportar a lib inteira
de uma vez, porque nesse caso o bundler não consegue provar que nada é
usado — o corte só acontece quando o código realmente fica "não
referenciado" em algum ponto da árvore de imports.
