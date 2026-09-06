---
sidebar_label: Nomenclatura e módulos
date: "30 de agosto de 2026"
---

# Nomenclatura e módulos

Toda tabela (e model correspondente) leva um prefixo de **uma letra**,
indicando o módulo de negócio a que pertence — não o nome da tabela em
si, o módulo.

## O prefixo é do módulo, não da tabela

| Prefixo | Módulo | Exemplo de tabela |
|---|---|---|
| `a_` | Acesso (autenticação/RBAC) | `a_tenants`, `a_orgaos`, `a_unidades`, `a_papeis`, `a_permissoes`, `a_recursos`, `a_acoes` |
| `g_` | Gestão (referência geográfica) | `g_pais`, `g_estados`, `g_municipios` |
| `c_` | Configuração | `c_configuracoes` |
| *(nenhum)* | — | `users` |

`User`/`users` é a **única** exceção deliberada — sem prefixo, de
propósito: Devise deriva `authenticate_user!`/`current_user` a partir do
nome do model, e prefixar quebraria essa convenção padrão do
ecossistema. Toda regra tem uma exceção documentada; esta é a única.

## Regra: nunca reservar prefixo "por precaução"

Um prefixo existe pra um módulo que **já** tem mais de uma tabela
relacionada — não é criado antecipadamente pra um módulo que ainda não
existe. Criar um prefixo novo sem necessidade real infla a superfície de
nomenclatura sem ganho — a mesma disciplina de "sem código por
precaução" que já aparece em outras partes deste padrão (ver
[Web Concurrency](/padrao-frontend/conceitos-tecnicos/web-concurrency),
por exemplo, no Padrão Frontend).

## Toda tabela nova precisa de uma linha em `inflections.rb`

```ruby
# config/initializers/inflections.rb
ActiveSupport::Inflector.inflections(:en) do |inflect|
  inflect.irregular "a_acao", "a_acoes"
  inflect.irregular "a_escopo_papel", "a_escopos_papel"
end
```

Achado real: o plural de um nome em português quase sempre foge da regra
automática do Rails (pensada pra inglês) — `a_acao` viraria `a_acaos`
sem essa entrada, não `a_acoes`. A entrada precisa ir no locale `:en`
(o locale que o Rails usa internamente pra inflexão de nome de
classe/tabela, independente do idioma do conteúdo) — `:"pt-BR"` não
tem efeito nenhum aqui, mesmo sendo tentador registrar lá por parecer
mais "correto" pro idioma do projeto.

## Leitura de apoio

- [Rails — ActiveSupport::Inflector (docs oficiais)](https://api.rubyonrails.org/classes/ActiveSupport/Inflector.html) — o mecanismo de inflexão de nome, singular/plural, por trás da convenção Rails inteira.
