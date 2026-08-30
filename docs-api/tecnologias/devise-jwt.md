---
videoEn: 0ounptRMU9o
---

# Devise + devise-jwt

## O que é

Devise é o framework de autenticação padrão do ecossistema Rails
(login, senha, recuperação). devise-jwt é uma extensão que troca a
sessão baseada em cookie do Devise por um token JWT stateless — cada
requisição se autentica pelo token, sem o servidor guardar estado de
sessão.

## Por que essa

Padrão do ecossistema, não uma escolha exótica — a combinação
Devise + devise-jwt é a forma mais madura e testada de ter autenticação
por token numa API Rails, com estratégia de revogação (`JTIMatcher`) já
pronta em vez de precisar reinventar isso. Ver
[Autenticação](/padrao-api/seguranca/autenticacao) pro funcionamento
completo (emissão, expiração, revogação, formato do 401).

## Versão

`devise (5.0.4)`, `devise-jwt (0.13.0)` — `Gemfile.lock`.

## Como importar

```ruby
# Gemfile
gem "devise"
gem "devise-jwt"
```

```ruby
# app/models/user.rb
include Devise::JWT::RevocationStrategies::JTIMatcher
devise :database_authenticatable, :jwt_authenticatable, jwt_revocation_strategy: self
```

## Exemplo de uso

`config/initializers/devise.rb`:

```ruby
config.jwt do |jwt|
  jwt.secret = jwt_secret.presence || Rails.application.secret_key_base
  jwt.expiration_time = 24.hours.to_i
  jwt.dispatch_requests = [[ "POST", %r{^/api/v1/auth/sign_in$} ]]
  jwt.revocation_requests = [[ "DELETE", %r{^/api/v1/auth/sign_out$} ]]
end
```

## Onde usar no projeto

`devise_for :users` monta as rotas de sessão (`config/routes.rb`); todo
controller herda de `ApplicationController`, que já exige
`authenticate_user!` — nenhum controller precisa declarar isso
individualmente, só a rota pública explícita (`c_configuracoes#atual`)
usa `skip_before_action :authenticate_user!`.
