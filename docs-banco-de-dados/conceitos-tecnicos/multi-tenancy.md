---
sidebar_label: Multi-tenancy
date: "30 de agosto de 2026"
---

# Multi-tenancy

Um banco só, várias organizações isoladas dentro dele (multi-tenancy por
linha, não por schema/banco separado) — a hierarquia tem três
níveis.

## A hierarquia

`a_tenant` (o cliente SaaS — a organização no topo) → `a_orgao`
(órgão/CNPJ, pertence a **um** tenant) → `a_unidade` (divisão/setor,
pertence a **um** órgão) → `users.a_unidade_id` (opcional — nem todo
usuário está preso a uma unidade específica).

```ruby
create_table "a_orgaos", force: :cascade do |t|
  t.string "nome"
  t.bigint "a_tenant_id", null: false
  t.index ["a_tenant_id"], name: "index_a_orgaos_on_a_tenant_id"
end

create_table "a_unidades", force: :cascade do |t|
  t.string "nome"
  t.bigint "a_orgao_id", null: false
end

create_table "users", force: :cascade do |t|
  t.bigint "a_unidade_id"
end

add_foreign_key "a_orgaos", "a_tenants"
add_foreign_key "a_unidades", "a_orgaos"
add_foreign_key "users", "a_unidades"
```

## `dependent: :restrict_with_error` — nunca cascata na hierarquia de tenant

```ruby
# ATenant
has_many :a_orgaos, dependent: :restrict_with_error
# AOrgao
has_many :a_unidades, dependent: :restrict_with_error
```

Deletar um tenant que ainda tem órgão vinculado **falha**, não apaga em
cascata. É deliberado: um `dependent: :destroy` na ponta de cima da
hierarquia de tenant apagaria silenciosamente todo o negócio de um
cliente inteiro se alguém remover a linha errada — `restrict_with_error`
obriga a decisão consciente de remover cada nível primeiro,
explicitamente.

## Onde o isolamento entre tenant é aplicado de verdade

Não é no schema — nenhuma tabela de negócio comum tem um `WHERE
tenant_id = ?` implícito automático tipo Row-Level Security do Postgres.
O isolamento vive na camada de autorização: `a_usuarios_papeis` (a
atribuição de papel a um usuário) carrega um `escopo` polimórfico
(`escopo_type`/`escopo_id`, apontando pra uma `AUnidade`, `AOrgao` ou
`ATenant` real) mais um nível (`a_escopo_papel_id`: Unidade, Órgão,
Tenant ou Plataforma). `accessible_by(ability)` — ver
[Filtros e busca](/padrao-api/conceitos-tecnicos/filtros-e-busca) e
[Autorização](/padrao-api/seguranca/autorizacao) no Padrão API — é o que
de fato filtra a query pelo escopo do papel do usuário logado, não uma
constraint de banco.

```ruby
belongs_to :escopo, polymorphic: true, optional: true
validates :escopo, presence: true, unless: -> { a_escopo_papel_id == AEscopoPapel.plataforma.id }
```

Só o escopo **Plataforma** dispensa um `escopo` específico — faz
sentido, porque "Plataforma" já significa "sem tenant nenhum, acesso
cross-tenant" por definição.

## Leitura de apoio

- [Multi-tenant data architecture patterns](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/storage-data) — comparação entre isolamento por linha (o que este projeto faz), por schema e por banco separado, com os trade-offs de cada um.
- [Distributed Systems — Tanenbaum & Van Steen](/padrao-frontend/leitura-recomendada/distributed-systems) — replicação e particionamento de dado, o princípio geral por trás de qualquer estratégia de isolamento multi-tenant.
