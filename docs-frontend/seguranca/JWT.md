---
sidebar_label: JWT
description: "Autenticação JWT explicada por fluxo, access token, refresh token, armazenamento, revogação, riscos de segurança e comparação com sessão."
date: "29 de agosto de 2026"
---

# Autenticação JWT

Autenticação JWT usa um token assinado para a API reconhecer o usuário em cada requisição. No padrão do How to Dev, a
API Rails emite um JWT no login, o browser guarda esse token localmente e as próximas chamadas enviam
`Authorization: Bearer <token>`.

Esta página explica o modelo de autenticação, não só o formato do token. Um JWT tecnicamente válido ainda pode virar um
desenho fraco se carrega dado sensível, não pode ser revogado, fica armazenado no lugar errado ou é tratado como
substituto de autorização.

## Como a autenticação JWT funciona

O fluxo deste projeto é propositalmente simples:

```text
1. Browser envia email e senha para POST /api/v1/auth/sign_in
2. Rails valida a credencial com Devise
3. devise-jwt assina um access token e devolve no header Authorization
4. O browser guarda token e resumo do usuário
5. Requisições futuras enviam Authorization: Bearer <token>
6. Rails verifica assinatura, expiração e jti antes de resolver current_user
```

O detalhe importante: a API não confia no browser só porque existe um token. Ela verifica o token a cada requisição
autenticada, e autorização continua acontecendo depois da autenticação.

## Access token

O JWT usado aqui é um access token: ele prova que a requisição pertence a um usuário autenticado por tempo limitado. O
payload real fica mínimo:

- `sub`: id do usuário
- `scp`: escopo do Devise
- `jti`: identificador usado para revogação
- `aud`: audience, vazio quando o client não envia
- `iat`: data de emissão
- `exp`: data de expiração

Nome, e-mail, papel e permissão não entram no token. Esses dados vêm como JSON normal na resposta do login e podem ser
reconsultados em `/api/v1/auth/me`. Isso importa porque payload de JWT é base64url, não criptografia. Quem tem o token
consegue decodificar o payload sem a chave de assinatura.

## Refresh token

Este padrão do How to Dev ainda não usa endpoint de refresh token. Quando o access token expira, o usuário faz login de
novo.

É menos conveniente do que renovação silenciosa, mas evita adicionar uma segunda credencial de longa duração antes de o
projeto ter uma política completa de rotação. Se refresh token entrar depois, o desenho precisa de rotação, detecção de
reuso, access token curto e uma decisão clara de armazenamento.

## Onde guardar JWT?

Este projeto guarda o access token em `localStorage` e envia manualmente no header `Authorization`. Essa escolha evita
CSRF clássico porque o browser não anexa automaticamente o token em requisições cross-site.

O trade-off é XSS: se um atacante conseguir executar JavaScript na página, consegue ler `localStorage`. Por isso a
decisão de JWT precisa ser lida junto com as páginas de XSS, CSP, CSRF e cookies seguros, não como checklist isolado.

## Riscos de segurança

O checklist específico vem do
[OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html):

- nunca aceitar token sem assinatura nem confusão de algoritmo;
- usar segredo forte em produção;
- manter claims mínimas e sem dado sensível;
- validar expiração;
- revogar token com `jti`, não com logout falso;
- separar autenticação de autorização;
- proteger o armazenamento com prevenção de XSS e CSP.

**Algoritmo: HS256, o default da gem — não fixado explicitamente no projeto**, mas isso não é o problema que o cheat
sheet mais adverte (`alg: none`/confusão de algoritmo). A gem `jwt` exige o algoritmo explícito na verificação, então
não há brecha de `none` aceito. Produção falha ao subir sem `DEVISE_JWT_SECRET_KEY` configurado (`devise.rb`) — não cai
num segredo fraco por padrão.

**Claims: mínimas, nada sensível.** O payload real é só `sub` (id do
usuário), `scp`, `jti`, `aud` (vazio se o client não mandar), `iat`,
`exp` (24h). Nome, e-mail, papel e permissão **não** entram no token — o
`CurrentUserSerializer` (que carrega esses dados) é uma resposta JSON
separada, devolvida junto no login, nunca embutida no JWT em si. Como o
JWT é só base64 (qualquer um com o token consegue decodificar o payload
sem precisar da chave), isso importa de verdade: manter o payload mínimo
é a defesa certa contra vazar dado sensível por decodificação, não
criptografia do token.

**Revogação: real, não `Null`.** `User` usa
`Devise::JWT::RevocationStrategies::JTIMatcher` — um `jti` guardado
direto na tabela `users`, comparado a cada requisição
(`jwt_revoked?(payload, user) = payload['jti'] != user.jti`). Logout
(`DELETE /api/v1/auth/sign_out`) roda `revoke_jwt`, que troca o `jti` do
usuário — todo token emitido antes daquele logout para de validar
imediatamente, sem esperar o `exp` de 24h expirar sozinho. Efeito
colateral aceitável do desenho (uma coluna, não uma tabela de denylist
por token): revogar invalida **todos** os tokens ativos daquele usuário
de uma vez, não só o que fez logout — razoável pra este projeto, que não
tem conceito de múltiplas sessões simultâneas independentes.

**Client storage: `localStorage`, trade-off já documentado** — ver
[Cookies HttpOnly & Secure](/padrao-frontend/seguranca/cookies-httponly-secure)
e [XSS](/padrao-frontend/seguranca/xss).

## JWT vs autenticação por sessão

JWT é útil quando uma API precisa autenticar requisições stateless entre clientes ou serviços. Sessão por cookie costuma
ser mais simples em apps renderizados pelo servidor, porque o browser envia o cookie automaticamente e o servidor pode
manter estado de sessão.

O trade-off não é "JWT moderno, sessão antiga". É onde ficam estado, revogação, exposição a CSRF e exposição a XSS.
Neste projeto, JWT combina com o backend Rails API-first e chamadas diretas browser → API, mas ainda exige revogação e
controles fortes no frontend.

## Continue aprendendo

- [Autenticação](/padrao-frontend/seguranca/autenticacao)
- [CSRF](/padrao-frontend/seguranca/csrf)
- [XSS](/padrao-frontend/seguranca/xss)
- [Cookies HttpOnly & Secure](/padrao-frontend/seguranca/cookies-httponly-secure)
- [Autenticação na API](/padrao-api/seguranca/autenticacao)
- [Administração e RBAC](/padrao-frontend/seguranca/administracao-rbac)
- [Developer Roadmap](/developer-roadmap)

## Referências

- [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [RFC 7519 - JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
- [MDN - Authorization header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
