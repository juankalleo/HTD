---
video: IOErtWIJCgo
videoEn: kHQNK2jU_TQ
sidebar_label: Class Variance Authority
date: "29 de agosto de 2026"
---

# Class Variance Authority

## O que é

Utilitário para declarar variantes tipadas de classes CSS.

## Por que essa

Evita repetir strings de classe para estados comuns de UI
(`primary`, `ghost`, `destructive`, `sm`, `xs`). A biblioteca não impõe visual e
não substitui DaisyUI; ela só organiza as classes do padrão atual. Leitura de
apoio: [documentação oficial do CVA](https://cva.style/) — por que declarar
variantes tipadas em vez de esparramar strings de classe.

## Versão

`^0.7.1` (`package.json`).

## Como importar

```bash
pnpm add class-variance-authority
```

```ts
import { cva, type VariantProps } from "class-variance-authority";
```

## Exemplo real

```tsx
export const buttonVariants = cva("btn inline-flex items-center", {
  variants: {
    variant: {
      primary: "btn-primary",
      destructive: "btn-ghost text-error hover:bg-error/10",
    },
    size: {
      xs: "btn-xs",
      sm: "btn-sm",
    },
  },
});
```

Regra: criar variante quando a combinação de classes representa uma intenção de
interface reutilizável. Não criar variante para ajuste pontual de uma tela.
