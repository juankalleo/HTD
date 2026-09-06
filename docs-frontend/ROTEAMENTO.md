---
video: nlc-l2nW_J0
videoEn: gSSsZReIFRk
sidebar_label: Roteamento
date: "30 de agosto de 2026"
---

# Roteamento

O padrão de rotas do front usa o App Router do Next.js para a URL real, mas a
nomeação no código segue a convenção Rails-like: helpers com sufixo
`_path`, prefixo de módulo e ações `new_`/`edit_`.

Isso deixa o código previsível para quem vem do Rails:

```ts
ROUTES.m_usuarios_path;
ROUTES.new_m_usuario_path;
ROUTES.edit_m_usuario_path(usuario.id);

ROUTES.a_tipo_usuarios_path;
ROUTES.new_a_tipo_usuario_path;
ROUTES.edit_a_tipo_usuario_path(tipoUsuario.id);
```

## Por que essa disciplina

Dois anti-padrões comuns aparecem em projetos que não centralizam rota assim:

- **Sem helper nenhum**: toda navegação vira string literal espalhada pelo
  código (`router.push("/admin/pedidos?status=pendente")` repetido em
  vários componentes). Sem um `ROUTES` central, renomear uma URL significa
  caçar cada ocorrência manualmente, e um typo na string só quebra em
  runtime, sem o TypeScript avisar.
- **Nomeação sem convenção que se sustente**: mesmo um projeto que começa
  organizado pode deixar uma seção crescer sem nesting — dezenas de rotas
  nomeadas na mão (`relatorios_x_pdf`, `relatorios_x_print`,
  `relatorios_x_gestor_preview`...) em vez de um padrão reutilizável tipo
  `member`/`collection`. É o resultado de não aplicar a mesma disciplina de
  nomeação em todo canto do projeto conforme ele cresce.

Neste projeto ([HTD-Front](https://github.com/juankalleo/HTD-Front)): toda página em `app/` tem um helper
correspondente em `ROUTES`, e nenhum outro arquivo do projeto usa string
literal de rota — confirmado por grep, zero ocorrência de
`router.push("/...")`/`href="/..."` fora de `lib/routes.ts` e do teste
dele. Esse é o resultado de tratar `lib/routes.ts` como porta única, e é
a régua pra manter conforme o projeto cresce (ver "Ação de membro/coleção"
abaixo, pensado especificamente pra `relatorios_*` não crescer flat com o
tempo).

## Onde fica

Toda rota navegável fica centralizada em `lib/routes.ts`. Página, sidebar,
formulário, preview de relatório e redirect devem importar `ROUTES`, em vez de
repetir string como `"/usuarios/novo"` no meio do componente.

```tsx
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export function UsuariosListAction() {
  return (
    <Link href={ROUTES.new_m_usuario_path} className="btn btn-primary btn-sm">
      Novo usuário
    </Link>
  );
}
```

## Nomeação

Use a forma húngara/Rails-like como nome canônico do helper:

| Caso | Padrão | Exemplo |
| --- | --- | --- |
| Lista | `<modulo>_<recursos>_path` | `a_papeis_path` |
| Novo | `new_<modulo>_<recurso>_path` | `new_a_papel_path` |
| Registro | `<modulo>_<recurso>_path(id)` | `a_papel_path(id)` |
| Edição | `edit_<modulo>_<recurso>_path(id)` | `edit_a_papel_path(id)` |
| Ação aninhada | `<modulo>_<recurso>_<acao>_path(id)` | `a_papel_permissoes_path(id)` |
| Relatório | `relatorios_<assunto>_path` | `relatorios_usuarios_path` |
| Preview/exportação | `relatorios_<assunto>_<formato>_preview_path` | `relatorios_usuarios_pdf_preview_path` |

`a_papel_permissoes_path(id)` merece nota à parte: o `id` que ela recebe é
de um **papel**, mas a URL de verdade é `/acessos/permissoes/:id` — o nome
descreve a **relação** ("as permissões deste papel"), não o formato exato
da URL. É intencional, não drift: a tela em `/acessos/permissoes/:id`
mostra as permissões de um papel específico, então nomear pela relação
(`papel_permissoes`) é mais claro no call site
(`papeis-list.tsx`/`permissoes-papeis-list.tsx`) do que nomear pela URL
literal. Difere do padrão Rails puro (que nomearia pelo path,
`a_permissao_path(id)`), mas seguir a URL ao pé da letra aqui esconderia
de quem lê o código que o `id` é de papel, não de permissão.

O prefixo indica a área do domínio:

| Prefixo | Uso |
| --- | --- |
| `a_` | Administração, RBAC, organização institucional e cadastros administrativos. |
| `g_` | Cadastros gerais/geográficos, como países, estados e municípios. |
| `m_` | Usuários/membros do sistema (caso `m_usuarios`). |
| `relatorios_` | Telas analíticas e exportações. |

`m_` não é uma invenção isolada desta camada de rota — o mesmo prefixo,
pelo mesmo motivo, aparece do lado do backend Rails (ver
[Nomenclatura e módulos](/padrao-banco-de-dados/conceitos-tecnicos/nomenclatura-e-modulos)
no Padrão Banco de Dados): um `User`/`users` sem prefixo no model (a
exceção documentada da regra) ainda ganha `m_` na camada de rota —
convenção consistente entre as duas camadas, não coincidência.

## Ação de membro/coleção com verbo

Nem toda rota é lista/novo/registro/edição. Um botão como "aprovar",
"cancelar" ou "validar" numa tela específica é uma **ação de membro**
(opera sobre um registro, precisa de `id`) ou **ação de coleção** (não
precisa de `id`, filtra ou agrega o conjunto inteiro) — o mesmo conceito
que o Rails expõe nativamente no roteador via bloco `member`/`collection`
(`member { post :aprovar }`, `collection { get :pendentes }`), replicado
aqui do lado do front pra manter o mesmo vocabulário nas duas camadas.

Convenção do nome — verbo **antes** do módulo/recurso, no mesmo lugar que
`new_`/`edit_` já ocupam:

| Caso | Padrão | Exemplo |
| --- | --- | --- |
| Ação de membro (com `id`) | `<verbo>_<modulo>_<recurso>_path(id)` | `aprovar_o_proposta_path(id)` |
| Ação de coleção (sem `id`) | `<verbo>_<modulo>_<recursos>_path` | `minhas_c_requisicoes_path` |

O helper existente (`memberPath`, que já monta `<base>/<id>` pra
`a_papel_path`/`edit_a_papel_path`) é reaproveitável direto pra esse
caso, sem função nova — uma ação de membro é só

```ts
aprovar_o_proposta_path: (id: RouteId) => `${memberPath("/propostas", id)}/aprovar`,
```

— o mesmo `memberPath` que já sustenta `a_papel_path`/`edit_a_papel_path`
hoje, sem duplicar lógica de montagem de URL.

## URL em português

O helper usa `new_` e `edit_` no nome porque esse é o padrão mental do Rails.
A URL pode continuar em português quando a rota já existe assim no Next:

```ts
ROUTES.new_a_papel_path; // /acessos/papeis/novo
ROUTES.edit_a_papel_path(10); // /acessos/papeis/10/editar
```

Ou seja: a regra de nomeação organiza o código; a URL pública respeita o idioma
e a compatibilidade da aplicação.

## Id ou slug

Use `id` quando a URL identifica um registro persistido do backend. É o caso
padrão de CRUD administrativo:

```ts
ROUTES.edit_m_usuario_path(usuario.id);
ROUTES.edit_a_tipo_usuario_path(tipoUsuario.id);
ROUTES.edit_a_papel_path(papel.id);
```

Use `slug` quando o segmento identifica uma categoria estável de rota, uma
página de documentação ou um agrupador conhecido pelo front. Em referenciais,
`orgaos`, `estados` e `municipios` são slugs de coleção:

```ts
ROUTES.referencial_recurso_path("orgaos");
ROUTES.new_referencial_path("orgaos");
ROUTES.edit_referencial_path("orgaos", orgao.id);
```

Nesse exemplo, `orgaos` é slug porque escolhe qual cadastro abrir. O registro
continua sendo `id`, porque a edição altera uma linha real da API.

Só use slug para registro quando o backend garantir unicidade e estabilidade,
como `friendly_id`, `codigo` imutável ou chave natural exposta como contrato.
Não transforme `nome` em slug no front para editar registro; isso quebra quando
o usuário renomeia, duplica ou muda acentuação.

## Fallback seguro

Helper de registro volta para a coleção quando recebe `id` vazio. Esse padrão
segue o comportamento padrão de scaffold Rails, que redireciona para o índice quando não encontra o
registro.

```ts
ROUTES.edit_a_papel_path(undefined); // /acessos/papeis
ROUTES.edit_referencial_path("", 7); // /referenciais
```

Isso evita gerar links como `/usuarios/undefined/editar`. A tela ainda deve
validar permissão e existência via API, mas a montagem da URL não deve criar
caminho inválido.

## Query string

Filtros de relatório e preview devem usar `withQuery()`, não
`new URLSearchParams()` espalhado em cada componente.

```ts
import { ROUTES, withQuery } from "@/lib/routes";

const href = withQuery(ROUTES.relatorios_usuarios_pdf_preview_path, {
  busca,
  tipo: tipoUsuarioId,
});
```

Valores vazios são ignorados. Listas repetem a chave:

```ts
withQuery(ROUTES.relatorios_orgaos_path, {
  status: ["ativo", "pendente"],
});
```

## Checklist

1. Criou rota nova em `app/`: adicionar helper em `lib/routes.ts`.
2. Linkou botão, menu ou breadcrumb: usar `ROUTES`, não string literal.
3. Criou tela `novo`: helper `new_<modulo>_<recurso>_path`.
4. Criou tela `editar`: helper `edit_<modulo>_<recurso>_path(id)`.
5. Criou rota dinâmica por categoria: tratar como slug de coleção.
6. Criou rota dinâmica de registro: preferir `id`, salvo contrato explícito de slug no backend.
7. Criou filtro em link de relatório: montar com `withQuery()`.
8. Adicionou helper compartilhado: cobrir em `lib/__tests__/routes.test.ts`.
9. Criou ação de verbo (aprovar/cancelar/validar): nomear
   `<verbo>_<modulo>_<recurso>_path`, montar com `memberPath` existente —
   nunca deixar `relatorios_*` (ou qualquer seção) crescer flat, com
   dezenas de rotas nomeadas na mão sem nesting.

## Leitura de apoio

- [Next.js — App Router (docs oficiais)](https://nextjs.org/docs/app) — roteamento por sistema de arquivos.
- [Next.js — Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) — como `(auth)`, `(admin)` organizam a árvore sem mudar a URL.
- [OWASP — Unvalidated Redirects and Forwards](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) — por que `redirectSeguro()` bloqueia open redirect.
