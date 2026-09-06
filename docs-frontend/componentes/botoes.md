---
video: oPOKpSFqy-I
videoEn: _-G7VTWqMfc
sidebar_label: Botões
date: "29 de agosto de 2026"
---

# Botões (`Button`)

Componente de botão tipado, em `shared/ui/sistema/button.tsx`. Encapsula as
classes do DaisyUI (`btn`, `btn-primary`, etc.) via `cva`, para não espalhar
variantes pela aplicação.

```tsx
import { Button, buttonVariants } from "@/shared/ui/sistema/button";

<Button variant="primary" size="sm">Salvar</Button>
<Button variant="destructive">Excluir</Button>
<a className={buttonVariants({ variant: "link" })} href="/ajuda">Ajuda</a>
```

## Variantes (`variant`)

| Valor          | Classe aplicada                    | Uso                        |
| -------------- | ---------------------------------- | -------------------------- |
| `primary`      | `btn-primary`                      | Ação principal (padrão)    |
| `secondary`    | `btn-secondary`                    | Ação secundária            |
| `accent`       | `btn-accent`                       | Destaque                   |
| `neutral`      | `btn-neutral`                      | Neutro                     |
| `outline`      | `btn-outline`                      | Contorno                   |
| `ghost`        | `btn-ghost`                        | Discreto / toolbar         |
| `destructive`  | `btn-ghost text-error hover:bg-error/10` | Exclusão / perigo   |
| `link`         | `btn-link`                         | Link-estilo                |

## Tamanhos (`size`)

`xs` (`btn-xs`), `sm` (`btn-sm`, **padrão**), `md` (sem classe extra),
`lg` (`btn-lg`), `icon` (`btn-square` — quadrado para ícones).

## Comportamento

- `type` sempre `"button"` por padrão — para submit informe `type="submit"`
  explicitamente (evita submit acidental de formulário).
- Aceita todas as props nativas de `<button>` (`onClick`, `disabled`,
  `aria-*`, ...), mais `className` mesclado via `cn`.
- `buttonVariants({...})` devolve só a string de classes — útil para
  transformar um `<a>`/`<Link>` em botão sem trocar de elemento.

## Leitura de apoio

- [class-variance-authority (CVA) — Docs](https://cva.style/docs) — por que as variantes de `Button` são declaradas com `cva` (type-safe, sem prop drilling de classe).
- [Tailwind CSS v4 — Docs](https://tailwindcss.com/docs) — classes do DaisyUI (`btn`, `btn-primary`) encapsuladas.
- [DaisyUI — Button](https://daisyui.com/components/button/) — variantes visuais base do botão.
