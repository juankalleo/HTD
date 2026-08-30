---
video: unfHrB2sGGM
videoEn: VenLRGHx3D4
sidebar_label: State Management
---

# State Management

Gerenciamento centralizado de dados compartilhados entre diferentes telas
e componentes de uma aplicação (ex: Redux, Zustand) — uma forma de dado
"viver" fora da árvore de componentes, acessível de qualquer ponto sem
precisar passar por prop de pai pra filho (o chamado *prop drilling*).

## No padrão frontend

Nenhuma lib de estado global faz parte do padrão hoje — nem
`Context`/`useContext` próprio em nenhum lugar do projeto (o único
"provider" da árvore é o do TanStack Query). O motivo não é falta de
necessidade genérica de "estado compartilhado" — é que o cenário que
normalmente justifica um Zustand já tem solução no próprio padrão de dado
do projeto: o **cache do TanStack Query**.

Exemplo real, `shared/hooks/use-configuracao-institucional.ts`:

```ts
export const configInstitucionalKeys = { atual: ["config-institucional", "atual"] as const };

export function useConfiguracaoInstitucional() {
  return useQuery({
    queryKey: configInstitucionalKeys.atual,
    queryFn: fetchConfiguracaoInstitucional,
  });
}
```

Esse hook é chamado em 8 arquivos sem parentesco na árvore de componentes
(sidebar, header, a tabela compartilhada, os dois formulários de
configuração institucional, os dois hooks de preview de relatório). Todos
leem a **mesma** config, do **mesmo** cache — a *chave* da query é o único
acoplamento entre eles, não um `Context`/`store` passado por cima da
árvore. Quando o admin salva uma mudança de aparência, a mutation invalida
essa chave:

```ts
onSuccess: () => {
  void Toast.success({ title: "Configuração institucional atualizada" });
  qc.invalidateQueries({ queryKey: configInstitucionalKeys.atual });
},
```

e isso propaga pra sidebar/header na hora — o mesmo comportamento que um
`store` global entregaria, sem dependência nova nem `Provider` extra.

Pra filtro de relatório compartilhado entre listagem e preview de export,
o padrão usa **URL** (`useSearchParams()`) em vez de cache — o filtro
sobrevive a um reload/link direto, o que um `store` client-side não
daria de graça.

**Quando trazer uma lib de verdade:** se aparecer um caso real que os dois
padrões acima (cache do React Query + URL) não cobrem — por exemplo, um
wizard multi-etapa com estado complexo que precisa sobreviver a navegação
entre passos sem ir pro servidor a cada etapa — **Zustand** é a escolha
padrão pra esse cenário: API pequena, sem boilerplate de Provider/reducer
como Redux, encaixa num componente isolado sem exigir reestruturar a
árvore.
