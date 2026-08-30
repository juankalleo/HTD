---
sidebar_label: Logs de auditoria
---

# Logs de auditoria

Rastro de **quem mudou o quê, quando** — diferente de log de evento de
segurança (login falho, autorização negada, ver
[Força bruta e bloqueio](FORCA-BRUTA-E-BLOQUEIO.md)). Auditoria de dado
responde "o registro X mudou de A pra B, feito por quem, em que
momento"; log de segurança responde "alguém tentou algo que não devia".
São duas coisas diferentes, cobertas por mecanismos diferentes — este
documento é só sobre a primeira.

## No padrão frontend

**Implementado de ponta a ponta — API e front.** Toda tabela do projeto herda `has_paper_trail`
(`api/app/models/application_record.rb`) — o PaperTrail já grava uma
linha na tabela `versions` a cada `create`/`update`/`destroy` de
qualquer registro, com `whodunnit` (id do usuário logado,
`PaperTrail.request.whodunnit = Current.user&.id&.to_s`), `item_type`/
`item_id` (qual registro), `event` (`create`/`update`/`destroy`),
`object` (o estado do registro antes da mudança) e `created_at`. Colunas
reais, `db/schema.rb`:

```ruby
create_table "versions", force: :cascade do |t|
  t.string "whodunnit"
  t.datetime "created_at"
  t.bigint "item_id", null: false
  t.string "item_type", null: false
  t.string "event", null: false
  t.text "object"
end
```

**Exposto, só leitura** — `GET /api/v1/admin/versions` (lista, com filtro
por `item_type`/`item_id`/`event`/`whodunnit`/data) e `GET /api/v1/admin/
versions/:id` (detalhe, com o payload completo). Front em `/logs`
(listagem, filtro por tipo de registro e ação) e `/logs/:id` (detalhe —
rota própria, não modal, mesmo padrão do resto do admin). Menu
"Administração → Logs de auditoria".

**Decisões reais tomadas ao implementar, não óbvias de fora:**

- `PaperTrail::Version` herda de `ActiveRecord::Base` direto (gem), não de
  `ApplicationRecord` — sem `ransackable_attributes`, então o filtro da
  API é manual (`VersionLog::List`), não Ransack — deliberado também
  porque log de auditoria não é o tipo de recurso que deveria aceitar
  predicado dinâmico livre.
- Nomear arquivo/classe própria `PaperTrail::Version::algumacoisa`
  quebra: o Zeitwerk auto-vivifica `PaperTrail::Version` como módulo vazio
  a partir do caminho da pasta, antes da gem carregar a classe real —
  `TypeError: Version is not a class`. Nomes próprios (`VersionLog::List`,
  `VersionLogSerializer`), sem tocar o namespace da gem, evitam a colisão.
- `render_success(data: @registro, ...)` sozinho não usa serializer
  customizado quando o nome da classe não bate com a convenção do
  ActiveModelSerializer (`PaperTrail::VersionSerializer`, que não existe
  de propósito) — o `show` serializa explícito
  (`VersionLogSerializer.new(@version).as_json`) pra não vazar coluna
  crua sem filtro.
- A coluna `object` do PaperTrail (o payload/snapshot) nunca é
  desserializada (`YAML.load`) — fica como string YAML crua na resposta,
  exposta como `payload` (não `object`, que colidiria com o accessor do
  próprio ActiveModelSerializer) — decisão de segurança, não só de nome.
- Sem escopo de tenant mapeado pra `PaperTrail::Version` em
  `Ability::CONDICAO_DE_ESCOPO_POR_CLASSE` — não existe FK de tenant
  numa tabela polimórfica, então não tem como filtrar isolamento por
  linha com segurança; um papel escopado que ganhasse essa permissão
  levantaria `ArgumentError` alto (mesma regra de sempre do `Ability`) em
  vez de vazar dado de outro tenant. Log de auditoria só deveria ser
  concedido a papel de escopo Plataforma.

**O que isso resolve:** visibilidade de mudança de dado — "quem alterou o
papel X", "quando esse usuário foi criado", útil pra qualquer
investigação depois de um incidente. É um tipo de log diferente de log de
evento de segurança (login falho, bloqueio de rack-attack, autorização
negada — ver [Força bruta e bloqueio](FORCA-BRUTA-E-BLOQUEIO.md) e
[IDOR e autorização](IDOR-E-AUTORIZACAO.md)): PaperTrail grava mudança de
*model*, não evento de autenticação/autorização em si — os dois
complementam um ao outro, cada um respondendo uma pergunta diferente
("o que mudou" vs. "quem tentou o quê"). Uma tela de logs unificada,
mostrando os dois tipos lado a lado, precisaria de um registro estruturado
próprio pra evento de segurança — PaperTrail sozinho não cobre esse
segundo tipo por natureza (ele só reage a mudança de registro).
