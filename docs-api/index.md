---
video: 8BuvfgIEz20
videoEn: 6KqbPJtA5O8
sidebar_label: Visão geral
---

# Padrão API

> **Tecnologia principal: Ruby on Rails 8** (`ActionController::API`). Baseado numa API Rails real, multi-tenant, em produção — não um exemplo genérico. Cada página aqui cita arquivo e linha real.

## Visão geral

Esta área documenta o padrão de API usado como referência para os
sistemas do How to Dev: como uma requisição é roteada, tratada,
autenticada, autorizada e respondida — o ciclo completo, do jeito que uma
API Rails real e madura faz isso. O escopo é deliberadamente a **camada
de API**: contrato HTTP, controllers, serialização, autenticação,
autorização, erros. Modelagem de dado (schema, migration, associação
ActiveRecord) fica **fora** daqui de propósito — é assunto de um Padrão
Banco de Dados próprio, ainda não escrito, pra não misturar duas camadas
que merecem cada uma sua própria régua.

## Stack

Rails (`ActionController::API`, sem view), Devise + devise-jwt
(autenticação), CanCanCan (autorização, orientada a dado — não
`can :manage, X` hardcoded por model), ActiveModelSerializers
(serialização), Pagy (paginação), Ransack (filtro/busca), Rack::Attack
(rate limiting), Rack::Cors (CORS). Testes em Minitest, não RSpec.

## Envelope de resposta

Toda resposta — sucesso ou erro, inclusive `destroy` — sai no mesmo
formato:

```json
{ "status": "success", "message": "Papeis listados com sucesso", "data": { "...": "..." } }
```

```json
{ "status": "error", "message": "Registro não encontrado", "errors": null }
```

Detalhe completo, com o código que gera isso, em
[Envelope de resposta](/padrao-api/conceitos-tecnicos/envelope-de-resposta).

## Roteamento e versionamento

[Roteamento e versionamento](/padrao-api/roteamento-e-versionamento)
documenta como toda rota vive sob `/api/v1/...`, a separação
`admin`/`auth`, e um bug real de catch-all já corrigido — não teórico.

## Tratamento de erros

[Tratamento de erros](/padrao-api/conceitos-tecnicos/tratamento-de-erros)
documenta o mapa `rescue_from` central e o payload exato de cada código
de status (404, 422, 401, 403, 500).

## Paginação

[Paginação](/padrao-api/conceitos-tecnicos/paginacao) documenta o Pagy
real usado, o teto de itens por página, e o formato de metadado que volta
pro front.

## Filtros e busca

[Filtros e busca](/padrao-api/conceitos-tecnicos/filtros-e-busca)
documenta o padrão Ransack usado em toda listagem admin, e a lista de
atributo sensível que nunca pode ser filtrável.

## Padrão de service

[Service e ServiceResult](/padrao-api/conceitos-tecnicos/service-result)
documenta por que o controller nunca decide sucesso/erro na mão — todo
service devolve um `ServiceResult` só, controller só chama `render_result`.

## Segurança

[Segurança](/padrao-api/seguranca) cobre autenticação (JWT via
devise-jwt), autorização (CanCanCan orientado a dado), força bruta e
bloqueio (Rack::Attack, thresholds reais) e CORS — mesma régua de
documentação completa do Padrão Frontend: o que protege, com detalhe
real, não resumo.
