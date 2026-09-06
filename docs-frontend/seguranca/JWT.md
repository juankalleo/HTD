---
sidebar_label: JWT
date: "29 de agosto de 2026"
---

# JWT

Checklist específico de token JWT do
[OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html):
algoritmo de assinatura seguro (nunca aceitar `alg: none`), claims padrão
(`exp`, `aud`, `iss`) validadas, nada sensível no payload (base64 não é
criptografia), e um mecanismo real de revogação — a parte que mais gente
esquece, porque JWT "sem estado" tenta evitar consulta ao banco a cada
requisição, e revogação exige justamente isso.

## No padrão frontend

Autenticação usa `devise-jwt` — token no header `Authorization: Bearer`,
nunca cookie (ver [CSRF](/padrao-frontend/seguranca/csrf) pro porquê
dessa escolha).

**Algoritmo: HS256, o default da gem — não fixado explicitamente no
projeto**, mas isso não é o problema que o cheat sheet mais adverte
(`alg: none`/confusão de algoritmo). A gem `jwt` exige o algoritmo
explícito na verificação, então não há brecha de `none` aceito. Produção
falha ao subir sem `DEVISE_JWT_SECRET_KEY` configurado (`devise.rb`) —
não cai num segredo fraco por padrão.

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
e [XSS](/padrao-frontend/seguranca/xss). Nada novo encontrado aqui nesta
revisão além do que já estava registrado.
