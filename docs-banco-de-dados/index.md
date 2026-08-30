---
sidebar_label: Visão geral
---

# Padrão Banco de Dados

> **Tecnologia principal: PostgreSQL + ActiveRecord** (Ruby on Rails 8). Camada separada de propósito do [Padrão API](/padrao-api): lá é contrato HTTP, aqui é schema, migration e model. As duas camadas convivem no mesmo projeto, mas merecem cada uma sua própria régua.

## Visão geral

Esta área documenta como modelar schema numa API Rails multi-tenant:
convenção de nome de tabela, como a hierarquia de tenant é representada
no banco, trilha de auditoria, soft delete, e a disciplina de migration
que mantém tudo isso consistente conforme o projeto cresce. PostgreSQL,
ActiveRecord — sem exagero de abstração: regra simples, aplicada sem
exceção.

## Modelagem base

[Modelagem base](/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base)
documenta o que todo model ganha de graça ao herdar de
`ApplicationRecord` — auditoria, soft delete, versionamento, limite de
tamanho de campo — sem precisar declarar nada disso de novo a cada model.

## Nomenclatura e módulos

[Nomenclatura e módulos](/padrao-banco-de-dados/conceitos-tecnicos/nomenclatura-e-modulos)
documenta o prefixo de uma letra por módulo de negócio (`a_`, `g_`, `c_`)
— o que cada um significa e a única exceção deliberada à regra.

## Multi-tenancy

[Multi-tenancy](/padrao-banco-de-dados/conceitos-tecnicos/multi-tenancy)
documenta a hierarquia tenant → órgão → unidade → usuário, o schema por
trás dela, e onde o isolamento entre tenant é de fato aplicado.

## Tabela de referência em vez de enum

[Tabela de referência em vez de enum](/padrao-banco-de-dados/conceitos-tecnicos/tabela-de-referencia-vs-enum)
documenta uma regra deliberada deste projeto: zero `enum` do Rails, zero
string mágica — todo campo que "parece enum" vira tabela própria com FK.

## Migrations

[Migrations](/padrao-banco-de-dados/conceitos-tecnicos/migrations)
documenta o formato de migration seguido neste padrão: idempotente,
`up`/`down` explícitos, e as colunas de auditoria que entram por padrão
em toda tabela nova.

## Tecnologias

[Tecnologias](/padrao-banco-de-dados/tecnologias) cobre PaperTrail
(versionamento) e paranoia (soft delete) — o quê, o porquê, a versão e um
exemplo de uso de cada uma.
