---
video: k_rCfuqC0og
videoEn: RPgZIIxKCgU
date: "29 de agosto de 2026"
---

# Select

> O [HTD-Front](https://github.com/juankalleo/HTD-Front) **não tem um `FormSelect`**. Há dois usos distintos, com
> convenções diferentes: filtro de lista (`FilterSelect`) e campo de
> formulário (React Hook Form na mão).

## 1. Filtro de lista — `FilterSelect`

`shared/ui/filtros/filter-select.tsx`. Usado nas listas admin pra filtrar
por um campo — o valor vira `q[<campo>_eq]` no hook de listagem (mesmo
raciocínio do `SearchInput`, ver [TABELAS.md](../TABELAS.md)).

```tsx
<FilterSelect
  label="Tipo de usuário"
  valor={tipoSelecionado}
  opcoes={tipos.map((t) => ({ valor: t.id, label: t.nome }))}
  onChange={(valor) => setTipo(valor)}
/>
```

Regras do `FilterSelect`:

- `""` **sempre** representa "todos" (primeira `<option value="">Todos</option>`).
- Nunca manda o parâmetro quando vazio — o hook de listagem só acrescenta
  `q[<campo>_eq]` se `valor !== ""`.
- `select select-sm w-auto` — tamanho compacto, próprio pra barra de filtros.

## 2. Campo de formulário — RHF na mão

Em formulários (`react-hook-form`), o `<select>` é montado direto com
`register` — não há wrapper de componente, a opção vem de `constants`/`types`
da feature:

```tsx
<select
  {...register("a_tipo_usuario_id")}
  className="select select-bordered w-full"
>
  <option value="">Selecione…</option>
  {tipos.map((t) => (
    <option key={t.id} value={t.id}>{t.nome}</option>
  ))}
</select>
```

A mesma regra de qualquer input RHF vale: nome do campo bate com o schema Zod
(ver [Formulários](../formularios/FORMULARIOS.md)), erro vem de
`formState.errors`.

## Por que não um `FormSelect`?

Os dois casos têm responsabilidades diferentes (um alimenta query string de
listagem, outro alimenta o payload de mutation) e o `<select>` nativo + DaisyUI
já cobre os dois sem abstração extra. Se surgir um terceiro padrão recorrente
(select assíncrono, select com busca), aí sim vale avaliar um componente —
hoje não há.
