---
sidebar_label: Arquitetura de controllers
---

# Arquitetura de controllers

Controller extremamente fino, de propósito — nenhuma regra de negócio
mora ali. O trabalho dele é: autorizar, chamar um service, responder no
envelope certo. Três linhas, na prática.

## A base — tudo composto via concern

```ruby
class ApplicationController < ActionController::API
  include JsonResponse
  include PagyPagination
  include ErrorHandler
  include RendersResult
  before_action :authenticate_user!
  include RequestContext

  private

  def current_ability
    @current_ability ||= Ability.new(current_user)
  end
end
```

Cada concern tem uma responsabilidade só (ver
[Concerns e composição](/padrao-api/conceitos-tecnicos/concerns-e-composicao)):
formato de resposta, paginação, tratamento de erro, contexto da
requisição. `ApplicationController` não implementa nada sozinho, só
compõe.

## O molde de um controller CRUD real

```ruby
# app/controllers/api/v1/admin/a_papeis_controller.rb
def index
  authorize! :CONSULTAR, APapel
  scope = APapel::List.new(params: params, ability: current_ability).call
  render_paginated_result(scope, success_message: "Papeis listados com sucesso")
end
```

Autoriza primeiro (levanta `CanCan::AccessDenied` se negar — ver
[Autorização](/padrao-api/seguranca/autorizacao)), monta e chama o
service com o que ele precisa, repassa o resultado pro `render_*` certo
(ver [Service e ServiceResult](/padrao-api/conceitos-tecnicos/service-result)).
Nenhuma query, nenhuma validação, nenhum `if` de regra de negócio dentro
do controller — isso tudo vive no service.

## Duas exceções deliberadas — controllers que não herdam de `ApplicationController`

```ruby
class ErrorsController < ActionController::API
class HealthController < ActionController::API
```

`ErrorsController` (o catch-all de rota não encontrada — ver
[Roteamento e versionamento](/padrao-api/roteamento-e-versionamento)) e
`HealthController` (healthcheck) herdam de `ActionController::API`
**direto**, não de `ApplicationController` — de propósito: os dois
precisam funcionar mesmo sem autenticação (`ApplicationController` exige
`authenticate_user!` globalmente) e sem depender de nenhum estado que só
existiria numa requisição autenticada.

## O gerador é a régua — não escrever à mão

```bash
bin/rails g api_scaffold nome campo:tipo
```

Pra um CRUD simples, o controller (junto com migration, model, 4
services, serializer, rota) nasce do generator, não é escrito à mão —
regra explícita do projeto (`CLAUDE.md` regra 1). O molde acima é
exatamente o que o generator produz; escrever isso manualmente só cria
chance de esquecer um passo (autorização, formato de resposta) que o
generator já garante.

## Leitura de apoio

- [Rails — Action Controller Overview (docs oficiais)](https://guides.rubyonrails.org/action_controller_overview.html) — o mecanismo geral de controller, filtro e callback por trás disso.
- [Software Engineering at Google — cap. sobre APIs internas](/padrao-frontend/leitura-recomendada/software-engineering-at-google) — o princípio geral de manter camada de interface fina e delegar regra pra uma camada própria, aplicado aqui a controller vs. service.
