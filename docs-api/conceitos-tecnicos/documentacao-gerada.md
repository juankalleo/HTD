---
sidebar_label: Documentação gerada automaticamente
---

# Documentação gerada automaticamente

Verificado na fonte antes de escrever esta página: o projeto **não** usa
`rake` no sentido literal (nenhum arquivo `.rake`, nenhum `task :nome do`
em lugar nenhum). O que existe é parecido — scripts Ruby simples em
`lib/tasks/`, rodados via `bin/rails runner` — mas vale documentar a
diferença real, não assumir que é Rake só porque a pasta se chama
`lib/tasks/`.

## Os dois scripts reais

```ruby
# lib/tasks/gerar_postman.rb
# Rodar com: bin/rails runner lib/tasks/gerar_postman.rb
# Gera o Postman Collection completo, 100% a partir de introspecção de
# rotas + colunas de model — nenhuma entidade é cadastrada à mão aqui.
```

```ruby
# lib/tasks/gerar_swagger.rb
# Rodar com: bin/rails runner lib/tasks/gerar_swagger.rb
# Gera public/swagger.yaml 100% a partir de introspecção de rotas +
# colunas de model — mesmo espírito do gerar_postman.rb.
```

Os dois leem rota (`Rails.application.routes`) e coluna de model
diretamente do código carregado — não têm uma lista de endpoint mantida
à mão em lugar nenhum. Isso significa que gerar a coleção/spec de novo
depois de um `bin/rails g api_scaffold` (ver
[Envelope de resposta](/padrao-api/conceitos-tecnicos/envelope-de-resposta)
pro resto da convenção de scaffold) já sai atualizado sozinho, sem
precisar editar esses dois arquivos — só a seção de Auth é hardcoded nos
dois, porque login/logout não nasce de scaffold e é sempre igual.

## Por que `bin/rails runner`, não uma rake task de verdade

Um script chamado via `rails runner` tem acesso ao ambiente Rails
carregado inteiro (models, rotas) exatamente como uma rake task teria —
a diferença é só a interface de invocação (`bin/rails runner
caminho/do/arquivo.rb` em vez de `bin/rails nome:da:task`). Pra um
script que roda raramente, sob demanda, sem parâmetro nem
agendamento, não ganha nada em transformar isso numa rake task de
verdade — seria uma camada de indireção (`Rake::Task`, namespace,
`desc`) sem propósito real pra um script chamado direto por caminho.

## Regra do projeto — documentação cresce junto com o código

`CLAUDE.md` regra 12: *"Ao adicionar endpoints: atualizar
`public/swagger.yaml` e a seção correspondente em
`lib/tasks/gerar_postman.rb`"* — na prática, como os dois scripts são
gerados por introspecção, "atualizar" quase sempre significa só rodar os
dois de novo, não editar manualmente. A regra existe pra impedir que a
documentação da API fique defasada do código real por esquecimento.

## Leitura de apoio

- [Rails — The Rails Command Line: `rails runner`](https://guides.rubyonrails.org/command_line.html#bin-rails-runner) — o mecanismo real usado aqui.
- [OpenAPI / Swagger — especificação oficial](https://swagger.io/specification/) — o formato que `gerar_swagger.rb` produz.
