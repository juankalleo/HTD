---
video: xxdZyc-s9jU
videoEn: rtg-5EXwpbg
sidebar_label: Filtros e busca
---

# Filtros e busca

Toda listagem admin aceita filtro por query string — `?q[nome_cont]=admin`
filtra por nome contendo "admin", sem precisar de um endpoint de busca
separado nem de parâmetro customizado por recurso.

## Ransack, dentro do service — não no controller

```ruby
class APapel
  class List
    def initialize(params:, ability:) = (@params, @ability = params, ability)

    def call
      APapel.accessible_by(@ability).ransack(@params[:q]).result
    end
  end
end
```

`accessible_by(@ability)` (CanCanCan — ver
[Autorização](/padrao-api/seguranca/autorizacao)) aplica o escopo de
permissão **antes** do Ransack rodar — o filtro de busca nunca enxerga
registro que o usuário não tem permissão de ver. O mesmo padrão de duas
linhas se repete em cada `*/list.rb` do projeto: escopo de autorização
primeiro, filtro de busca depois, sempre nessa ordem.

## Bloqueio de atributo sensível — obrigatório, não opcional

Ransack permite filtrar por qualquer coluna, por padrão — inclusive
coluna que nunca deveria ser exposta a filtro externo. A defesa fica no
model base, `app/models/application_record.rb`:

```ruby
SENSITIVE_RANSACK_ATTRIBUTES = %w[encrypted_password reset_password_token jti ip_address created_by updated_by deleted_by].freeze

def self.ransackable_attributes(auth_object = nil)
  (column_names - SENSITIVE_RANSACK_ATTRIBUTES) + _ransackers.keys
end

def self.ransackable_associations(auth_object = nil)
  reflect_on_all_associations.map { |a| a.name.to_s }
end
```

Sem esse bloqueio, uma URL como `?q[encrypted_password_cont]=...` poderia
existir e, dependendo da resposta (mesmo sem devolver a senha em si),
ainda vazar informação por *timing* ou por comportamento diferente
conforme o filtro bate ou não. `ransackable_attributes` sobrescrito no
model base — não por model individual — significa que essa lista de
bloqueio protege **todo** model do projeto automaticamente, sem precisar
lembrar de repetir em cada um novo.

## Busca sem acento

```ruby
def self.ransacker_unaccent(attribute)
  ransacker :"#{attribute}_unaccent", type: :string do
    Arel.sql("unaccent(#{table_name}.#{attribute})")
  end
end
```

Um model que declarar `ransacker_unaccent(:nome)` ganha um filtro
`nome_unaccent_cont` que ignora acentuação — busca por "joao" encontra
"João". Sem isso, Ransack compara string byte a byte: uma busca por
"joao" não encontraria "João" nenhuma vez.

## Leitura de apoio

- [Ransack — documentação oficial](https://github.com/activerecord-hackery/ransack) — sintaxe completa de predicado (`_cont`, `_eq`, `_gteq`, etc.).
- [OWASP — Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html) — o mesmo princípio de allowlist explícita (aqui aplicado a filtro, não a escrita) aparece nesse cheat sheet pra parâmetro de criação/edição.
