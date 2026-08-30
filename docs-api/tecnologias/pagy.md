---
video: YSJASENALrE
videoEn: 4nrmf5KfD8Y
---

# Pagy

## O que é

Biblioteca de paginação pra Rails — leve (sem dependência de outra gem,
diferente de Kaminari/will_paginate), calcula página atual, total de
páginas e total de registros a partir de uma query ActiveRecord comum.

## Por que essa

Escolhida pela leveza e por já ser a paginação usada em outros projetos
irmãos do mesmo template de backend — reaproveitar a mesma lib entre
projetos evita reaprender uma API de paginação diferente a cada vez. Ver
[Paginação](/padrao-api/conceitos-tecnicos/paginacao) pro funcionamento
completo (teto de itens, formato do metadado, uso real num controller).

## Versão

`pagy (5.10.1)`, travada explicitamente:

```ruby
# Gemfile
gem "pagy", "~> 5.10" # travado na major usada em locacao/api — Pagy 6+/40+ mudou a API (Pagy::Backend não existe mais do mesmo jeito)
```

Trocar de major sem revisar a migração da gem quebraria o
`include Pagy::Backend` (ver abaixo) silenciosamente.

## Como importar

```ruby
# Gemfile
gem "pagy", "~> 5.10"
```

```ruby
# app/controllers/concerns/pagy_pagination.rb
include Pagy::Backend
```

## Exemplo real

```ruby
MAX_PER_PAGE = 100

def paginate(query, per_page, serializer: nil, serializer_options: {})
  items = per_page.blank? ? 25 : per_page.to_i.clamp(1, MAX_PER_PAGE)
  pagy, records = pagy(query, items: items)
  {
    pagy: { current_page: pagy.page, total_pages: pagy.pages, total_count: pagy.count, per_page: pagy.items },
    items: serializer ? ActiveModelSerializers::SerializableResource.new(records, each_serializer: serializer, include: "**", **serializer_options) : records
  }
end
```

## Onde usar no projeto

`app/controllers/concerns/pagy_pagination.rb`, incluído em
`ApplicationController` — todo `index` de recurso admin passa por
`render_paginated_result`, que chama esse `paginate` por baixo.
