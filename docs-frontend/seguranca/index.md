---
video: z-RuvnMlw34
sidebar_label: Segurança
---

# Segurança no frontend

Pasta viva que concentra tudo que é de segurança no `base-front`: autenticação,
autorização (RBAC), exportação segura (PDF/Excel) e o mapa geral de medidas.
Cada arquivo aqui é uma página própria — a árvore da sidebar acompanha a pasta,
não há nada hardcoded.

## Índice

| Tópico | Abrange |
|---|---|
| [Autenticação](autenticacao.md) | Login, logout, sessão e fluxos de recuperação/definição de senha |
| [Administração e RBAC](administracao-rbac.md) | Usuários, tipos de usuário, papéis e permissões granulares (conversa com o RBAC do Rails) |
| [Segurança em PDF](seguranca-pdf.md) | Template, sandbox do Puppeteer e download direto no clique |
| [Segurança de exportação](seguranca-exportacao.md) | PDF/Excel: auth na rota, validação Zod, escape/fórmula e preview |
| [Medidas de segurança](medidas-de-seguranca.md) | Mapa geral das medidas e dos limites conhecidos |
| [XSS](xss.md) | Escape automático do React, o único `dangerouslySetInnerHTML` do padrão, CSP como reforço |
| [CSP](csp.md) | Content-Security-Policy por nonce via `proxy.ts`, diretiva a diretiva |
| [CSRF](csrf.md) | Por que token em `localStorage` (em vez de cookie) já neutraliza CSRF clássico |
| [Cookies HttpOnly & Secure](cookies-httponly-secure.md) | Por que não se aplica hoje (zero cookie no padrão) e quando aplicaria |
| [SRI](sri.md) | Por que não se aplica (zero script/CDN externo) |
| [Clickjacking](clickjacking.md) | `frame-ancestors 'none'` + `X-Frame-Options: DENY` |
| [Cabeçalhos de Segurança HTTP](cabecalhos-de-seguranca-http.md) | O conjunto completo de headers enviado em toda rota, verificado ao vivo |
| [Sanitização de Inputs](sanitizacao-de-inputs.md) | Validação de entrada (Zod) + escape de saída (React, PDF/Excel) |
| [Poluição de Protótipo](poluicao-de-prototipo.md) | Por que não se aplica (zero merge profundo de JSON no padrão) |
| [Man-in-the-Middle](mitm.md) | HSTS, `upgrade-insecure-requests`, e por que certificate pinning não se aplica à web |
| [Política de senha](politica-de-senha.md) | `Devise.password_length` validado de verdade em `User` — tamanho aplicado nos dois lados |
| [Redefinição de senha](redefinicao-de-senha.md) | Fluxo pronto no front, endpoint não existe na API; correção do redirect pós-reset |
| [Força bruta e bloqueio](forca-bruta-e-bloqueio.md) | rack-attack real (3 camadas), mensagem sem enumeração, sem log de falha |
| [IDOR e autorização](idor-e-autorizacao.md) | Fetch-then-authorize do CanCanCan, escopo de tenant, sem log nem teste de negação |
| [Autorização automatizada](autorizacao-automatizada.md) | Por que uma matriz de teste formal fecharia o gap de cobertura da API |
| [JWT](jwt.md) | Algoritmo, claims mínimas, revogação real por `jti` — checklist do OWASP JWT |
| [Logs de auditoria](logs-de-auditoria.md) | `/logs` no front + `GET /api/v1/admin/versions` na API — payload, filtro, decisões reais de implementação |
| [Proteção da wiki](protecao-da-wiki.md) | HTTP Basic Auth via `middleware.ts` — por que o `AuthGuard` do `base-front` não serviria aqui |

## Leitura de apoio

- [OWASP — Top 10](https://owasp.org/www-project-top-ten/) — referência de onde cada tópico desta pasta se encaixa.
- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) — autenticação e sessão.
- [OWASP — Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) — autorização e IDOR.
- [OWASP — Authorization Testing Automation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html) — matriz de teste de autorização.
- [OWASP — JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html) — checklist de token JWT.
- [OWASP — Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) — fluxo de redefinição de senha.
- [OWASP — CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection) — exportação segura de PDF/Excel.
