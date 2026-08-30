---
videoEn: idaXF2Er4TU
sidebar_label: Service e ServiceResult
---

# Service e ServiceResult

Controller nunca decide sucesso ou erro na mão — nenhum `if @registro.save`
espalhado pelos controllers. Toda regra de negócio (criar, listar,
atualizar, excluir) vive num service próprio, que sempre devolve o mesmo
tipo de objeto: `ServiceResult`.

## O contrato

```ruby
scope = APapel::List.new(params: params, ability: current_ability).call
render_paginated_result(scope, success_message: "Papeis listados com sucesso")
```

O controller fica fino de propósito: monta o service com o que ele
precisa (`params`, `ability` do usuário atual), chama `.call`, e passa o
resultado pra um `render_*` que já sabe montar o
[envelope de resposta](/padrao-api/conceitos-tecnicos/envelope-de-resposta)
certo. Nenhuma lógica de negócio — validação, regra de permissão fina,
efeito colateral — fica no controller.

## Por que não devolver o registro direto

Um service que devolve só `@papel` (ou `nil` em caso de erro) obriga o
controller a inferir sucesso/erro por convenção implícita (`registro.nil?`
significa erro? `registro.persisted?`? `registro.errors.any?`?) —
ambíguo, e cada controller pode interpretar diferente. `ServiceResult`
resolve isso sendo explícito: o service decide e declara o resultado, o
controller só reage ao que foi declarado, sem adivinhar.

## Onde entra em cada camada

- **Service** (`app/services/<model>/<acao>.rb`) — recebe o que precisa
  no `initialize`, expõe um `.call` que devolve `ServiceResult`. Um
  service por ação (`List`, `Create`, `Update`, `Destroy`), não uma
  classe genérica de CRUD — cada ação tem exatamente a responsabilidade
  do próprio nome.
- **Controller** — monta o service, chama `.call`, repassa pro
  `render_result`/`render_paginated_result` certo. Curto o bastante pra
  caber numa tela sem scroll.
- **`render_result`** (`app/controllers/concerns/renders_result.rb`) —
  o único lugar que traduz `ServiceResult` pro envelope HTTP — sucesso
  vira `render_success`, erro vira `render_error` com o status
  apropriado.

## Leitura de apoio

- [Service Objects em Rails — padrão geral](https://www.honeybadger.io/blog/refactor-ruby-rails-service-object/) — o problema genérico que esse padrão resolve (lógica de negócio fora do controller e fora do model "gordo").
- [Software Engineering at Google — cap. sobre APIs internas](/padrao-frontend/leitura-recomendada/software-engineering-at-google) — o mesmo princípio de contrato explícito entre camadas, num contexto mais amplo.
