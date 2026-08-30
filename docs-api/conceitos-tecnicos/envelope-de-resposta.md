---
videoEn: _gQaygjm_hg
sidebar_label: Envelope de resposta
---

# Envelope de resposta

Toda resposta JSON da API sai no mesmo formato — sucesso ou erro,
`index` ou `destroy`, sem exceção. Um cliente (o front, um teste, um
script) nunca precisa adivinhar a forma da resposta pelo endpoint: sempre
os mesmos três campos possíveis, `status`, `message`, `data` (sucesso) ou
`errors` (erro).

## Como fica na prática

```json
{ "status": "success", "message": "Papeis listados com sucesso", "data": { "id": 1, "nome": "Administrador" } }
```

```json
{ "status": "error", "message": "não pode ficar em branco", "errors": { "nome": ["não pode ficar em branco"] } }
```

## O código por trás

`app/controllers/concerns/json_response.rb`:

```ruby
def render_success(data: nil, message:, status: :ok)
  render json: { status: "success", message: message, data: serialize_for_response(data) }, status: status
end

def render_error(message:, errors: nil, status: :unprocessable_entity, code: nil, details: nil)
  payload = { status: "error", message: message, errors: normalize_errors(errors) }
  payload[:code] = code if code.present?
  payload[:details] = details if details.present?
  render json: payload, status: status
end
```

Todo controller admin chama um desses dois — nunca `render json:` cru. É
o que garante o formato consistente sem precisar lembrar disso a cada
endpoint novo.

## Por que `destroy` também devolve 200 com envelope, não 204

O scaffold padrão do Rails gera `destroy` respondendo `204 No Content` —
sem corpo. Esse padrão foi conscientemente descartado aqui: `destroy`
passa pelo mesmo `render_success`, `200` com `{status, message, data}`
como qualquer outro endpoint. A régua é "todo endpoint desta API responde
no mesmo envelope, sem exceção por verbo HTTP" — um cliente que sempre
espera `{status, message, data}` nunca precisa de um `if` especial só
pra `DELETE`. O teste real reforça isso, não um scaffold esquecido:

```ruby
test "should destroy a_papel" do
  assert_difference("APapel.count", -1) do
    delete api_v1_admin_a_papel_url(@a_papel), headers: @headers, as: :json
  end
  assert_response :success
end
```

`assert_response :success` (200), não `:no_content` (204) — é a
convenção do projeto, verificada, não a herdada por padrão do Rails.

## Cuidado real: serializar um registro dentro de um hash

```ruby
def serialize_for_response(data)
  return data unless data.is_a?(ActiveRecord::Base) || data.is_a?(ActiveRecord::Relation) || (data.is_a?(Array) && data.first.is_a?(ActiveRecord::Base))
  ActiveModelSerializers::SerializableResource.new(data, include: "**")
end
```

Achado real: se um controller monta a resposta como
`render_success(data: { papel: @papel, extra: "..." })`, o `@papel`
dentro desse hash **não** passa pelo serializer automaticamente — o
`data:` do `render_success` só reconhece um registro (ou relation, ou
array de registro) no nível mais externo, não aninhado dentro de outro
hash. `serialize_for_response` existe justamente pra cobrir o caso comum
(`data: @papel` ou `data: @papeis`) sem precisar chamar o serializer à
mão em cada controller — mas o caso aninhado ainda exige serializar
manualmente antes de montar o hash.

## Leitura de apoio

- [JSON:API — a specification for building APIs in JSON](https://jsonapi.org/) — outra convenção de envelope popular, pra comparação (este projeto não segue JSON:API à risca, mas resolve o mesmo problema: formato previsível de resposta).
