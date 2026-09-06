---
sidebar_label: Redefinição de senha
date: "29 de agosto de 2026"
---

# Redefinição de senha

O fluxo de "esqueci minha senha" tem um checklist próprio no
[OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html):
mensagem/tempo de resposta idênticos exista ou não a conta (evita
enumeração), token de reset criptograficamente aleatório, de uso único,
com expiração, link em HTTPS, e — o ponto mais fácil de esquecer — nunca
autenticar o usuário automaticamente depois do reset, sempre exigir login
normal com a senha nova.

## No padrão frontend

**A tela existe e está com Zod completo (`esqueci-senha`, `alterar-senha`)
— a API não expõe o endpoint.** `api/config/routes.rb` desativa o módulo
`:passwords` do Devise de propósito (`skip: [:registrations, :passwords,
:confirmations, :unlocks]`), e `User` não inclui `:recoverable` — o
módulo que geraria o token de reset. Sem `:recoverable`, não existe
`PasswordsController`, não existe e-mail de reset, não existe
`reset_password_token`.

O front já documenta essa ausência explicitamente, em vez de fingir que
funciona — `services/api-identity.ts`:

```ts
export async function resetPassword(_token: string, _password: string): Promise<ApiResult> {
  void _token;
  void _password;
  return { ok: false, status: 501, message: "Redefinição de senha ainda não está disponível — backend não expõe esse endpoint." };
}
```

A tela `esqueci-senha` já segue a regra de mensagem genérica corretamente
— o comentário no hook é explícito sobre isso: *"Resposta sempre
genérica (o back não revela se o e-mail existe)"* — mas como o endpoint
real nem existe, hoje toda submissão simplesmente mostra o erro 501, o
que por acaso também não revela nada sobre a existência do e-mail
(mensagem igual pra qualquer input), só que a funcionalidade em si está
fora do ar pro usuário real.

**Regra do padrão: reset de senha nunca loga o usuário sozinho.** Depois
de `alterar-senha` (o link de reset), o front redireciona pra `/login`
com a mensagem "Faça login com a nova senha" — nunca direto pro
dashboard como se a sessão já existisse. Isso vale mesmo com o endpoint
real da API ainda não existindo: o contrato do front já nasce certo, pra
o dia que a API expuser `:recoverable` não herdar um design que contraria
o OWASP.

`primeiro-acesso` **ficou como estava, de propósito** — não é o mesmo
cenário do OWASP: é ativação de conta nova via convite legítimo de admin,
não recuperação de uma conta que pode estar sob ataque. Auto-login depois
de definir a primeira senha é um padrão aceito nesse tipo de fluxo (igual
"crie sua conta, e já entre"), diferente de reset de senha esquecida.

**O que falta pra fechar de verdade (mudança na API):** incluir
`:recoverable` em `User`, implementar `PasswordsController` (ou
equivalente), e ligar o front real (`resetPassword()`,
`requestPasswordReset()`) nesse endpoint quando existir. O front já está
pronto pra esse dia — schema, formulário, mensagens genéricas e o redirect
corrigido já seguem o padrão certo.

## Também auditado: troca de senha logado

O checklist do OWASP também pede que trocar a senha **enquanto logado**
exija a senha atual antes da nova — mas esse recurso não existe neste
projeto: não há tela "trocar minha senha" pra um usuário já autenticado,
só o fluxo de link de reset acima. Não é um gap de "esqueceu de pedir a
senha atual" — é um recurso que ainda não foi construído.
