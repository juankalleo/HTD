---
video: NJ_X8rbH600
videoEn: F4zshDInsJY
---

# Tabelas — busca e paginação

> Padrão consolidado depois que uma auditoria das telas de listagem achou
> tabela sem busca, tabela sem paginação (`tipos-usuario`, a lista de papéis
> dentro de Permissões) e a mesma paginação copiada e colada em 3 lugares
> diferentes. Este documento é a referência única de "como uma lista admin
> deve se comportar" daqui pra frente.

## As quatro peças, em `shared/ui/`

```
shared/ui/filtros/search-input.tsx      → <SearchInput valor={busca} onChange={setBusca} />
shared/ui/filtros/filter-select.tsx     → <FilterSelect label="Tipo" valor={id} opcoes={[...]} onChange={setId} />
shared/ui/sistema/results-count.tsx     → <ResultsCount pagy={data.pagy} />
shared/ui/sistema/pagination.tsx        → <Pagination page={page} totalPages={n} onPageChange={setPage} />
shared/ui/tabelas/data-table.tsx        → <DataTable columns={columns} data={items} />
```

O `DataTable` é o motor de estado de tabela (ordenação, paginação, seleção)
construído sobre o [TanStack Table](https://tanstack.com/table/latest/docs/overview)
— um headless UI que dá controle total do markup e respeita o tema DaisyUI,
em vez de um componente de tabela pronto com design próprio.

Nenhuma tela reimplementa busca, filtro, contador ou paginação na mão —
sempre esses quatro componentes. Antes deles existirem, cada lista
(`usuarios-list.tsx`, `papeis-list.tsx`) tinha o mesmo bloco de botões
`«`/`»` copiado; a extração pra `shared/ui/pagination.tsx` eliminou a
duplicação.

### `SearchInput` — debounce embutido

```tsx
export function SearchInput({ valor, onChange, placeholder }: {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
}) { /* ... */ }
```

`onChange` só dispara 350ms depois que o usuário para de digitar — o
componente guarda um rascunho local enquanto isso. Isso importa porque
`onChange` vira direto um parâmetro de query pro backend (ver abaixo);
sem debounce, cada tecla seria uma request.

### `FilterSelect` — mesma ideia do `SearchInput`, mas `_eq` em vez de `_cont`

```tsx
<FilterSelect
  label="Tipo"
  valor={tipoUsuarioId}
  opcoes={tipos?.items.map((t) => ({ valor: String(t.id), label: t.descricao })) ?? []}
  onChange={handleFiltroTipo}
/>
```

`""` sempre significa "todos" (não manda o param). Só existe onde há uma
dimensão real e útil pra filtrar — hoje só **Usuários**, por tipo de
usuário (`q[a_tipo_usuario_id_eq]`). Não é obrigatório em toda lista: Papéis,
Tipos de usuário e o picker de Permissões não têm nenhum campo próprio que
justifique um filtro além da busca por texto — adicionar um ali seria
inventar UI sem necessidade real. Adicione `FilterSelect` numa lista nova
só quando ela realmente tiver uma coluna com poucos valores possíveis pra
agrupar por ela (tipo, status, categoria — nunca um campo livre).

### `ResultsCount` — "Mostrando X–Y de Z"

```tsx
export function ResultsCount({ pagy }: { pagy: PagyInfo }) {
  if (pagy.total_count === 0) return <p>Nenhum registro encontrado.</p>;
  const inicio = (pagy.current_page - 1) * pagy.per_page + 1;
  const fim = Math.min(pagy.current_page * pagy.per_page, pagy.total_count);
  return <p>Mostrando {inicio}–{fim} de {pagy.total_count}</p>;
}
```

Usa o mesmo `pagy` que toda resposta paginada da API já devolve
(`{current_page, total_pages, total_count, per_page}`) — nenhum cálculo
novo do lado do backend, só leitura do que já vem no envelope.

### `Pagination` — sempre visível, mesmo com 1 página só

```tsx
export function Pagination({ page, totalPages, onPageChange }: {...}) {
  // sem early return — os dois botões ficam disabled quando não há o que paginar
}
```

Já foi um componente que sumia sozinho com `totalPages <= 1` — mudou pra
sempre aparecer (botões desabilitados quando não cabe navegar) depois de
feedback de que a paginação "sumida" em telas com poucos registros
(comum em ambiente novo, ainda sem dado de verdade) parecia bug, não
comportamento esperado. Mesmo lugar, mesmo tamanho de tela, toda lista,
sempre.

## O padrão de hook por trás: busca é Ransack, não filtro no front

O backend Rails (`api/`) já expõe [Ransack](https://github.com/activerecord-hackery/ransack)
genérico em **todo** model (`ApplicationRecord#ransackable_attributes`
libera todas as colunas exceto uma lista curta de sensíveis — senha, token,
auditoria). Isso significa: busca é **sempre** um parâmetro de query a mais
no `useAdminList`, nunca um `.filter()` no array já carregado no client.

```ts
// features/admin/usuarios/hooks/use-usuarios.ts
export function useUsuarios(page = 1, busca = "") {
  return useAdminList<Usuario>(
    "users",
    { page, ...(busca ? { "q[nome_cont]": busca } : {}) },
    usuariosKeys.list(page, busca),
  );
}
```

`_cont` é o predicado Ransack de "contém" (LIKE `%valor%`); `nome_or_descricao_cont`
busca em dois campos ao mesmo tempo (usado em `papéis`, que mostra nome e
descrição na tabela). Qual campo(s) usar depende só do que a tabela mostra:

| Lista | Campo(s) buscado(s) | Ransack |
|---|---|---|
| Usuários | `nome` | `q[nome_cont]` |
| Tipos de usuário | `descricao` | `q[descricao_cont]` |
| Papéis / Permissões (picker) | `nome` **ou** `descricao` | `q[nome_or_descricao_cont]` |

A query key inclui `busca` (`usuariosKeys.list(page, busca)`), então o
React Query cacheia cada combinação de página+termo separadamente — trocar
o termo não perde o cache da página anterior.

## Resetar a página ao buscar

Toda lista reseta `page` pra `1` quando a busca muda — senão o usuário pode
ficar "preso" numa página 4 que não existe mais pro novo filtro:

```tsx
function handleBusca(valor: string) {
  setBusca(valor);
  setPage(1);
}
```

## Checklist pra uma lista nova

1. Hook de listagem aceita `(page, busca)` (mais um parâmetro de filtro se
   fizer sentido, ver `FilterSelect` acima) e monta `q[<campo>_cont]` /
   `q[<campo>_eq]` condicionalmente (só manda o param se o valor não for
   vazio).
2. Query key inclui todos os parâmetros que afetam o resultado — página,
   busca, e cada filtro.
3. Componente: `<SearchInput>` (+ `<FilterSelect>` se houver) acima da
   tabela, `<ResultsCount>` + `<Pagination>` abaixo, `handleBusca`/
   `handleFiltro*` sempre resetando a página pra `1`.
4. **Exceção**: hook usado como fonte de um `<select>` de outro formulário
   (ex.: `useTiposUsuario()` sem argumento, pro dropdown de
   `usuario-form.tsx`) fica **sem** paginação/busca/filtro de propósito —
   ali o consumidor precisa da lista inteira, não de uma página. Nesse
   caso, a tela de listagem usa um segundo hook, dedicado (ver
   `useTiposUsuarioPaginado` em [`DADOS-E-API.md`](tratamento-de-dados/DADOS-E-API.md)).

## Slots de tabela

Os primitivos de `shared/ui/tabelas/table.tsx` expõem `data-slot`:

```tsx
<div data-slot="table-container">
  <table data-slot="table">
    <tbody data-slot="table-body">
      <tr data-slot="table-row">
        <td data-slot="table-cell" data-label="Nome">...</td>
      </tr>
    </tbody>
  </table>
</div>
```

`DataTable` preenche `data-label` quando o header da coluna é texto. Isso
deixa a tabela pronta para shells responsivos e visualização em card sem
mudar cada lista individual.
