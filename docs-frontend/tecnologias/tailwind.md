---
video: esfzSt8V7ek
---

# Tailwind CSS

## O que é

Framework CSS utility-first — classes prontas (`px-4`,
`text-sm`, `rounded-lg`) direto no JSX, sem escrever arquivo `.css` por
componente.

## Por que essa

Camada de acabamento visual do projeto — espaçamento,
cor, responsividade, alinhamento, estados. Componente pronto vem do DaisyUI
(ver [`daisyui.md`](daisyui.md)), acabamento fino é Tailwind puro. Decisão
mantida mesmo depois de avaliar shadcn/ui e MUI X Charts pra relatórios —
os dois foram descartados (ver [`shadcn-ui.md`](/padrao-frontend/tecnologias/shadcn-ui) e
[`mui-x-charts.md`](mui-x-charts.md)) exatamente pra não abrir um segundo
sistema de design ao lado deste. Leitura de apoio:
[Why Tailwind CSS (swyx)](https://swyx.io/why-tailwind) e a
[documentação oficial do Tailwind](https://tailwindcss.com) — por que o
modelo utility-first reduz naming, CSS morto e conflitos de especificidade.

## Versão

`^4` (`package.json`) — Tailwind v4, configuração via
`@import "tailwindcss"` direto no CSS (`app/globals.css`), sem
`tailwind.config.js`.

## Como importar

Nada pra importar por arquivo — as classes funcionam
direto no `className` de qualquer elemento, desde que `app/globals.css`
esteja importado no layout raiz (já está, por padrão do scaffold).

## Exemplo real

`shared/forms/form-field.tsx`, campo de formulário
padrão do projeto:

```tsx
export function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-base-content" htmlFor={id}>
        {label}
      </label>
      <input id={id} className={`input w-full ${error ? "input-error" : ""}`} {...inputProps} />
      {error && <p className="text-xs font-medium text-error">{error}</p>}
    </div>
  );
}
```

Cor **nunca** é fixa (`slate-900`, `red-600`...) — sempre um token
semântico do DaisyUI (`text-base-content`, `text-error`, `bg-primary/10`).
É esse vocabulário de tokens que troca sozinho quando o tema muda
(`data-theme` no `<html>`, tema institucional ou pessoal — ver
[`../CONFIGURACAO-INSTITUCIONAL.md`](../layout/CONFIGURACAO-INSTITUCIONAL.md)).
Usar uma cor Tailwind fixa quebra esse contrato: o elemento para de reagir
à troca de tema.
