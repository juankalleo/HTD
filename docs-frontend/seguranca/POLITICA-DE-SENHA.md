---
sidebar_label: Política de senha
date: "29 de agosto de 2026"
---

# Política de senha

Regras que definem o que conta como senha aceitável — tamanho mínimo/
máximo, composição de caracteres, e se a senha é checada contra listas de
senha vazada. O [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
recomenda: mínimo 8 caracteres com MFA (15 sem MFA), máximo de pelo menos
64 caracteres, aceitar qualquer caractere (sem regra de "1 maiúscula + 1
número + 1 símbolo"), e não truncar senha maior que o limite em silêncio.

## No padrão frontend

**O front já limita corretamente** — `MAX_PASSWORD_LENGTH = 128` (`lib/
form-limits.ts`) e `min(6, ...)` nos schemas Zod de `alterar-senha` e
`primeiro-acesso` (ver [Formulários](/padrao-frontend/formularios)).

**A API também aplica, sem depender do módulo `:validatable` inteiro do
Devise** (que traria validação de e-mail junto, fora do escopo deste
ponto). `User` valida só o que falta:

```ruby
# api/app/models/user.rb
validates :password, presence: true, on: :create
validates :password, length: { within: Devise.password_length }, allow_blank: true
```

`Devise.password_length` é a mesma configuração global
(`config.password_length = 6..128`, `api/config/initializers/devise.rb`)
que `lib/form-limits.ts` já espelhava no front — agora os dois lados leem
o mesmo teto real, um lido direto da config do Devise, o outro copiado
como constante documentada. `allow_blank: true` preserva o comportamento
correto de edição (senha em branco = "não trocar" — o setter do Devise já
só grava `encrypted_password` quando o valor vem preenchido); `presence:
true, on: :create` fecha o caso que não tinha proteção nenhuma: criar um
usuário sem senha não é mais possível, nem por fora do front.

Nenhuma regra de composição (maiúscula/número/símbolo obrigatório) existe
em lugar nenhum, front ou back — e não deveria: o OWASP recomenda
exatamente essa ausência (é a prática atual, substituindo a exigência
antiga de "1 maiúscula + 1 número"). Tamanho é a única regra que
realmente importa aqui, e agora está nos dois lados.
