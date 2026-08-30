---
sidebar_label: Arquitetura de serializers
---

# Arquitetura de serializers

Um serializer por model, responsável só por decidir quais atributos
saem no JSON — nunca lógica de negócio, nunca formatação de UI.

## O molde comum — quase sempre isso, nada mais

```ruby
# app/serializers/application_serializer.rb
class ApplicationSerializer < ActiveModel::Serializer
end
```

```ruby
# app/serializers/a_papel_serializer.rb
class APapelSerializer < ApplicationSerializer
  attributes :id, :nome, :descricao
end
```

A maioria dos serializers do projeto é só isso — uma lista de atributo
escalar. `ApplicationSerializer` existe mais por convenção estrutural
(todo serializer herda de algo próprio, não de `ActiveModel::Serializer`
direto) do que por comportamento compartilhado — hoje não sobrescreve
nada.

## Quando um serializer precisa de mais — atributo computado e associação

```ruby
# app/serializers/current_user_serializer.rb
class CurrentUserSerializer < ApplicationSerializer
  attributes :id, :nome, :email, :a_tenant
  belongs_to :a_tipo_usuario

  def a_tenant
    unidade = object.a_unidade
    orgao = unidade&.a_orgao
    tenant = orgao&.a_tenant
    tenant ? { id: tenant.id, nome: tenant.nome } : nil
  end
end
```

Um método com o mesmo nome do atributo declarado sobrescreve o valor
padrão (que seria só `object.a_tenant`, que nem existe como coluna
direta) — aqui ele percorre `unidade → órgão → tenant` e devolve um hash
reduzido, não o registro `ATenant` inteiro. `belongs_to` inclui a
associação serializada (recursivamente, pelo serializer dela própria),
não só o `id` da FK.

## Como a resolução automática funciona — e onde ela falha

`render_success(data: @papel, ...)` resolve `APapelSerializer`
automaticamente, por convenção de nome de classe (`Model` →
`ModelSerializer`) — nenhum controller passa `serializer:` explícito na
maioria dos casos. Essa convenção **quebra** quando o nome da classe do
model não bate com o nome do serializer — um exemplo comum é model vindo
de uma gem externa, como `PaperTrail::Version`, cujo serializer correto (`VersionLogSerializer`)
não segue o padrão `PaperTrail::VersionSerializer` de propósito (nome
teria que colidir com o namespace da gem — ver
[Modelagem base](/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base)
pro mesmo problema de namespace do lado do model). Nesses casos, o
controller serializa explícito antes de montar a resposta:

```ruby
VersionLogSerializer.new(@version).as_json
```

## `include: "**"` — por que aparece em toda serialização de lista

```ruby
ActiveModelSerializers::SerializableResource.new(data, include: "**")
```

Sem `include: "**"`, uma associação declarada (`belongs_to`/`has_one`)
não é automaticamente expandida em uma coleção serializada — só num
registro único. `include: "**"` força expansão recursiva em qualquer
profundidade, consistente entre `show` e `index`. O trade-off real:
numa lista grande, isso pode serializar mais dado aninhado do que o
client pediu — aceitável aqui porque a
[paginação](/padrao-api/conceitos-tecnicos/paginacao) já limita o
tamanho da lista em si.

## Leitura de apoio

- [ActiveModelSerializers — documentação oficial](https://github.com/rails-api/active_model_serializers) — a gem usada aqui, incluindo a convenção de resolução automática por nome de classe.
