---
video: nMFffjHIlRg
videoEn: R-4_DbV1Su4
sidebar_label: Visão geral
date: "30 de agosto de 2026"
---

# Segurança

Mesma régua do [Padrão Frontend](/padrao-frontend/seguranca): documentação
completa, com o detalhe de configuração de cada camada — não um resumo
que esconde o que ainda não está coberto. A postura certa não é
documentar menos, é garantir que o que está exposto seja exatamente o
que deveria estar.

## Autenticação

[Autenticação](/padrao-api/seguranca/autenticacao) documenta Devise +
devise-jwt: como o token é emitido, onde ele vive, como é revogado no
logout, e o payload exato de um 401.

## Autorização

[Autorização](/padrao-api/seguranca/autorizacao) documenta CanCanCan
orientado a dado — nenhum `can :manage, X` hardcoded por model,
permissão vem de papel/permissão cadastrados, escopados por tenant.

## Força bruta e bloqueio

[Força bruta e bloqueio](/padrao-api/seguranca/forca-bruta-e-bloqueio)
documenta como calibrar os thresholds do Rack::Attack no endpoint de
login — por IP, por e-mail, e o bloqueio automático de força bruta.

## CORS

[CORS](/padrao-api/seguranca/cors) documenta a configuração —
liberada só em desenvolvimento, e por que produção não tem (nem precisa
de) bloco próprio.
