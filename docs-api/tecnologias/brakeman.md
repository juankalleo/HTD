# Brakeman

## O que é

Ferramenta de análise estática de segurança, específica pra Rails —
varre o código-fonte (sem executar a aplicação) procurando padrão
conhecido de vulnerabilidade: SQL injection, mass assignment sem
proteção, `eval`/`send` com entrada não confiável, e outras classes de
falha catalogadas.

## Por que essa

A ferramenta de referência do próprio ecossistema Rails pra esse tipo de
checagem — entende a estrutura de um app Rails (rota, controller, view,
model) de um jeito que um linter genérico não entende, então consegue
apontar, por exemplo, uma query com interpolação de string perigosa
específica do ActiveRecord, não só um padrão de string genérico.
Rodar isso a cada entrega pega uma classe inteira de vulnerabilidade
antes de qualquer revisão humana precisar procurar por ela manualmente.

## Versão

`brakeman (8.0.6)` — `Gemfile.lock`.

## Como importar

```ruby
# Gemfile
group :development, :test do
  gem "brakeman", require: false
end
```

```bash
bin/brakeman --no-pager
```

## Exemplo real

Rodar sem `--no-pager` abre um pager interativo (bom pra ler no
terminal); `--no-pager` é o que entra em CI/script, pra não travar
esperando uma tecla:

```bash
bin/rails test && bin/rubocop && bin/brakeman --no-pager
```

## Onde usar no projeto

Terceira e última checagem da tríade obrigatória antes de qualquer
entrega (`CLAUDE.md` regra 11), depois de teste e
[RuboCop](/padrao-api/tecnologias/rubocop) — as três precisam terminar
limpas, sem warning ignorado, não só "sem erro fatal".
