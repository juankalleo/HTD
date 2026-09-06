---
date: "30 de agosto de 2026"
---

# Solid Queue

## O que é

Backend de job assíncrono do próprio Rails (padrão a partir do Rails 8)
— fila e agendamento gravados no banco relacional já existente, sem
precisar de um serviço separado (Redis, por exemplo) só pra isso.

## Por que essa (não Sidekiq/good_job)

A escolha aqui nem foi "comparar gems" — é o default do Rails 8, e o
projeto não trouxe nada por cima pra substituir. As duas alternativas
mais conhecidas do ecossistema resolvem o mesmo problema de formas
diferentes:

- **Sidekiq** — o mais popular, mas exige Redis rodando à parte só pra
  isso: uma peça de infraestrutura a mais pra operar e manter no ar.
- **good_job** — também guarda a fila no Postgres (como o Solid Queue),
  e usa `LISTEN`/`NOTIFY` do Postgres pra pegar job novo quase
  instantaneamente, em vez de checar o banco de tempos em tempos
  (polling); vem com um dashboard web pronto pra inspecionar fila. É uma
  gem de terceiro, não o default oficial do framework — mas tecnicamente
  competitiva com o Solid Queue.

Pra um projeto que já roda Postgres e não tem volume de job que
justifique um serviço de fila dedicado, usar o que já vem integrado
(mesmo banco, mesma conexão, zero peça nova de infraestrutura pra
operar, mantido pelo próprio time do Rails) é a escolha de menor
atrito — trocar por Sidekiq ou good_job só faria sentido se o volume de
job crescesse a ponto do polling em banco virar gargalo, ou se o projeto
precisasse do dashboard pronto que o good_job oferece.

## Versão

`solid_queue (1.5.1)` — `Gemfile.lock`.

## Como importar

```ruby
# Gemfile
gem "solid_queue"
```

```yaml
# config/queue.yml
default: &default
  dispatchers:
    - polling_interval: 1
      batch_size: 500
  workers:
    - queues: "*"
      threads: 3
      processes: <%= ENV.fetch("JOB_CONCURRENCY", 1) %>
      polling_interval: 1
```

## Exemplo de uso

```ruby
# app/jobs/application_job.rb — a base, ainda no estado padrão do Rails
class ApplicationJob < ActiveJob::Base
  # retry_on ActiveRecord::Deadlocked
  # discard_on ActiveJob::DeserializationError
end
```

Configurado e pronto pra uso — `queue.yml` já define worker/dispatcher
pros três ambientes — mas nenhum job próprio foi escrito ainda no
projeto (`app/jobs/` só tem a classe base gerada pelo Rails). Um job real
seguiria o padrão comum do ActiveJob:

```ruby
class NotificarAlgoJob < ApplicationJob
  queue_as :default

  def perform(usuario_id)
    # ...
  end
end
```

## Tipos de job

Todo backend de fila do ActiveJob (Solid Queue incluído) cobre duas
formas bem diferentes de agendar trabalho:

**Job assíncrono avulso** — disparado pelo próprio código da aplicação,
uma vez, em resposta a algo que aconteceu agora:

```ruby
NotificarAlgoJob.perform_later(usuario.id)          # o quanto antes
NotificarAlgoJob.set(wait: 10.minutes).perform_later(usuario.id) # daqui a X
```

**Job recorrente** — não é disparado pelo código, é **declarado** uma
vez num arquivo de configuração e roda sozinho, tipo cron, sem nenhuma
chamada explícita em lugar nenhum. No Solid Queue isso vive em
`config/recurring.yml`:

```yaml
production:
  limpar_algo_antigo:
    class: LimparAlgoAntigoJob
    queue: background
    schedule: every day at 3am
```

Cada entrada roda uma classe de job (`class:`) ou um comando direto
(`command:`) no horário declarado (`schedule:`, em linguagem natural:
`every hour`, `every day at 5am`...) — útil pra manutenção periódica
(limpeza de registro antigo, job de housekeeping do próprio Solid Queue)
que não depende de nenhuma ação de usuário pra existir.

**Retry e descarte** — `ApplicationJob` é o lugar certo pra declarar
comportamento padrão de erro pra todo job do projeto:

```ruby
class ApplicationJob < ActiveJob::Base
  retry_on ActiveRecord::Deadlocked
  discard_on ActiveJob::DeserializationError
end
```

`retry_on` tenta de novo (com backoff configurável) quando aquele erro
específico acontece; `discard_on` desiste silenciosamente — a escolha
entre os dois depende se o erro é transitório (vale tentar de novo) ou
permanente (repetir só ia falhar do mesmo jeito de novo).

## Onde usar no projeto

Ainda não tem consumidor de negócio — infraestrutura pronta pra quando
aparecer o primeiro caso de uso genuíno de trabalho assíncrono (envio de
e-mail em lote, geração de relatório pesado fora do ciclo de
request/response, etc.), sem precisar de setup novo quando isso
acontecer. O único job recorrente já configurado hoje é interno do
próprio Solid Queue (limpeza da tabela de jobs já finalizados) — não um
job de negócio do projeto.
