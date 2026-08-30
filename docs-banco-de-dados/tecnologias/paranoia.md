# paranoia

## O que é

Gem de soft delete pra ActiveRecord — `destroy` marca uma coluna
`deleted_at` em vez de remover a linha; consulta normal
(`Model.all`/`.find`) já ignora registro marcado, sem precisar de
`WHERE` manual em cada query.

## Por que essa

Simples e direta pro caso deste projeto — soft delete em toda tabela,
sem exceção, sem precisar de uma coluna de status própria pra "ativo".
Ver [Modelagem base](/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base)
pro efeito prático (por exemplo, num `User`, onde soft delete já produz
o mesmo resultado de uma conta bloqueada).

## Versão

`paranoia (3.1.0)` — `Gemfile.lock`.

## Como importar

```ruby
# Gemfile
gem "paranoia"
```

```ruby
# app/models/application_record.rb
acts_as_paranoid
```

A migration de cada tabela precisa da coluna `deleted_at` (ver
[Migrations](/padrao-banco-de-dados/conceitos-tecnicos/migrations) —
já entra por padrão no template de `create_table` do projeto).

## Exemplo real

```ruby
create_table :a_orgaos do |t|
  # ...
  t.datetime :deleted_at
end
```

```ruby
orgao.destroy        # soft delete — marca deleted_at, não remove a linha
AOrgao.find(orgao.id) # ActiveRecord::RecordNotFound — já filtrado por padrão

AOrgao.only_deleted           # só os soft-deletados
AOrgao.with_deleted.find(id)  # inclui soft-deletado na busca
orgao.really_destroy!         # remoção física de verdade — raro, deliberado
```

## Onde usar no projeto

Toda tabela, via `ApplicationRecord` — combinado com
[PaperTrail](/padrao-banco-de-dados/tecnologias/paper-trail), um
`destroy` fica totalmente reversível: a linha continua no banco
(soft-deletada) e o histórico completo de quem/quando fica gravado.
