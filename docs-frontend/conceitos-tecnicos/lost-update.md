---
sidebar_label: Lost Update
---

# Lost Update

Problema clássico de concorrência em dado compartilhado: dois usuários
abrem o mesmo registro pra editar, ambos veem a versão antiga, o primeiro
salva, e o segundo salva por cima — sobrescrevendo a mudança do primeiro
sem nunca saber que ela existiu. Nenhum dos dois recebeu erro, o sistema
não percebeu conflito nenhum, e uma edição real simplesmente desaparece.
É um dos casos centrais do capítulo de controle de concorrência de
*Designing Data-Intensive Applications* (ver
[Leitura recomendada](/padrao-frontend/leitura-recomendada/designing-data-intensive-applications)).

## No padrão frontend

**Não tratado hoje — nem no front, nem na API.** Verificado na fonte, não
suposto: `ApplicationRecord` (base de todo model Rails deste monorepo) não
tem coluna `lock_version` (o mecanismo de *optimistic locking* nativo do
ActiveRecord), nenhum controller usa `fresh_when`/`stale?` (o mecanismo de
ETag/`If-Match` do Rails), e nenhuma rota de update recebe ou compara um
carimbo de versão do registro. O front, do lado dele, também não guarda
`updated_at` (ou qualquer campo de versão) no formulário — busca o
registro, edita, manda só os campos alterados de volta.

**O que precisaria mudar, dos dois lados, pra isso ser tratado:**

1. **API** — adicionar optimistic locking real: coluna `lock_version`
   (ActiveRecord já sabe usar sozinho, incrementa a cada update e rejeita
   um update com versão desatualizada, `ActiveRecord::StaleObjectError`)
   **ou** comparar `updated_at` manualmente no controller antes de salvar.
   Sem isso na API, não tem como o front detectar o conflito — o
   `PATCH`/`PUT` sempre "funciona", mesmo sobrescrevendo silenciosamente.
2. **Front** — o formulário de edição precisaria: (a) guardar
   `updated_at`/`lock_version` recebido no fetch inicial do registro; (b)
   mandar esse valor junto no `PATCH` de salvar; (c) tratar uma resposta
   de conflito (a API devolvendo 409, por exemplo) mostrando uma tela
   real de conflito — não um toast genérico de erro — comparando o que o
   usuário editou com o que já foi salvo por outra pessoa, deixando
   escolher manter a própria versão, descartar, ou mesclar campo a campo.
   Nenhuma dessas três etapas existe em nenhum formulário do projeto hoje.

**Por que isso ainda não é um problema prático:** o padrão de edição atual
(ver [Formulários](/padrao-frontend/formularios)) é CRUD simples de
poucos admins por tenant, sem fluxo colaborativo simultâneo conhecido
(dois admins editando o mesmo papel ao mesmo tempo é raro, não impossível)
— por isso a régua deste projeto (nunca implementar antes de um caso
real) ainda não empurrou isso pra dentro. Fica documentado aqui
justamente pra não ser descoberto tarde, no dia que dois admins realmente
colidirem numa edição.

## Leitura de apoio

- [Leitura recomendada — Designing Data-Intensive Applications](/padrao-frontend/leitura-recomendada/designing-data-intensive-applications) — capítulo 7 (Transactions) cobre lost update e as estratégias reais de prevenção (locking, CAS, detecção automática).
- [Rails — Optimistic Locking (docs)](https://api.rubyonrails.org/classes/ActiveRecord/Locking/Optimistic.html) — o mecanismo `lock_version` que a API não usa hoje.
