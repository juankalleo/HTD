# PaperTrail

## O que é

Gem de versionamento pra ActiveRecord — grava uma linha numa tabela
`versions` a cada `create`/`update`/`destroy` de qualquer model que
inclua `has_paper_trail`, guardando o estado anterior do registro e quem
fez a mudança.

## Por que essa

A gem de versionamento mais madura do ecossistema Rails, incluída direto
em `ApplicationRecord` — todo model do projeto ganha histórico completo
sem precisar declarar nada individualmente. Ver
[Modelagem base](/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base)
pro funcionamento completo, e
[Logs de auditoria](/padrao-frontend/seguranca/logs-de-auditoria) no
Padrão Frontend pra API/tela que expõe esse dado.

## Versão

`paper_trail (17.0.0)` — `Gemfile.lock`.

## Como importar

```ruby
# Gemfile
gem "paper_trail"
```

```bash
bin/rails g paper_trail:install
bin/rails db:migrate
```

O gerador cria a migration da tabela `versions` — sem rodar isso
primeiro, `has_paper_trail` falha em runtime (não no boot) com
`relation "versions" does not exist`, no primeiro `create`/`update` que
tentar gravar uma versão.

## Exemplo real

```ruby
# app/models/application_record.rb
has_paper_trail

before_save :set_paper_trail_whodunnit

def set_paper_trail_whodunnit
  PaperTrail.request.whodunnit = Current.user&.id&.to_s
end
```

Schema real da tabela que a gem gera e usa:

```ruby
create_table "versions", force: :cascade do |t|
  t.string "whodunnit"
  t.datetime "created_at"
  t.bigint "item_id", null: false
  t.string "item_type", null: false
  t.string "event", null: false
  t.text "object"
end
```

## Onde usar no projeto

Toda tabela, via `ApplicationRecord` — sem exceção, sem opt-out por
model. `PaperTrail::Version` herda de `ActiveRecord::Base` direto (a
gem), não de `ApplicationRecord` — evitar dar nome de classe/arquivo
próprio que colida com o namespace `PaperTrail::` é necessário (o
Zeitwerk auto-vivifica o módulo a partir do caminho da pasta antes da
gem carregar a classe real, e a colisão quebra com
`TypeError: Version is not a class`).
