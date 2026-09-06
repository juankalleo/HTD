---
video: SW_YjocL_Lk
videoEn: wVNQwrALp1A
sidebar_label: Autenticação
date: "30 de agosto de 2026"
---

# Autenticação

Devise (sessão/senha) + devise-jwt (token stateless) — login devolve um
JWT, cada requisição seguinte manda esse token no header
`Authorization`, sem sessão em cookie/servidor.

## Como o model fica pronto pra JWT

`app/models/user.rb`:

```ruby
include Devise::JWT::RevocationStrategies::JTIMatcher
devise :database_authenticatable, :jwt_authenticatable, jwt_revocation_strategy: self
before_validation :ensure_jti, on: :create
```

`JTIMatcher` é a estratégia de revogação: cada usuário tem um `jti`
(JWT ID) próprio, gravado no banco. Um token só é válido se o `jti` que
ele carrega bater com o `jti` atual do usuário — trocar o `jti` (o que
acontece no logout) invalida instantaneamente qualquer token antigo
emitido antes disso, mesmo que o token em si ainda não tenha expirado.

## Configuração do token

`config/initializers/devise.rb`:

```ruby
config.jwt do |jwt|
  jwt.secret = jwt_secret.presence || Rails.application.secret_key_base
  jwt.expiration_time = 24.hours.to_i # valor de exemplo — ver nota abaixo
  jwt.dispatch_requests = [[ "POST", %r{^/api/v1/auth/sign_in$} ]]
  jwt.revocation_requests = [[ "DELETE", %r{^/api/v1/auth/sign_out$} ]]
end
```

`expiration_time` é só um valor de exemplo, não uma regra fixa — cada
projeto ajusta esse prazo conforme o perfil de risco (mais curto pra dado
sensível, mais longo pra reduzir fricção de login). Depois de expirado,
mesmo sem logout explícito, o token deixa de ser aceito. `dispatch_requests` e `revocation_requests` dizem ao
devise-jwt exatamente quais rotas emitem token (`sign_in`) e quais o
revogam (`sign_out`) — fora dessas duas, o middleware do devise-jwt nem
intercepta a resposta.

## Onde o token vai — header, não corpo

O login (`POST /api/v1/auth/sign_in`) devolve o token no header
`Authorization` da resposta, não dentro do JSON — `app/controllers/
api/v1/auth/sessions_controller.rb` sobrescreve `respond_with` só pra
formatar o corpo da resposta no
[envelope padrão](/padrao-api/conceitos-tecnicos/envelope-de-resposta),
o token em si é responsabilidade do devise-jwt, que já cuida do header
automaticamente. Toda requisição autenticada seguinte manda esse valor
de volta: `Authorization: Bearer <token>`.

## `GET/PATCH /api/v1/auth/me` — perfil do próprio usuário

Rota separada do CRUD admin de propósito — não é "um usuário entre
muitos" que precisa de `id` na URL, é sempre o usuário da sessão atual
(`current_user`, resolvido pelo Warden/Devise a partir do token). Front
consulta e edita o próprio perfil sem precisar saber o próprio `id`.

## 401 em português, sem vazar detalhe de qual credencial errou

`app/controllers/api/v1/auth/failure_app.rb` (`< Devise::FailureApp`)
traduz a mensagem padrão do Warden pro mesmo envelope:

```json
{ "status": "error", "message": "Token inválido ou não fornecido." }
```

A mensagem não diz se o token existe mas expirou, se é de outro usuário,
ou se simplesmente não veio — só "inválido ou não fornecido", de
propósito: diferenciar essas causas na mensagem de erro ajudaria um
atacante testando credencial a inferir mais do que deveria sobre o que
está acontecendo do outro lado.

## Como testes autenticam sem passar pelo login de verdade

```ruby
Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
```

`test/test_helper.rb` gera um token válido direto, sem fazer uma
requisição HTTP real de login — mais rápido, e testa o endpoint em si sem
depender de outro endpoint (login) já estar funcionando.

## Leitura de apoio

- [devise-jwt — documentação oficial](https://github.com/waiting-for-dev/devise-jwt) — a gem usada aqui, incluindo as estratégias de revogação disponíveis.
- [Cookies vs localStorage para JWT (OpenReplay)](https://blog.openreplay.com/cookies-vs-localstorage-jwt-auth/) — o trade-off de onde o front guarda esse token depois de recebê-lo (decisão do lado do front, não da API — ver [Autenticação](/padrao-frontend/seguranca/autenticacao) no Padrão Frontend).
- [OWASP — JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) — riscos gerais de JWT (o cheat sheet é focado em Java, mas os princípios de expiração/revogação/segredo forte se aplicam aqui igual).
