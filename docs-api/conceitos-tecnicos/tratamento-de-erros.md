---
videoEn: RQQ98mbh2Ic
sidebar_label: Tratamento de erros
---

# Tratamento de erros

Erro tratado num lugar só, não espalhado em `rescue`/`begin` por
controller. Um `rescue_from` central intercepta a exceção Ruby real que
o Rails já levanta, e converte pro mesmo
[envelope de resposta](/padrao-api/conceitos-tecnicos/envelope-de-resposta)
de qualquer outra resposta.

## O mapa central

`app/controllers/concerns/error_handler.rb`, incluído em todo controller:

```ruby
rescue_from ActiveRecord::RecordNotFound,   with: :render_not_found
rescue_from ActiveRecord::RecordInvalid,    with: :render_record_invalid
rescue_from ActiveRecord::RecordNotUnique,  with: :render_record_not_unique
rescue_from ActiveRecord::InvalidForeignKey, with: :render_foreign_key_error
rescue_from ActionController::ParameterMissing, with: :render_bad_request
rescue_from CanCan::AccessDenied, with: :render_forbidden
unless Rails.env.development? || Rails.env.test?
  rescue_from StandardError, with: :render_internal_error
end
```

Cada `rescue_from` é uma exceção que o Rails/ActiveRecord **já levanta
sozinho** em situação normal — nenhuma delas precisa ser levantada à mão
no controller. `find` sem registro já levanta
`ActiveRecord::RecordNotFound`; `save!` numa validação que falha já
levanta `ActiveRecord::RecordInvalid`; `authorize!` do CanCanCan já
levanta `CanCan::AccessDenied` quando nega. O controller só escreve o
código do caminho feliz; o mapa central decide o que acontece quando algo
sai do previsto.

`StandardError` só é capturado fora de dev/test — em desenvolvimento, um
erro não mapeado explode normal (stacktrace completo), porque esconder
isso atrapalharia debugar; em produção, vira um 500 genérico no mesmo
envelope, sem vazar detalhe interno pro cliente.

## Payload real por status

| Status | Quando | Payload |
|---|---|---|
| `404` | `RecordNotFound`, ou rota inexistente (catch-all) | `{"status":"error","message":"Registro não encontrado","errors":null}` |
| `422` | `RecordInvalid` | `{"status":"error","message":"não pode ficar em branco","errors":{"nome":["não pode ficar em branco"]}}` |
| `400` | `ParameterMissing` | `{"status":"error","message":"...","errors":null}` |
| `403` | `CanCan::AccessDenied` | `{"status":"error","message":"Acesso não permitido"}` |
| `401` | Sessão ausente/inválida (Devise) | Ver [Autenticação](/padrao-api/seguranca/autenticacao) — payload próprio, fora deste mapa |
| `500` | `StandardError` não mapeado, só fora de dev/test | Envelope genérico, sem detalhe interno |

O 422 de validação agrupa mensagem por campo (`errors_por_campo`, dentro
de `error_handler.rb`) — percorre `record.errors` e monta um hash
`{campo: [mensagens]}`, em vez de devolver uma lista solta de string. O
front consegue então destacar o campo exato do formulário que falhou, não
só mostrar um toast genérico.

## Leitura de apoio

- [Rails — `rescue_from` (docs oficiais)](https://api.rubyonrails.org/classes/ActiveSupport/Rescuable/ClassMethods.html#method-i-rescue_from) — como o mapa central funciona por baixo.
- [MDN — HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) — referência dos códigos usados aqui.
