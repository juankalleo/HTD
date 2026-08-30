---
video: mlzPJlQeqBM
videoEn: Sas6vxlMxCE
sidebar_label: Força bruta e bloqueio
---

# Força bruta e bloqueio

Rack::Attack, com três defesas diferentes no mesmo endpoint de login —
cada uma cobrindo um padrão de ataque diferente.

## Cache compartilhado, não em memória

```ruby
Rack::Attack.cache.store = Rails.cache
```

Detalhe fácil de errar: o padrão do Rack::Attack, sem configurar isso, é
guardar contador em memória do próprio processo — funciona sozinho, mas
com mais de um worker Puma (o normal em produção), cada worker teria seu
próprio contador, e o limite real seria multiplicado pelo número de
workers sem ninguém perceber. Apontar pro `Rails.cache` (compartilhado
entre workers) é o que faz o threshold configurado valer de verdade.

## Os três throttles

```ruby
throttle("logins/ip", limit: 30, period: 5.minutes) do |req|
  req.ip if req.path == "/api/v1/auth/sign_in" && req.post?
end

throttle("logins/identifier", limit: 8, period: 15.minutes) do |req|
  req.params.dig("user", "email").to_s.downcase.presence if req.path == "/api/v1/auth/sign_in" && req.post?
end

blocklist("block brute force logins") do |req|
  Rack::Attack::Allow2Ban.filter(req.ip, maxretry: 10, findtime: 1.minute, bantime: 1.hour) do
    req.path == "/api/v1/auth/sign_in" && req.post?
  end
end
```

- **Por IP** — 30 tentativas a cada 5 minutos. Cobre um IP único tentando
  senha em várias contas (credential stuffing).
- **Por identificador** (e-mail) — 8 tentativas a cada 15 minutos, **por
  e-mail**, não por IP. Cobre o ataque distribuído — várias origens (IP
  rotativo, rede de bot) tentando a mesma conta.
- **Bloqueio automático** (`Allow2Ban`) — 10 tentativas em 1 minuto bane
  o IP por 1 hora inteira. Mais agressivo que os dois throttles acima:
  não é "espera e tenta de novo", é bloqueio direto pra um padrão de
  ataque rápido e concentrado.

As três rodam em paralelo, no mesmo endpoint — um ataque só precisa
disparar uma delas pra ser barrado, não todas as três.

## Só o login é limitado

Nenhum outro endpoint da API tem rate limit configurado hoje — os três
throttles acima checam explicitamente `req.path == "/api/v1/auth/sign_in"`.
Login é o alvo natural de força bruta (tentar senha até acertar); os
demais endpoints exigem token válido antes de fazer qualquer coisa (ver
[Autenticação](/padrao-api/seguranca/autenticacao)), o que já muda o
perfil de ataque possível.

## Resposta ao ser barrado

Responde no mesmo
[envelope de erro](/padrao-api/conceitos-tecnicos/envelope-de-resposta)
de qualquer outro erro, não a página padrão do Rack::Attack:

```json
{ "status": "error", "message": "Muitas tentativas de login. Aguarde alguns minutos e tente novamente." }
```

`429` pros dois throttles; `403` com mensagem própria
("Acesso temporariamente bloqueado por excesso de tentativas.") pro
bloqueio automático.

## Leitura de apoio

- [Rack::Attack — documentação oficial](https://github.com/rack/rack-attack) — `throttle`, `blocklist`, `Allow2Ban`.
- [OWASP — Credential Stuffing Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html) — o ataque que o throttle por IP existe pra mitigar.
