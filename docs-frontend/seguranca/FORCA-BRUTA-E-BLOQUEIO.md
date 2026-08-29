---
sidebar_label: Força bruta e bloqueio
---

# Força bruta e bloqueio

Um conjunto de defesas relacionadas do
[OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html):
mensagem de erro genérica no login (nunca revelar se o e-mail existe),
limite de tentativas por conta (não só por IP, pra não deixar o atacante
escapar distribuindo entre vários IPs), e MFA como defesa mais forte
contra as duas coisas.

## No padrão frontend

**Mensagem de erro: já genérica, sem enumeração.** A API devolve a mesma
mensagem — `"Email ou senha inválidos."`, status 401 — tanto pra senha
errada quanto pra e-mail que não existe (`FailureApp#mensagem`,
`api/app/controllers/api/v1/auth/failure_app.rb`, casos `:invalid` e
`:not_found_in_database` mapeados pro mesmo texto). O front só repassa a
mensagem que a API manda (`Toast.error({ description: resultado.message
})`), então não introduz enumeração por conta própria. Sem teste
automatizado garantindo isso hoje (`api/test` não tem um teste de
`sessions_controller`) — funciona porque o código está certo, não porque
está coberto.

**Limite de tentativas: real, por três camadas, via rack-attack.** Config
real, `api/config/initializers/rack_attack.rb`:

```ruby
throttle("logins/ip", limit: 30, period: 5.minutes) do |req|
  req.ip if req.path == "/api/v1/auth/sign_in" && req.post?
end

throttle("logins/identifier", limit: 8, period: 15.minutes) do |req|
  if req.path == "/api/v1/auth/sign_in" && req.post?
    req.params.dig("user", "email").to_s.downcase.presence
  end
end

blocklist("block brute force logins") do |req|
  Rack::Attack::Allow2Ban.filter(req.ip, maxretry: 10, findtime: 1.minute, bantime: 1.hour) do
    req.path == "/api/v1/auth/sign_in" && req.post?
  end
end
```

Três controles sobrepostos: 30 tentativas/5min por IP, 8 tentativas/15min
por **e-mail** (a parte que o OWASP mais cobra — limitar só por IP deixa
o atacante escapar trocando de IP; aqui a chave é a conta, não o IP),
e um banimento de 1h se um IP bater 10 requisições em 1 minuto. As duas
primeiras devolvem 429 com mensagem clara; o banimento devolve 403.

Devise `:lockable` (o mecanismo nativo de bloqueio de conta do Devise)
**não** está incluído em `User` — decisão arquitetural, não descuido: o
rack-attack acima já cobre o mesmo problema numa camada diferente
(middleware, antes de chegar no controller), e é o controle real e ativo
hoje.

**MFA: não existe** — confirmado, zero TOTP/2FA em qualquer lugar do
projeto. É o item mais forte do checklist do OWASP contra os dois
problemas desta página (~99,9% dos comprometimentos de senha, segundo a
Microsoft, citada pelo próprio cheat sheet) e ainda não foi implementado.

**Log de tentativa falha: não existe — achado real.** `Rails.logger` só é
chamado em `api/app/controllers/concerns/error_handler.rb`, e só pros
erros internos (chave estrangeira, conexão de banco, parse, erro
genérico) — nunca pra falha de login, bloqueio de rack-attack, ou negação
de autorização (ver
[IDOR e autorização](/padrao-frontend/seguranca/idor-e-autorizacao)).
`FailureApp` monta a resposta JSON de erro de auth sem nenhuma chamada de
log. Hoje não existe rastro server-side de "quem tentou entrar e falhou,
quantas vezes, quando" além do que o rack-attack já barra silenciosamente
— o padrão bloqueia o ataque, mas não deixa registro pra revisão
posterior.
