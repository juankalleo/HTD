---
video: h3s47owx8io
videoEn: re2JFITR7TI
---

# clsx + tailwind-merge (`cn()`)

## O que é

Duas libs pequenas combinadas num helper só (`lib/cn.ts`):
`clsx` monta uma string de className a partir de condições (`ativo && "..."`,
objeto `{ classe: condição }`), `tailwind-merge` resolve conflito entre
utilities do Tailwind (ex.: `"px-2 px-4"` vira só `"px-4"`, a última vence,
em vez das duas ficarem no DOM brigando por especificidade).

## Por que essa

É o utilitário mais comum de qualquer projeto Tailwind e o
[HTD-Front](https://github.com/juankalleo/HTD-Front) tinha passado sem ele até agora, concatenando className
condicional na mão com template string. Centralizar em `cn()` elimina essa
repetição e mantém um só ponto pra compor classes. Leitura de apoio:
[clsx](https://github.com/lukeed/clsx) e
[tailwind-merge](https://github.com/dcastil/tailwind-merge) (repositórios
oficiais) — por que compor className condicional e resolver conflito de
utilities num helper único.

## Versão

`clsx@^2.1.1`, `tailwind-merge@^3.6.0` (`package.json`).

## Como importar

```bash
pnpm add clsx tailwind-merge
```

```ts
// lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
import { cn } from "@/lib/cn";
```

## Exemplo real

Link ativo na sidebar (`shared/layout/app-sidebar.tsx`):

```tsx
<Link
  className={cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors",
    active ? "bg-primary/10 text-primary" : "text-base-content/70 hover:bg-base-200 hover:text-base-content",
  )}
>
```

Sem `cn()`, isso vira um template string com `${condição ? "a" : "b"}`
misturado nas classes fixas — funciona, mas fica ilegível conforme mais
condições entram. Use `cn()` sempre que houver **mais de uma** classe
condicional; pra uma condição só, o template string direto ainda é mais
simples.
