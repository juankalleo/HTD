---
videoEn: Gi8DQOiDq1E
---

# CanCanCan

## O que é

Biblioteca de autorização pra Rails — define o que um usuário **pode**
fazer através de uma classe `Ability`, e expõe `authorize!` (bloqueia se
não puder) e `accessible_by` (filtra uma query só pro que o usuário pode
ver).

## Por que essa

A biblioteca de autorização mais madura do ecossistema Rails, mas o que
realmente importa aqui não é a lib em si — é como este projeto a usa:
`Ability` não hardcoda `can :manage, Model` por model, calcula em
runtime a partir de papel/permissão cadastrados no banco. Ver
[Autorização](/padrao-api/seguranca/autorizacao) pro funcionamento
completo (cálculo de permissão, escopo por tenant, verbo em português).

## Versão

`cancancan (3.6.1)` — `Gemfile.lock`.

## Como importar

```ruby
# Gemfile
gem "cancancan"
```

```ruby
# app/controllers/application_controller.rb
def current_ability
  @current_ability ||= Ability.new(current_user)
end
```

## Exemplo de uso

Uso num controller (`app/controllers/api/v1/admin/a_papeis_controller.rb`):

```ruby
def index
  authorize! :CONSULTAR, APapel
  scope = APapel::List.new(params: params, ability: current_ability).call
  render_paginated_result(scope, success_message: "Papeis listados com sucesso")
end
```

## Onde usar no projeto

`authorize!` em todo controller admin, antes de qualquer leitura/escrita;
`accessible_by(ability)` em todo `*/list.rb` (ver
[Filtros e busca](/padrao-api/conceitos-tecnicos/filtros-e-busca)).
`CanCan::AccessDenied` (quando `authorize!` nega) é capturado pelo
[mapa central de erro](/padrao-api/conceitos-tecnicos/tratamento-de-erros),
vira `403` no envelope padrão — nenhum controller trata essa exceção à
mão.
