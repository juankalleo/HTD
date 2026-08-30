---
video: BaStnSwAWdU
videoEn: SQhj5gBNTB0
sidebar_label: Paginação
---

# Paginação

Toda listagem admin volta paginada no servidor — o client nunca recebe a
tabela inteira de uma vez, só a página pedida mais o metadado pra montar
os controles de página no front (ver o lado do front em
[Tabelas](/padrao-frontend/tabelas)).

## Pagy, com teto explícito

`app/controllers/concerns/pagy_pagination.rb`:

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

Padrão de 25 itens por página se o client não pedir nada; teto rígido de
100 (`.clamp(1, MAX_PER_PAGE)`), mesmo que o client peça `per_page=99999`
— sem o teto, um client (malicioso ou só descuidado) poderia forçar a
API a montar e serializar a tabela inteira numa resposta só.

## Como fica o JSON

```json
{
  "status": "success",
  "message": "Papeis listados com sucesso",
  "data": {
    "pagy": { "current_page": 1, "total_pages": 3, "total_count": 57, "per_page": 25 },
    "items": [{ "id": 1, "nome": "Administrador" }]
  }
}
```

`pagy` traz só o que o front precisa pra montar paginação (página atual,
total de páginas, total de registros, tamanho de página) — não o objeto
`Pagy` inteiro do Ruby, que carrega mais estado do que uma resposta HTTP
deveria expor.

## Uso real num controller

```ruby
def index
  authorize! :CONSULTAR, APapel
  scope = APapel::List.new(params: params, ability: current_ability).call
  render_paginated_result(scope, success_message: "Papeis listados com sucesso")
end
```

`render_paginated_result` (em `renders_result.rb`) já embrulha o retorno
de `paginate` no envelope de sucesso padrão — o controller não monta o
JSON à mão, só passa a query já filtrada (`scope`, montada pelo service —
ver [Filtros e busca](/padrao-api/conceitos-tecnicos/filtros-e-busca)) e
uma mensagem.

## Leitura de apoio

- [Pagy — documentação oficial](https://ddnexus.github.io/pagy/) — a gem usada aqui.
- [Offset vs. cursor pagination](https://use-the-index-luke.com/no-offset) — por que paginação por offset (o que Pagy faz) tem um custo real em tabela muito grande, e quando cursor-based pagination vale a pena considerar.
