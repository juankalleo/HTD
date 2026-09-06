---
video: 1j85zzhclu8
videoEn: jcOp-R7hV5s
date: "30 de agosto de 2026"
---

# Roteamento e versionamento

## Versionado na URL

Toda rota vive sob `/api/v1/...` — `config/routes.rb`:

```ruby
namespace :api do
  namespace :v1 do
    namespace :auth do
      get :me, to: "me#show"
      patch :me, to: "me#update"
    end
    get "c_configuracoes/atual", to: "c_configuracoes#atual"
    namespace :admin do
      resources :c_configuracoes
      resources :a_papeis
      # ...
      resources :versions, only: %i[index show]
    end
  end
end
```

O número na URL (`v1`) é a estratégia de versionamento inteira — não tem
header de versão nem content negotiation por `Accept`. Simples de propósito:
enquanto só existe uma versão, a URL versionada já é suficiente pra abrir
caminho pra uma `v2` no futuro sem quebrar quem já integra com `v1`, sem
precisar de infraestrutura de negociação que ninguém usa ainda.

## `admin` vs. `auth` — dois perfis de rota bem separados

`namespace :admin` agrupa todo CRUD que exige sessão e autorização
granular (`resources :a_papeis`, `resources :versions`, etc. — um recurso
por linha, RESTful puro, sem rota customizada além do que `resources` já
gera). `namespace :auth` é a exceção: rotas de sessão e perfil próprio
(`GET/PATCH /api/v1/auth/me`), que fazem sentido fora do padrão CRUD
porque não são "um recurso entre muitos", são sobre o usuário autenticado
em si. O login/logout em si (`devise_for :users`) fica montado à parte,
não dentro de `namespace :api` — ver
[Autenticação](/padrao-api/seguranca/autenticacao).

## O catch-all tem que ficar *dentro* do namespace

```ruby
namespace :api do
  namespace :v1 do
    # ...
  end
  match "*unmatched", to: "/errors#not_found", via: :all
end
```

Uma pegadinha comum, fácil de cair sem perceber: um catch-all
(`match "*unmatched", ...`) puxado pra fora de `namespace :api`, na raiz
do arquivo de rotas, quebra a resolução de URL de qualquer rota do
próprio Rails que também viva na raiz (o ActiveStorage é um exemplo
típico) — essas rotas passam a cair no catch-all antes de chegar na rota
delas. A correção é manter o catch-all como o **último** item
dentro do próprio `namespace :api`, escopado só ao que já é `/api/*` —
ele nunca compete com rota de fora da API. `/errors#not_found` devolve o
mesmo envelope de erro de qualquer outro 404 (ver
[Tratamento de erros](/padrao-api/conceitos-tecnicos/tratamento-de-erros)),
então uma URL de API inexistente nunca cai na página de erro HTML padrão
do Rails.

## Leitura de apoio

- [Rails Routing from the Outside In (docs oficiais)](https://guides.rubyonrails.org/routing.html) — `namespace`, `resources`, rota catch-all.
- [REST API versioning: URI vs. header](https://www.freecodecamp.org/news/how-to-version-a-rest-api/) — comparação entre versionar na URL (o que este projeto faz) e por header/content negotiation.
