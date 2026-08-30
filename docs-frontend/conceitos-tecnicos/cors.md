---
video: GZV-FUdeVwE
videoEn: PNtFSVU-YTI
sidebar_label: CORS
---

# CORS

Mecanismo de segurança dos navegadores que restringe como recursos de uma
origem externa podem ser solicitados. Por padrão, um navegador bloqueia
uma requisição feita por JavaScript de um site (`origin` A) pra uma API em
outro domínio/porta (`origin` B), a menos que o servidor B responda com
headers explícitos autorizando aquela origem — `Access-Control-Allow-
Origin` e companhia. Isso é o *same-origin policy* na prática: proteção
contra um site malicioso ler dado de outra API usando a sessão de um
usuário no navegador dele.

## No padrão frontend

Usamos, porque o `base-front` chama a API Rails **direto do navegador**
(sem proxy Next.js no meio — ver [BFF](/padrao-frontend/conceitos-tecnicos/bff)).
Sem CORS liberado no backend, o navegador bloqueia a resposta antes do
JavaScript conseguir lê-la — não tem como esse padrão funcionar sem isso.

Configuração real, `api/config/initializers/cors.rb`:

```ruby
if Rails.env.development?
  Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins(/\Ahttp:\/\/localhost:\d+\z/, /\Ahttp:\/\/127\.0\.0\.1:\d+\z/)

      resource "*",
        headers: :any,
        methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
        expose: [ "Authorization" ]
    end
  end
end
```

Dois pontos que fazem parte do padrão, não são só detalhe de config:

- **`expose: ["Authorization"]` é obrigatório pro login funcionar.** O
  `devise-jwt` devolve o token de sessão no **header** `Authorization` da
  resposta de `sign_in`, não no corpo JSON. Numa resposta cross-origin, o
  `fetch` do navegador só enxerga os headers que o servidor explicitamente
  expõe — sem essa linha, o token chega na rede mas o JavaScript não
  consegue lê-lo pra guardar.
- **Em ambiente de produção, quem clonar este padrão precisa habilitar
  CORS lá também**, com o host real do front na lista de `origins` — a
  configuração acima só cobre `localhost`, de propósito (é o que basta pra
  desenvolvimento). Item de infraestrutura de deploy, não de código do
  front.

Mais contexto de autenticação (token, `GET /auth/me`) em
[Autenticação](/padrao-frontend/seguranca/autenticacao).

## Leitura de apoio

- [rack-cors — Docs](https://github.com/cyu/rack-cors) — gem usada na API Rails.
