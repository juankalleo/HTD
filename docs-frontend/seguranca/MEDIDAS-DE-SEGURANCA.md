---
video: 0RMYomgf4a8
videoEn: wUaeKEl1RCw
---

# Medidas de segurança do sistema

> Visão geral de tudo que o `base-front` faz (e deixou de fazer, de propósito)
> por segurança. Cada tópico tem um doc irmão mais detalhado — este é o mapa.

## Autenticação

- Token JWT guardado em `localStorage` (`lib/auth.ts` — `access_token` +
  cache do usuário pra exibição instantânea no header).
- Sessão de verdade vem de `useSession` (React Query) consultando
  `GET /auth/me` — o cache local **nunca** é lido como garantia de sessão
  válida.
- `AuthGuard` (`features/autenticacao/login/components/auth-guard.tsx`)
  protege telas no client. Detalhe em
  [Autenticação](AUTENTICACAO.md).

**Limite conhecido:** token em `localStorage` é legível por qualquer script
da página (XSS rouba o token). Não há refresh token silencioso no front; o
`AuthGuard` é client-only, não defesa contra acesso direto a dados — a fonte
de verdade continua sendo a api/ Rails. Detalhe do checklist JWT completo em
[JWT](JWT.md).

**Tamanho de senha validado nos dois lados** — `User` valida
`length: { within: Devise.password_length }` (mesma config,
`password_length = 6..128`, que o front espelha em
`MAX_PASSWORD_LENGTH`). Detalhe em
[Política de senha](POLITICA-DE-SENHA.md).

**Limite real na API, fora do escopo do `base-front`** (checklist OWASP
completo em [Redefinição de senha](REDEFINICAO-DE-SENHA.md)): o módulo
`:passwords` do Devise está desativado de propósito — não existe hoje
endpoint de "esqueci minha senha" nem de "trocar senha logado", só a
tela/schema prontos no front esperando a API existir.

## Autorização / RBAC

- Telas de admin gerenciam papéis e permissões granulares
  (`features/admin/papeis`, `features/admin/permissoes`) — o cadastro
  conversa com o RBAC do Rails.
- **Não há gating de UI no cliente:** nenhum item de menu/rota é escondido
  por permissão hoje. A autorização real acontece no backend Rails. Detalhe
  em [Administração e RBAC](ADMINISTRACAO-RBAC.md).

**Limite conhecido (documentado em "Próximas fases" da
[visão geral](../index.md)):** esconder rota/menu por permissão ainda não
está implementado — um usuário sem permissão simplesmente não tem o dado na
tela, mas o item de menu pode aparecer.

**Limites reais na API** (checklist OWASP completo em
[IDOR e autorização](IDOR-E-AUTORIZACAO.md) e
[Autorização automatizada](AUTORIZACAO-AUTOMATIZADA.md)): decisão de
autorização em si é sólida (todo controller reautoriza o registro
carregado contra o escopo real de tenant), mas uma negação (403) não gera
log nenhum, e nenhum teste de controller exercita um usuário restrito —
só o admin wildcard é testado em toda a suíte.

## Exportação (PDF e Excel)

As rotas `app/api/relatorios/{pdf,excel}` são as únicas do projeto que montam
arquivo a partir de dado dinâmico do browser. Defesas:

- `exigirSessaoValida` (auth contra `/auth/me`) em ambas.
- Validação Zod do corpo inteiro, com `filename` restrito por regex (sem
  `\r`/`\n` → sem header injection).
- PDF: toda interpolação via `escapeHtml` (sem `dangerouslySetInnerHTML`);
  Puppeteer com sandbox padrão.
- Excel: `valorCelulaSegura` contra injeção de fórmula (CWE-1236).
- Preview obrigatório antes do download.

Detalhe completo em [Segurança de exportação](SEGURANCA-EXPORTACAO.md); o PDF
tem doc próprio em [Segurança do PDF](SEGURANCA-PDF.md).

**Limite conhecido:** sem rate-limit nas rotas de export (fora do
`rack-attack` Rails) — abuso por usuário autenticado não é barrado.

## Login: força bruta e enumeração

- rack-attack real, três camadas (`api/config/initializers/rack_attack.rb`):
  30 tentativas/5min por IP, 8/15min por e-mail, banimento de 1h a partir
  de 10 tentativas/1min por IP.
- Mensagem de erro de login já genérica — `"Email ou senha inválidos."`
  tanto pra senha errada quanto pra e-mail inexistente.

**Limites reais** (checklist completo em
[Força bruta e bloqueio](FORCA-BRUTA-E-BLOQUEIO.md)): sem MFA em lugar
nenhum do projeto; nenhuma tentativa de login falha, bloqueio de
rack-attack ou negação de autorização gera log — `Rails.logger` só é
chamado pra erro interno (banco, parse), nunca pra evento de segurança.

## Auditoria de dado

O PaperTrail grava `create`/`update`/`destroy` de todo registro do
projeto (`has_paper_trail` em `ApplicationRecord`) — exposto, só leitura,
em `/logs` (front) e `GET /api/v1/admin/versions` (API), com filtro por
tipo de registro/ação e visualização do payload completo por item.
Detalhe completo, incluindo as decisões reais de implementação, em
[Logs de auditoria](LOGS-DE-AUDITORIA.md).

## Proteção da própria wiki

Este site (`WIKI-NEXT`), separado do `base-front`, usa HTTP Basic Auth
via `middleware.ts` próprio — falha fechada em produção sem credencial
configurada, comparação resistente a timing attack. Diferente do
`AuthGuard` do `base-front` (client-side, funciona porque o dado
protegido chega depois via `fetch` condicional), o conteúdo desta wiki já
está completo no HTML da primeira resposta — por isso a checagem aqui é
**server-side**, não client-side. Detalhe completo em
[Proteção da wiki](PROTECAO-DA-WIKI.md).

## Cabeçalhos e plataforma

- CSP por nonce (`proxy.ts`) + `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`,
  `Permissions-Policy` (`next.config.ts`) em toda rota. Detalhe item a item
  em [Cabeçalhos de Segurança HTTP](cabecalhos-de-seguranca-http.md), com
  página própria pra [CSP](csp.md), [Clickjacking](clickjacking.md) e
  [MitM](mitm.md).
- **Sem `app/api/*`** exceto as duas rotas de exportação (motivo técnico:
  gerar PDF/Excel precisa de runtime Node, que só o Next oferece).

## Resumo dos limites (para não esconder)

| Medida | Estado |
|---|---|
| Auth (token + `/auth/me`) | ✅ nas rotas de export |
| RBAC no backend | ✅ (Rails) |
| RBAC na UI (esconder menu) | ❌ não implementado |
| Escape de HTML no PDF | ✅ |
| Defesa de fórmula no Excel | ✅ |
| `filename` seguro (sem header injection) | ✅ (Zod) |
| Preview antes de baixar | ✅ |
| CSP / security headers | ✅ (`proxy.ts` + `next.config.ts`) |
| Rate-limit de export | ❌ fora do escopo (Rails) |
| Rate-limit de login (rack-attack) | ✅ (Rails, 3 camadas) |
| Mensagem de login sem enumeração | ✅ |
| MFA | ❌ não implementado |
| Log de falha de login/autorização negada | ❌ não implementado (Rails) |
| Tamanho de senha aplicado no backend | ✅ (Rails, `Devise.password_length`) |
| Endpoint de "esqueci minha senha" | ❌ não existe (Rails) |
| Teste de controller com usuário restrito | ❌ só o admin wildcard é testado (Rails) |
| Revogação de JWT no logout | ✅ (`jti` real, não `Null`) |
| Tela de logs de auditoria (PaperTrail) | ✅ `/logs` no front, `GET /api/v1/admin/versions` na API |
| Autenticação na própria wiki (`WIKI-NEXT`) | ✅ HTTP Basic Auth via `middleware.ts` |

## Leitura de apoio

- [OWASP — Top 10](https://owasp.org/www-project-top-ten/) — mapeia onde cada medida desta página se encaixa (A01, A05, A07…).
- [OWASP — XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) — defesa contra token/script injection.
- [OWASP — CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection) — injeção de fórmula no Excel exportado.
