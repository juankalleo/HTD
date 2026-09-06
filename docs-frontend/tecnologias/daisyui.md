---
video: 1OCN03HHXAQ
videoEn: Dw8Ut7oo6H0
date: "29 de agosto de 2026"
---

# DaisyUI

## O que é

Plugin do Tailwind que dá classes prontas de componente (`btn`,
`input`, `table`, `modal`, `select`, `dropdown`, `drawer`, `menu`...) em cima
dos utilitários do Tailwind — sem depender de JS de terceiro (nada de Radix).

## Por que essa

O padrão original cogitado (MUI) foi abandonado em favor de
DaisyUI puro. Manter uma única lib de componente evita ter dois sistemas
convivendo no projeto (um com Radix/shadcn, outro com DaisyUI). Como é
"só CSS", qualquer elemento (`<div>`, `<label>`, `<input>`) vira componente
só com className — sem biblioteca de componente React própria pra manter.
Leitura de apoio: [documentação oficial do DaisyUI](https://daisyui.com)
— por que um plugin de componentes sobre Tailwind evita um segundo design
system (Radix/shadcn) no projeto.

## Versão

`^5.7.22` (`package.json`).

## Como importar

```bash
pnpm add -D daisyui
```

```css
/* app/globals.css */
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark, corporate, business;
}
```

Só esses 4 temas ficam habilitados de propósito — DaisyUI vem com ~30
prontos, mas o tom "enterprise" (o backend deste padrão é vendido a órgão
público, ver `api/CLAUDE.md`) restringe a lista.

## Exemplo real

Tabela + paginação (`shared/ui/pagination.tsx` +
`features/admin/usuarios/components/usuarios-list.tsx`):

```tsx
<div className="overflow-x-auto rounded-lg border border-base-300">
  <table className="table">
    <thead>
      <tr>
        <th>Nome</th>
        <th className="text-right">Ações</th>
      </tr>
    </thead>
    <tbody>{/* ... */}</tbody>
  </table>
</div>

<div className="join mt-4 flex justify-center">
  <button className="join-item btn btn-sm" disabled={page <= 1} onClick={...}>«</button>
  <span className="join-item btn btn-sm btn-disabled">{page} / {totalPages}</span>
  <button className="join-item btn btn-sm" disabled={page >= totalPages} onClick={...}>»</button>
</div>
```

## Cores, nunca fixas

Todo componente usa os tokens semânticos do DaisyUI
(`bg-base-100`, `text-base-content`, `text-error`, `bg-primary/10`...), nunca
`gray-500`/`#fff` direto — são esses tokens que trocam sozinhos quando o
tema muda (`data-theme` no `<html>`, ver
[`CONFIGURACAO-INSTITUCIONAL.md`](../layout/CONFIGURACAO-INSTITUCIONAL.md)).
