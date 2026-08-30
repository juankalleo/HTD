---
videoEn: xIevWxPwVCE
sidebar_label: Autorização
---

# Autorização

CanCanCan, mas **orientada a dado, não a código** — a diferença central
que faz esse padrão escalar. Ability não é uma lista de
`can :manage, Model` hardcoded por model; é um cálculo, em runtime, a
partir de papel/permissão cadastrados no banco pelo próprio admin do
tenant.

Na prática, isso é *zero trust* aplicado: nenhuma rota confia em
"usuário autenticado, então pode" — todo endpoint chama `authorize!`
antes de fazer qualquer coisa, e toda query passa por
`accessible_by(ability)` antes de devolver linha nenhuma. Autenticação
(provar quem é) e autorização (o que essa identidade pode ver/fazer) são
verificadas separadamente, sempre, a cada requisição — nunca assumidas a
partir de uma etapa anterior.

## Como a permissão é calculada

`app/models/ability.rb` percorre a cadeia
`usuário → a_usuarios_papeis → a_papel → a_permissoes`, e pra cada
permissão encontrada, resolve a classe do model
(`a_recurso.descricao.safe_constantize`) e a ação
(`a_acao.descricao.to_sym`) — sem nenhuma delas escrita à mão no código.
Cadastrar um papel novo com uma permissão nova não exige deploy: o
`Ability` já sabe interpretar qualquer combinação de recurso/ação que
exista nas tabelas de permissão.

## Verbo em português, não o nome da action Rails

```ruby
authorize! :CONSULTAR, APapel
```

`:CONSULTAR`/`:INCLUIR`/`:ALTERAR`/`:EXCLUIR` — o vocabulário de ação é o
mesmo que aparece na tela de cadastro de permissão que o admin usa, não
`:index`/`:create`/`:update`/`:destroy` do Rails. Isso significa que quem
cadastra uma permissão no admin está falando o mesmo idioma que o código
que a aplica — não precisa saber Rails pra entender o que uma permissão
concede.

## Escopo por tenant/órgão/unidade

Permissão concedida a um papel **escopado** (não-Plataforma) é filtrada
por uma condição de escopo específica da classe — um mapa
(`CONDIÇÃO_DE_ESCOPO_POR_CLASSE`) decide, por model, como aplicar
tenant/órgão/unidade na query. Uma classe **sem** entrada nesse mapa e
que receba uma permissão escopada levanta `ArgumentError`, alto e cedo —
de propósito. A alternativa (deixar passar sem escopo) vazaria dado de
outro tenant silenciosamente; quebrar alto é o comportamento mais seguro
entre os dois.

`accessible_by(ability)` — usado em todo `*/list.rb` (ver
[Filtros e busca](/padrao-api/conceitos-tecnicos/filtros-e-busca)) — é o
que aplica esse escopo antes de qualquer filtro de busca rodar.

## Wildcard, só pro papel de bootstrap

```ruby
can :manage, :all if a_recurso.descricao == ARecurso::ALL
```

Único `can :manage` de verdade no código — reservado ao papel inicial de
setup do tenant, que precisa poder cadastrar tudo antes de qualquer outro
papel existir. Todo outro papel é composto de permissão granular
cadastrada, nunca herda acesso total por acidente.

## O que acontece quando nega

```ruby
rescue_from CanCan::AccessDenied, with: :render_forbidden
```

`authorize!` que falha levanta `CanCan::AccessDenied`, capturado pelo
[mapa central de erro](/padrao-api/conceitos-tecnicos/tratamento-de-erros)
— `403`, `{"status":"error","message":"Acesso não permitido"}`. Mensagem
genérica de propósito: não diz qual permissão faltou, só que faltou uma.

## Leitura de apoio

- [CanCanCan — documentação oficial](https://github.com/CanCanCommunity/cancancan) — `can`/`cannot`, `accessible_by`, a API usada aqui.
- [OWASP — Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) — princípios gerais (least privilege, fail closed) que a decisão de levantar `ArgumentError` em classe sem escopo mapeado segue.
- [Role-Based Access Control: best practices (Cerbos)](https://www.cerbos.dev/blog/role-based-access-control-best-practices) — RBAC orientado a dado (papel + permissão configuráveis) em vez de código, o mesmo princípio central desta página.
