---
sidebar_label: Concerns e composição
date: "30 de agosto de 2026"
---

# Concerns e composição

`ApplicationController` não implementa nada sozinho — é a soma de cinco
concerns, cada um com uma responsabilidade só. Ler o controller base é
ler a lista de `include`, não um corpo de método.

## Os cinco concerns reais

```ruby
class ApplicationController < ActionController::API
  include JsonResponse      # render_success / render_error — ver Envelope de resposta
  include PagyPagination    # paginate() — ver Paginação
  include ErrorHandler      # rescue_from central — ver Tratamento de erros
  include RendersResult     # traduz ServiceResult pro render_* certo
  before_action :authenticate_user!
  include RequestContext    # Current.user / Current.ip_address por requisição
end
```

Cada um resolve exatamente uma preocupação transversal — formato de
resposta, paginação, erro, resultado de service, contexto de
requisição — sem depender dos outros quatro pra funcionar sozinho. Um
teste de `JsonResponse` isolado não precisa simular paginação nem
autenticação pra existir.

## `RequestContext` — o concern que alimenta os outros

```ruby
around_action :com_timezone_e_contexto

def com_timezone_e_contexto
  Current.user = current_user
  Current.ip_address = request.remote_ip
  Time.use_zone("America/Sao_Paulo") { yield }
ensure
  Current.reset
end
```

`Current` (um `ActiveSupport::CurrentAttributes`) é resolvido **uma vez
por requisição**, aqui — e é o que
[Modelagem base](/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base)
usa pra preencher `created_by`/`updated_by`/`ip_address` automaticamente
em qualquer model, e o que popula `whodunnit` do PaperTrail (ver
[PaperTrail](/padrao-banco-de-dados/tecnologias/paper-trail)). Sem esse
concern rodando primeiro, toda a auditoria automática do model quebraria
silenciosamente — `Current.user` sempre viria `nil`.

## Por que concern, e não herança em cadeia

Uma alternativa seria um `AdminController < ApplicationController` que
já embute paginação, e um `AuthController < ApplicationController`
diferente — mas herança única do Ruby obriga escolher uma cadeia só;
concern (módulo, `include`) permite compor qualquer combinação sem
duplicar código nem forçar uma hierarquia artificial. `ErrorsController`
e `HealthController` (ver
[Arquitetura de controllers](/padrao-api/conceitos-tecnicos/arquitetura-de-controllers))
são o caso real que mostra o ganho: eles **não** herdam de
`ApplicationController`, então não ganham nenhum dos cinco concerns —
não precisariam, e com herança em cadeia teriam que herdar tudo junto ou
nada.

## Leitura de apoio

- [Rails — Active Support Concern (docs oficiais)](https://api.rubyonrails.org/classes/ActiveSupport/Concern.html) — o mecanismo por trás de `include` com dependência entre módulos.
- [Rails — Current Attributes (docs oficiais)](https://api.rubyonrails.org/classes/ActiveSupport/CurrentAttributes.html) — `Current`, o padrão usado aqui pra estado por-requisição.
