---
video: 2LYPyUk-L0k
videoEn: EoaDgUgS6QA
sidebar_label: XSS
date: "29 de agosto de 2026"
---

# XSS (Cross-Site Scripting)

Vulnerabilidade onde um invasor injeta scripts maliciosos (geralmente
JavaScript) em páginas web visualizadas por outros usuários. O script
injetado roda com o mesmo acesso que a página legítima tem — pode ler o
que está em `localStorage`, imitar cliques, exfiltrar dado pra um servidor
externo.

## No padrão frontend

A primeira e principal defesa é estrutural, não uma medida extra: o React
escapa automaticamente todo valor interpolado via `{variavel}` no JSX —
texto de usuário nunca vira HTML executável a menos que o código
explicitamente peça o contrário via `dangerouslySetInnerHTML`. Esse escape
de saída é o padrão de **todo** componente do projeto, não algo que
precisa ser lembrado caso a caso.

`dangerouslySetInnerHTML` aparece em **um único lugar** do padrão —
`app/layout.tsx`, e é uma string estática (o script de tema), sem
interpolação de nenhum dado dinâmico ou vindo do usuário:

```tsx
const THEME_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("theme");
    if (stored) document.documentElement.setAttribute("data-theme", stored);
  } catch (e) {}
})();
`;
```

A única tela que monta HTML a partir de dado dinâmico de verdade é a
exportação de PDF (Puppeteer renderiza HTML de verdade) — lá, todo valor
interpolado passa por escape explícito (`escapeHtml`/`valorHtml`), testado
ao vivo com payload de XSS real contra a rota rodando: o texto malicioso
aparece literal no PDF, nunca executa. Detalhe completo em
[Segurança de exportação](seguranca-exportacao.md).

Como camada extra — não a primeira linha de defesa, mas defesa em
profundidade — o `Content-Security-Policy` (ver [CSP](csp.md)) restringe
`script-src` a scripts com um nonce válido por requisição. Mesmo num
cenário hipotético onde uma injeção conseguisse passar pelo escape do
React, o navegador ainda recusaria executar um `<script>` sem o nonce
correto.
