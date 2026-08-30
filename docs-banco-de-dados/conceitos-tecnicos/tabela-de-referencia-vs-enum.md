---
sidebar_label: Tabela de referência vs. enum
---

# Tabela de referência em vez de enum

Regra deliberada, não uma omissão: zero `enum` do Rails, zero string
mágica de status/tipo/categoria em qualquer model deste projeto. Todo
campo que "parece um enum" vira sua própria tabela de referência, com
chave estrangeira.

## O que isso significa na prática

Em vez de

```ruby
# NÃO é o padrão deste projeto
enum tipo: { admin: 0, gestor: 1, fornecedor: 2 }
```

o projeto tem uma tabela `a_tipos_usuario`, e o model expõe constante +
finder:

```ruby
class ATipoUsuario < ApplicationRecord
  ADMIN = "ADMIN"
  GESTOR = "GESTOR"
  FORNECEDOR = "FORNECEDOR"

  def self.admin = find_by!(descricao: ADMIN)
end
```

## Por que — o problema real que `enum` do Rails cria

`enum` do Rails mapeia símbolo pra inteiro internamente — o valor
"real" gravado no banco é um número, não a string. Isso cria dois
problemas concretos: (1) o significado de cada número só existe no
código Ruby, invisível pra quem olha o banco direto (uma query SQL crua
vê `tipo = 2`, não `"fornecedor"`); (2) reordenar ou remover uma entrada
do hash do `enum` desloca todo número seguinte — um dado antigo pode
passar a significar outra coisa depois de um deploy, silenciosamente,
sem nenhum erro. Uma tabela de referência com FK não tem nenhum dos dois
problemas: o banco guarda o significado (`descricao`), e adicionar ou
remover uma opção é criar/apagar uma linha, não renumerar as outras.

## O ganho extra: cadastrável sem deploy

Uma tabela de referência pode ganhar uma linha nova via seed ou até tela
de admin, sem precisar de deploy de código — um `enum` do Rails exige
mudar o código-fonte e fazer deploy pra adicionar uma opção nova. Boa
parte das tabelas de referência deste projeto (`a_tipos_unidade`,
`a_escopos_papel`, `a_recursos`, `a_acoes`) são exatamente esse tipo de
lista que evolui ao longo do tempo — o modelo de FK acompanha isso sem
fricção.

## A única exceção real: `ARecurso`

```ruby
# app/models/concerns/reference_text_normalization.rb — normaliza
# descricao pra maiúsculo em toda tabela de referência...
# ...exceto ARecurso: guarda nome de classe Ruby real (case-sensitive),
# usado com safe_constantize na Autorização (ver Padrão API).
```

`a_recursos.descricao` guarda o nome literal de uma classe Ruby
(`"APapel"`, não `"A_PAPEL"`) — normalizar pra maiúsculo quebraria
`safe_constantize` (`"APAPEL".safe_constantize` não resolve pra classe
nenhuma). É uma exceção documentada depois de um bug real, não uma
inconsistência esquecida.

## Nunca buscar por string solta

```ruby
# Errado — string mágica solta no meio do código
ATipoUsuario.find_by(descricao: "ADMIN")

# Padrão do projeto — constante + finder
ATipoUsuario.admin
```

Toda FK de referência é buscada por constante + método de classe, nunca
por string literal repetida em vários lugares do código — um typo em
`"admim"` só quebraria em runtime, tarde, sem o Ruby avisar em lugar
nenhum antes disso.

## Leitura de apoio

- [Rails — Active Record Enums (docs oficiais)](https://guides.rubyonrails.org/active_record_querying.html) — o mecanismo padrão do Rails que este projeto decidiu não usar, pra comparação.
- [Database normalization — lookup tables](https://en.wikipedia.org/wiki/Database_normalization) — o princípio geral de normalização por trás de preferir tabela de referência a valor mágico embutido.
