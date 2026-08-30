---
video: GYG_4YMs8RA
videoEn: aQxk5NCE15w
---

# Segurança de exportação (PDF e Excel)

> As duas rotas de exportação (`app/api/relatorios/pdf/route.ts` e
> `app/api/relatorios/excel/route.ts`) são exceções ao "sem `app/api/*`" do
> projeto e o único lugar onde o front monta arquivo a partir de dado
> dinâmico vindo do browser. Este documento é o registro do que foi verificado
> (não só implementado) e o porquê de cada decisão. O PDF tem um doc irmão mais
> específico em [Segurança do PDF](../seguranca/SEGURANCA-PDF.md).

## Fluxo

```
Cliente (já tem os dados na tela)
   │  monta Relatorio{Pdf,Excel}Dados + escolhe template
   ▼
POST /api/relatorios/{pdf,excel}  (runtime nodejs, rota única e genérica)
   │  1. exigirSessaoValida(request)        ← autenticação
   │  2. valida corpo inteiro (Zod)          ← forma + filename
   │  3. escolhe template, monta o arquivo
   ▼
bytes do arquivo de volta pro browser (Content-Disposition: attachment)
```

## 1. Autenticação — nenhuma rota abre sem sessão

Ambas as rotas chamam `lib/server/auth-guard.ts#exigirSessaoValida` antes de
qualquer coisa. Ela exige `Authorization: Bearer <token>` e confirma contra
`GET /auth/me` na api/ de verdade (mesma fonte de verdade que
`fetchCurrentUser`) — nunca decide "válido" só pela presença do header. Em
modo fake (sem `NEXT_PUBLIC_API_URL`) aceita o mesmo `AUTH_FAKE_TOKEN` que o
resto do app. Sem token → `401`; com token inválido → `401`.

Puppeteer (PDF) e ExcelJS (Excel) são caros em recurso — deixar a rota aberta
é abuso de recurso (DoS barato) independente de payload. A autenticação fecha
o abuso *anônimo*.

## 2. Validação na fronteira — Zod, não só `as Tipo`

O corpo vem do browser de quem chamou; antes era só um cast de TypeScript
(`as RelatorioPdfDados`), que não confere nada em runtime. Agora
`lib/server/relatorio-{pdf,excel}/request-schema.ts` valida a forma inteira:
`template` só aceita os valores reais (`simples`/`institucional`) — não há
fallback pra template desconhecido, é `400`.

**`filename` é tratado à parte:** vira o valor de um header HTTP
(`Content-Disposition: attachment; filename="..."`). Escapar HTML **não**
protege header — um `filename` com `\r\n` poderia injetar headers novos
(response splitting). A defesa não é escapar depois, é **rejeitar na
validação**: `filename` só aceita `/^[\w.-]+\.(pdf|xlsx)$/` — qualquer
`\r`/`\n`/espaço/barra nem passa do Zod. Verificado ao vivo: `filename` com
`\r\nX-Injected: evil` → `400`.

## 3. Conteúdo dinâmico — duas ameaças diferentes

### PDF — injeção de HTML/script (CWE-79)

Todo template (`lib/server/relatorio-pdf/templates/*.ts`) interpola dado via
`escapeHtml`/`valorHtml` (`html-utils.ts`) — título, filtros, KPI, colunas,
linhas, marca, emissor. Zero exceção. Sem `dangerouslySetInnerHTML`. O
Puppeteer roda com sandbox padrão (`--no-sandbox` nunca é passado) e sem
`page.exposeFunction` — mesmo que algo escapasse e executasse JS na página,
não há ponte pro processo host. Detalhe + teste real em
[Segurança do PDF](../seguranca/SEGURANCA-PDF.md).

### Excel — injeção de fórmula (CWE-1236)

Ameaça **específica de planilha**, não coberta pelo `escapeHtml` do PDF: se
uma célula começa com `=`, `+`, `-`, `@` (ou tab/CR), o Excel pode interpretar
como fórmula ao abrir — um `nome` como
`=HYPERLINK("http://evil.com","clique")` executaria. A defesa
(`lib/server/relatorio-excel/cell-utils.ts#valorCelulaSegura`) prefixa `'`
(apóstrofo) em qualquer valor que comece com esses caracteres — o Excel trata
como "forçar texto", mostra o conteúdo original mas nunca calcula. Todo valor
de `dados.rows`/`dados.columns` passa por ela; nunca se escreve
`cell.value = row[coluna.key]` direto.

## 4. Preview antes de baixar

Nenhuma exportação dispara o download direto no clique:

- **PDF:** `PdfPreviewModal` (`shared/ui/relatorios/`) abre o PDF num
  `<iframe>` antes de salvar; o download só acontece se o admin clicar
  "Baixar" dentro do modal.
- **Excel:** página de preview própria por relatório
  (`features/relatorios/<relatorio>/components/<relatorio>-excel-preview-page.tsx`)
  mostra os dados de origem numa tabela e só chama a rota quando o admin
  confirma "Baixar Excel".

Motivo duplo: UX (ver o documento antes) e segurança prática (pega dado errado
/ filtro errado antes de virar arquivo salvo e compartilhado).

## O que NÃO é coberto (limite real)

- **Rate limiting.** As rotas vivem no processo Next.js, fora do `rack-attack`
  que protege a api/ Rails. Um usuário autenticado ainda pode gerar arquivos
  em sequência rápida — a autenticação (item 1) fecha o abuso *anônimo*, não o
  de usuário legítimo automatizando. Não implementado por falta de cache
  compartilhado (Redis) no front; entra como item novo se virar problema real.
- **Validação de tamanho de `rows`/`kpis` no Zod:** o schema hoje aceita
  arrays de qualquer tamanho — um payload gigante de `rows` passa pela
  validação (embora o Chromium/ExcelJS limite o tamanho do arquivo na
   prática). Se houver ataque de tamanho, o Zod ganha um `.max()`.

## Leitura de apoio

- [OWASP — CSV Injection (formula injection em Excel)](https://owasp.org/www-community/attacks/CSV_Injection) — por que prefixar `'` em célula que começa com `=`, `+`, `-`, `@`.
- [CWE-1236: Improper Neutralization of Formula Elements in a CSV File](https://cwe.mitre.org/data/definitions/1236) — classificação da injeção de fórmula.
- [OWASP — XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) — por que todo dado interpolado no HTML do PDF passa por escape.
