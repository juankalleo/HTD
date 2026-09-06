---
sidebar_label: Autorização automatizada
date: "29 de agosto de 2026"
---

# Autorização automatizada

O [OWASP Authorization Testing Automation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html)
propõe um formato específico pra testar RBAC sem que o teste vire um
peso morto a cada mudança de permissão: formalizar uma **matriz de
autorização** (papel × recurso × ação → permitido/negado) num arquivo
estruturado, gerar os testes a partir dela, um teste por papel, rodando
em todo release — pra pegar regressão de permissão automaticamente, sem
alguém ter que lembrar de testar manualmente toda combinação depois de
mexer no RBAC.

## No padrão frontend

**Não se aplica ao front diretamente — é um padrão de teste do backend
(a autoridade real de autorização é a API, ver
[IDOR e autorização](/padrao-frontend/seguranca/idor-e-autorizacao)).**
Documentado aqui porque a lacuna encontrada na API é exatamente o que
essa técnica resolveria.

Hoje existe um teste real de negação (`api/test/models/ability_test.rb`),
mas ele testa `Ability#cannot?` diretamente em memória — não uma matriz
formal, não gerado a partir de uma definição estruturada, e não rodando
contra rota HTTP real. Nenhum dos 16 arquivos de teste de controller
(`api/test/controllers/api/v1/admin/*_controller_test.rb`) usa outro
usuário além do admin wildcard — não existe hoje "um teste por papel"
verificando que cada combinação papel×recurso×ação se comporta como o
RBAC (`a_papeis`/`a_permissoes`/`a_papeis_permissoes`) diz que deveria.

**Por que isso importa mais aqui do que num RBAC hardcoded:** este
projeto já decidiu que autorização nasce de **dado** (registro em
`a_papeis`/`a_permissoes`), não de `can :manage, X` escrito à mão no
`Ability` (regra 13 do `api/CLAUDE.md`, motivada por uma lição real de
outro produto do mesmo grupo). Isso é bom — papel novo é dado, não
deploy — mas também significa que a autorização pode mudar **sem** uma
mudança de código correspondente (alguém edita `a_papeis_permissoes` via
admin, em produção). Um teste que só verifica "o código do `Ability`
resolve certo hoje" não pega uma alteração de dado que quebra a
expectativa amanhã — é exatamente o cenário que uma matriz automatizada,
rodando contra a definição real de papéis/permissões, protegeria.

**O que a técnica pediria, se implementada (mudança na API):** um arquivo
de matriz (papel real do sistema × cada recurso admin × ação —
`CONSULTAR`/`INCLUIR`/`EDITAR`/`EXCLUIR`) processável por um script, um
teste de integração genérico que itera essa matriz e bate contra a rota
HTTP real (não só `Ability#cannot?`), usando um fixture por "ponto de
vista" de papel (não só `users(:one)`), e falha nomeando exatamente qual
combinação papel×recurso×ação violou a matriz.
