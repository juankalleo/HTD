---
video: GZV-FUdeVwE
videoEn: PNtFSVU-YTI
sidebar_label: CORS
---

# CORS

Config real, `config/initializers/cors.rb` — liberada só em
desenvolvimento, de propósito.

```ruby
if Rails.env.development?
  Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins(/\Ahttp:\/\/localhost:\d+\z/, /\Ahttp:\/\/127\.0\.0\.1:\d+\z/)
      resource "*", headers: :any, methods: [ :get, :post, :put, :patch, :delete, :options, :head ], expose: [ "Authorization" ]
    end
  end
end
```

## `expose: ["Authorization"]` é o detalhe que mais importa aqui

Por padrão, o navegador **esconde** a maioria dos response headers de
JavaScript, mesmo numa resposta CORS liberada — só uma lista curta de
header "seguro" fica visível por padrão. `Authorization` não está nessa
lista. Sem `expose: ["Authorization"]` explícito, o front conseguiria
fazer a requisição de login normalmente (CORS liberado pro método/origem),
receberia `200`, mas o JavaScript não conseguiria **ler** o header
`Authorization` da resposta — exatamente onde o JWT vai (ver
[Autenticação](/padrao-api/seguranca/autenticacao)). O login pareceria
funcionar e o token nunca chegaria no front.

## Por que não existe bloco de produção

Este projeto não tem — nem precisa de — um proxy Next.js entre o
navegador e a API (ver
[BFF](/padrao-frontend/conceitos-tecnicos/bff)): o front chama a API
Rails **direto** do navegador. Isso significa que, em produção, a
origem real do front (o domínio onde o Next.js está hospedado) precisa
estar na lista de `origins` liberada — diferente do bloco atual, que só
cobre `localhost`/`127.0.0.1` de desenvolvimento. Configurar isso é uma
decisão de deploy (qual é o domínio real de produção), não algo que
pertence ao código genérico deste padrão — cada projeto que nasce daqui
adiciona seu próprio domínio de produção nesse arquivo quando o deploy
for definido.

## Leitura de apoio

- [MDN — Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) — o mecanismo completo, incluindo a lista padrão de headers "seguros" que não precisam de `expose` explícito.
- [rack-cors — documentação oficial](https://github.com/cyu/rack-cors) — a gem usada aqui.
