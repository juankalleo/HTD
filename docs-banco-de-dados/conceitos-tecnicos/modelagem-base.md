---
sidebar_label: Modelagem base
date: "30 de agosto de 2026"
---

# Modelagem base

Todo model deste projeto herda de `ApplicationRecord` — e ganha, sem
precisar declarar nada, quatro comportamentos que normalmente seriam
reimplementados (ou esquecidos) model a model.

## O que vem de graça

```ruby
class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  include Auditable
  acts_as_paranoid
  has_paper_trail

  before_validation :garantir_public_id
  before_save :set_paper_trail_whodunnit

  MAX_STRING_LENGTH = 255
  MAX_TEXT_LENGTH = 10_000
  validate :limitar_tamanho_dos_campos_de_texto
end
```

## Auditoria — quem mudou, quando, de onde

O concern `Auditable` (`app/models/concerns/auditable.rb`) preenche
`created_by`/`updated_by` a partir de `Current.user` a cada
`create`/`save`, e `deleted_by` no soft delete (ver abaixo) — sem
precisar de callback manual em cada model. `Current` é um
`ActiveSupport::CurrentAttributes`, resolvido uma vez por requisição
(ver [Envelope de resposta](/padrao-api/conceitos-tecnicos/envelope-de-resposta)
pro lado da API que popula isso).

## Soft delete por padrão — não opcional

```ruby
acts_as_paranoid
```

Toda tabela tem uma coluna `deleted_at`; "excluir" um registro marca essa
coluna, não remove a linha. Consultas normais (`Model.all`,
`Model.find`) já ignoram registro soft-deletado automaticamente — só um
escopo explícito (`Model.only_deleted`/`.with_deleted`) enxerga ele. Pra
um `User`, isso tem um efeito prático direto: um usuário soft-deletado
simplesmente não é encontrado por `find_for_authentication`, então não
consegue logar — o mesmo efeito prático de um campo `ativo: false`, sem
precisar de uma coluna de status separada só pra isso.

## Versionamento — todo model, sem opt-out

```ruby
has_paper_trail

def set_paper_trail_whodunnit
  PaperTrail.request.whodunnit = Current.user&.id&.to_s
end
```

Toda mudança (`create`/`update`/`destroy`) de todo model grava uma linha
na tabela `versions`, com quem fez (`whodunnit`) e o estado anterior do
registro. É o que sustenta
[Logs de auditoria](/padrao-frontend/seguranca/logs-de-auditoria) no
Padrão Frontend. Detalhe completo da tecnologia em
[PaperTrail](/padrao-banco-de-dados/tecnologias/paper-trail).

## Limite de tamanho de campo — reforçado no ORM, não só no banco

```ruby
MAX_STRING_LENGTH = 255
MAX_TEXT_LENGTH = 10_000
validate :limitar_tamanho_dos_campos_de_texto
```

Toda coluna `:string` tem teto de 255 caracteres, toda `:text` tem teto
de 10.000 — reforçado por validação no model, não só pelo tipo de coluna
do banco (que em Postgres, sem `limit:` explícito, não impõe teto
nenhum). Isso garante o teto mesmo se alguém pular a camada de validação
do front e mandar payload direto pra API.

## `public_id` — opt-in, não automático

```ruby
before_validation :garantir_public_id
```

Só preenche um UUID se a tabela **tiver** a coluna `public_id` — não
adiciona a coluna sozinho. `public_id` existe só nas tabelas cujo
registro é exposto publicamente (URL, referência externa) — usar UUID em
vez do `id` numérico sequencial nesses casos evita que alguém enumere
registro só incrementando um número na URL (ver
[IDOR e autorização](/padrao-frontend/seguranca/idor-e-autorizacao) no
Padrão Frontend, o mesmo princípio do lado do front).

## Leitura de apoio

- [ActiveRecord Callbacks (docs oficiais)](https://guides.rubyonrails.org/active_record_callbacks.html) — `before_validation`, `before_save`, o mecanismo por trás de tudo isso.
- [OWASP — Insecure Direct Object Reference (IDOR) Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) — por que ID sequencial previsível é um risco real, o motivo de existir `public_id`.
