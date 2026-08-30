---
video: AoU7aEdTldE
videoEn: 9VgghGKx_1c
---

# Segurança do PDF de relatório

> `app/api/relatorios/pdf/route.ts` é a única rota deste projeto que
> monta HTML a partir de dado dinâmico e manda pra um motor de renderização
> (Puppeteer/Chromium) — é exatamente o tipo de lugar onde injeção de
> HTML/script, abuso de recurso e vazamento de rota costumam entrar. Este
> documento é o registro do que foi verificado (não só implementado — os
> três pontos abaixo têm teste real feito contra o servidor rodando, não
> só leitura de código) e o porquê de cada decisão.

## 1. Toda interpolação passa por escape — testado com payload de ataque real

Nenhum template (`lib/server/relatorio-pdf/templates/*.ts`) interpola dado
dinâmico direto na string de HTML. Tudo passa por `escapeHtml`/`valorHtml`
(`lib/server/relatorio-pdf/html-utils.ts`) antes de entrar — título,
subtítulo, filtros, label/valor de KPI, label de coluna, valor de célula,
nome/URL de marca, nome/contexto de emissor. Zero exceção, checado nos
dois templates.

**Verificado ao vivo** (não só lido o código): POST direto pra rota com
`title`/`kpi.label`/`kpi.value`/`row` carregando `<script>alert(1)</script>`,
`<img src=x onerror=alert(1)>` e um `"><script>alert(2)</script>` (tentativa
clássica de escapar de um atributo). PDF gerado normalmente (200), sem
crash — e o texto malicioso aparece **literal**, como texto visível na
página, nunca executado (sem diálogo de alerta, sem imagem quebrada
tentando carregar, sem novo elemento renderizado). `escapeHtml` troca
`& < > " '`, que é exatamente o que impede as duas formas de fuga: fechar
uma tag (`<`/`>`) e fechar um atributo (`"`/`'`).

## 2. Autenticação — a rota não fazia nenhuma antes

**Achado real (não hipotético):** até esta revisão, `POST
/api/relatorios/pdf` não conferia sessão nenhuma — qualquer requisição
que alcançasse o servidor Next.js gerava um PDF via Puppeteer, autenticado
ou não. Puppeteer é caro (processo Chromium, CPU/memória, alguns segundos
por request) — deixar isso aberto é abuso de recurso (DoS barato) na cara,
independente de qualquer payload malicioso no conteúdo.

Corrigido com `lib/server/auth-guard.ts#exigirSessaoValida`: exige header
`Authorization: Bearer <token>` e confirma contra `GET /auth/me` na api/
real (mesma fonte de verdade que `fetchCurrentUser` usa em qualquer outra
tela) antes de qualquer coisa. Em modo fake (sem `NEXT_PUBLIC_API_URL`),
aceita o mesmo `AUTH_FAKE_TOKEN` que o resto do app aceita nesse modo —
não fica nem mais nem menos permissivo que o resto do projeto.

**Verificado ao vivo**: POST sem header `Authorization` → `401`. POST com
token inventado (`Bearer garbage`) → `401` (confirma que não é só
"existe o header", é validado de verdade contra a api/). POST com token
real de sessão válida → `200`, PDF de verdade.

`services/api-relatorio-pdf.ts#gerarRelatorioPdf` manda o token
(`getAccessToken()`) em todo POST — sem isso, todo export de PDF quebraria
com 401 a partir de agora.

## 3. Validação do payload — Zod na fronteira, não só `as Tipo`

Antes, o corpo da requisição era só `(await request.json()) as
RelatorioPdfDados` — um cast de TypeScript, que não confere **nada** em
runtime. Qualquer payload malformado (tipo errado, campo faltando, string
gigante) passava direto pros templates, que assumiam a forma certa —
exceção não tratada = 500, ou pior, comportamento indefinido.

`lib/server/relatorio-pdf/request-schema.ts#relatorioPdfRequestSchema`
(Zod) valida a forma inteira antes de chamar qualquer template.
`template` só aceita os dois valores reais (`simples`/`institucional`) —
não existe fallback pra "template desconhecido", é rejeitado com `400`.

**`filename` merece atenção especial**: vira o valor de um header HTTP
(`Content-Disposition: attachment; filename="..."`). `escapeHtml` (que
neutraliza HTML) **não protege header HTTP** — um `filename` com `\r\n`
poderia, em teoria, injetar headers novos na resposta (response splitting).
A defesa aqui não é escapar depois, é **rejeitar na validação**:
`filename` só aceita `/^[\w.-]+\.pdf$/` (letras, números, `_`, `-`, `.`,
terminando em `.pdf`) — qualquer `\r`/`\n`/espaço/barra nem passa do Zod.

**Verificado ao vivo**: `filename` com `\r\nX-Injected: evil` → `400`,
rejeitado no Zod antes de qualquer header ser montado. `template:
"hackerman"` → `400` com a lista dos valores válidos no erro.

## 4. Preview antes de baixar

`shared/ui/relatorios/pdf-preview-modal.tsx` — todo "Exportar PDF" abre
um modal com o PDF de verdade num `<iframe>` (o navegador usa o próprio
visualizador de PDF nativo) **antes** de qualquer coisa ser salva no
disco do usuário. O download em si só acontece se o admin clicar "Baixar
PDF" dentro do modal — `baixarRelatorioPdf` nunca é chamado
automaticamente depois de gerar o blob.

Motivo duplo: (1) UX óbvia — ver o documento antes de decidir se é o
certo; (2) segurança prática — um PDF gerado com dado errado/inesperado
(filtro errado, campo vazio) é pego na hora, antes de virar um arquivo
salvo e possivelmente compartilhado.

```tsx
const { exportar, isExporting, preview, fecharPreview } = useExportarRelatorioUsuariosPdf();
// ...
<PdfPreviewModal blob={preview} filename="relatorio-usuarios.pdf" onClose={fecharPreview} />
```

Reusável — qualquer relatório novo usa o mesmo componente (ver
`../arquivos/ESTILOS-DE-PDF.md`), só muda o hook que gera o blob e guarda em
estado em vez de baixar direto.

## O que isso NÃO cobre (limite real, não escondido)

- **Rate limiting.** Esta rota vive no processo Next.js, fora do
  `rack-attack` que protege a api/ Rails (ver `api/CLAUDE.md`, 0.9). Um
  usuário autenticado ainda pode gerar PDFs em sequência rápida — a
  autenticação (item 2) fecha o abuso *anônimo*, não o de um usuário
  legítimo automatizando requisições. Não implementado agora por falta de
  cache compartilhado (Redis) disponível no front; se isso virar problema
  real, entra como item novo, não suposição.
- **Sandbox do Chromium.** `puppeteer.launch({ headless: true })` não
  desliga o sandbox padrão (`--no-sandbox` nunca é passado) nem expõe
  binding nenhum de Node pro contexto da página (`page.exposeFunction`
  nunca é chamado) — mesmo que uma string escapasse do escape (item 1) e
  executasse JS dentro da página renderizada, não haveria ponte pro
  processo host. Isso é uma característica de como o motor já está
  configurado, não uma camada extra adicionada — vale saber que existe,
   mas a defesa real continua sendo o escape do item 1.

## Leitura de apoio

- [OWASP — XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) — por que `escapeHtml` em toda interpolação é a defesa real.
- [Puppeteer — Sandbox (docs)](https://pptr.dev/guides/configuration) — o sandbox padrão do Chromium e por que nunca passar `--no-sandbox`.
- [OWASP — Top 10 (A05: Security Misconfiguration)](https://owasp.org/www-project-top-ten/) — a rota de export aberta sem auth era exatamente essa falha.
