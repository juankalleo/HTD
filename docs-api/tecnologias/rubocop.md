# RuboCop

## O que é

Linter e formatador estático de Ruby — analisa o código sem executá-lo e
aponta (ou corrige automaticamente) desvio de estilo, código morto e
padrão arriscado.

## Por que essa (e por que "omakase")

```ruby
# .rubocop.yml
inherit_gem: { rubocop-rails-omakase: rubocop.yml }
```

Não é a configuração "toda regra ligada" — herda direto do
`rubocop-rails-omakase`, o guia de estilo oficial que o próprio time
Rails publica pra projeto Rails novo (o mesmo usado pelo `rails new` a
partir do Rails 8). Escolha deliberada: em vez de montar uma config de
regra própria do zero (trabalho contínuo de manutenção, e uma fonte a
mais de bikeshedding de estilo), o projeto herda uma config já mantida e
já alinhada com o próprio framework — o `CLAUDE.md` do projeto reforça
isso como não-negociável: `bin/rubocop` limpo é obrigatório antes de
qualquer entrega, junto com teste e Brakeman (ver
[Brakeman](/padrao-api/tecnologias/brakeman)).

## Versão

`rubocop (1.88.2)` (resolvida via `rubocop-rails-omakase`) — `Gemfile.lock`.

## Como importar

```ruby
# Gemfile
gem "rubocop-rails-omakase", require: false
```

```bash
bin/rubocop          # checa
bin/rubocop -a       # autocorrige o que for seguro autocorrigir
```

## Exemplo de uso

```yaml
# .rubocop.yml
inherit_gem: { rubocop-rails-omakase: rubocop.yml }

# Overwrite or add rules to create your own house style
```

Nenhuma regra própria sobrescrita hoje — o projeto usa o omakase puro,
sem exceção customizada acumulada.

## Onde usar no projeto

`bin/rails test && bin/rubocop && bin/brakeman --no-pager` — os três
juntos, limpos, são pré-requisito documentado (`CLAUDE.md` regra 11)
antes de qualquer entrega ser considerada pronta.
