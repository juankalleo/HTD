---
sidebar_label: Migrations
date: "30 de agosto de 2026"
---

# Migrations

Toda migration deste projeto segue o mesmo formato — idempotente,
`up`/`down` explícitos (nunca `change`), com um conjunto fixo de coluna
extra que entra em toda tabela nova sem precisar lembrar disso a cada
vez.

## O formato real

```ruby
class CreateAOrgaos < ActiveRecord::Migration[8.0]
  def up
    unless table_exists?(:a_orgaos)
      create_table :a_orgaos do |t|
        t.string :nome
        t.references :a_tenant, null: false, foreign_key: true
        t.string   :created_by
        t.string   :updated_by
        t.string   :ip_address
        t.datetime :deleted_at
        t.timestamps
      end
    end
  end

  def down
    drop_table :a_orgaos if table_exists?(:a_orgaos)
  end
end
```

## Idempotente — `unless table_exists?`/`unless column_exists?`

Toda migration checa antes de agir — `create_table` só roda se a tabela
ainda não existir, `add_reference` só roda se a coluna ainda não
existir. Isso protege contra rodar uma migration duas vezes por engano
(ambiente dessincronizado, merge de branch com migration equivalente já
aplicada) sem quebrar com erro de "já existe".

## `up`/`down` explícitos, não `change`

O atalho `change` do Rails (que infere o `down` automaticamente a partir
do `up`) não é usado — todo `down` é escrito à mão. Migration com lógica
condicional (`unless table_exists?`) muitas vezes não é reversível
automaticamente de forma confiável pelo Rails; escrever `up`/`down`
manual garante que reverter a migration faz exatamente o oposto do que
foi pretendido, não uma inferência que pode estar errada.

## As colunas que entram por padrão, sem redeclarar

`created_by`, `updated_by`, `ip_address`, `deleted_at` — vêm de
[Modelagem base](/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base)
(`Auditable` + `acts_as_paranoid`), e o template de migration já inclui
as quatro em toda `create_table` nova. Regra explícita do projeto: uma
migration não redeclara essas colunas com nome diferente (nada de
notação húngara ou alias) — o nome da coluna é sempre o nome do
atributo, sem tradução no meio do caminho.

## `schema.rb` nunca é editado à mão

`db/schema.rb` é gerado, não escrito — toda mudança de estrutura passa
por uma migration nova (`bin/rails g migration ...`, `bin/rails
db:migrate`), nunca por uma edição direta no `schema.rb`. Duas razões
práticas, não só estilo: (1) `schema.rb` é a *foto atual* do banco, não
o *histórico* de como ele chegou lá — editar a foto sem passar pela
migration deixa o histórico de mudanças mentindo sobre o que realmente
aconteceu; (2) um ambiente que já rodou uma versão antiga do banco
(produção, o ambiente de outro dev) só chega no estado novo rodando a
migration de verdade — editar só o `schema.rb` local não propaga a
mudança pra lugar nenhum além da própria máquina de quem editou.

## Índice nomeado quando o padrão colidiria

```ruby
add_index :a_permissoes, %i[a_recurso_id a_acao_id], unique: true, name: "index_a_permissoes_on_recurso_and_acao"
```

Índice único composto, com nome explícito — o nome gerado automaticamente
pelo Rails pra um índice composto pode ficar longo demais pro limite do
Postgres (63 caracteres) dependendo do nome das colunas; nomear
explicitamente evita descobrir isso só quando a migration falha.

## `null: false` é a regra, não a exceção, pra FK obrigatória

```ruby
t.references :a_tenant, null: false, foreign_key: true
```

Toda referência (`t.references`/`add_reference`) que é obrigatória por
regra de negócio leva `null: false` **e** `foreign_key: true` juntos — a
constraint de integridade referencial fica no banco, não só numa
`validates :presence` do lado do Rails (que um `INSERT` direto no banco,
fora do ActiveRecord, ignoraria completamente).

## Leitura de apoio

- [Rails — Active Record Migrations (docs oficiais)](https://guides.rubyonrails.org/active_record_migrations.html) — `up`/`down` vs. `change`, e quando cada um é reversível automaticamente.
- [PostgreSQL — identifier length limit](https://www.postgresql.org/docs/current/limits.html) — o limite real de 63 bytes pra nome de índice/coluna que motiva nomear índice composto explicitamente.
