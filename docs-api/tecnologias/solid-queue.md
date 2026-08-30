# Solid Queue

## O que é

Backend de job assíncrono do próprio Rails (padrão a partir do Rails 8)
— fila e agendamento gravados no banco relacional já existente, sem
precisar de um serviço separado (Redis, por exemplo) só pra isso.

## Por que essa (não Sidekiq/good_job)

A escolha real aqui nem foi "comparar gems" — é o default do Rails 8, e
o projeto não trouxe nada por cima pra substituir. Sidekiq (o mais
popular do ecossistema) exige Redis rodando à parte; good_job também é
DB-backed, como o Solid Queue, mas é uma gem de terceiro, não o default
oficial do framework. Pra um projeto que já roda Postgres e não tem
volume de job que justifique um serviço de fila dedicado, usar o que já
vem integrado (mesmo banco, mesma conexão, zero peça nova de
infraestrutura pra operar) é a escolha de menor atrito — trocar por
Sidekiq só faria sentido se o volume de job crescesse a ponto do
polling em banco virar gargalo real, o que ainda não é o caso aqui.

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

## Onde usar no projeto

Ainda não tem consumidor real — infraestrutura pronta pra quando
aparecer o primeiro caso de uso genuíno de trabalho assíncrono (envio de
e-mail em lote, geração de relatório pesado fora do ciclo de
request/response, etc.), sem precisar de setup novo quando isso
acontecer.
