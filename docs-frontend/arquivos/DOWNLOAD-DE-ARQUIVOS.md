---
video: J6qZ14Ugz7A
videoEn: 6T_tiHBEvq8
date: "29 de agosto de 2026"
---

# Download de arquivos

Mecanismo de **saída** de binário pro usuário: o servidor gera o arquivo
(geralmente via exportação) e o client dispara o download no navegador. No
[HTD-Front](https://github.com/juankalleo/HTD-Front) isso é feito por **uma única função genérica** — ela não sabe se é
PDF, Excel ou outro formato, só recebe o `Blob` pronto e o nome do arquivo.

## O problema que isso resolve

Exportações (relatórios em PDF/Excel) nascem no servidor como um `Blob`. O
navegador não baixa um `Blob` sozinho — é preciso transformá-lo numa URL
temporária e simular um clique num link. Ter esse passo duplicado em cada
tela de relatório espalharia a mesma lógica frágil (e o vazamento de memória
por esquecer de revogar a URL) por todo o projeto. Por isso existe
`lib/download-arquivo.ts`: um lugar só.

## A função: `baixarArquivo` (`lib/download-arquivo.ts`)

```ts
export function baixarArquivo(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
```

- `URL.createObjectURL(blob)` cria uma URL temporária (`blob:...`) que aponta
  pro binário na memória do navegador.
- `<a download>` força o navegador a baixar (e sugerir `filename`) em vez de
  tentar abrir o tipo no próprio browser.
- `URL.revokeObjectURL(url)` libera a memória — **obrigatório**, senão cada
  download vaza uma referência até recarregar a página. Por isso a função faz
  tudo num lugar e ninguém precisa se lembrar desse detalhe.

## O padrão de ponta a ponta

Os serviços de relatório devolvem o `Blob` cru da API e repassam pra essa
função — a tela nunca monta a URL nem o `<a>`:

```ts
// services/api-relatorio-pdf.ts
export async function gerarRelatorioPdf(template, dados): Promise<Blob> {
  const response = await fetch("/api/relatorios/pdf", { method: "POST", /* ... */ });
  if (!response.ok) throw new Error("Não foi possível gerar o PDF do relatório.");
  return response.blob();
}
```

```ts
// na tela (Client Component)
const blob = await gerarRelatorioUsuariosPdf(payload); // Promise<Blob>
baixarArquivo(blob, "relatorio-usuarios.pdf");
```

Quem chama decide o `filename` (vem do próprio payload de dados do relatório,
ex.: `"relatorio-usuarios.pdf"`); a função de download só respeita o que
recebe. Detalhe de cada formato em
[Estilos de PDF](../arquivos/ESTILOS-DE-PDF.md) e
[Estilos de Excel](../arquivos/ESTILOS-DE-EXCEL.md).

## Quando usar

- **Download de binário vindo da API** (relatórios, anexos, exports): sempre
  `baixarArquivo(blob, nome)`.
- **Imagem que já tem URL** (ex.: `imagem_fundo_login_url` da identidade
  institucional): não é download — é só `<img src={url}>`. O `Blob`/object
  URL só entra quando o dado nasce no client ou vem como resposta binária.
- **Preview antes de baixar:** nenhuma exportação dispara o download direto
  no clique — PDF abre em modal de preview, Excel numa página de preview dos
  dados de origem (ver [Arquivos](../arquivos/index.md)).

## Convenção do projeto

- `baixarArquivo` é a **única** forma de baixar um `Blob` no client — telas
  não criam `URL.createObjectURL` por conta própria.
- O `filename` é definido por quem pede o relatório, nunca hardcoded dentro
  de `lib/download-arquivo.ts`.
- Revogar a object URL é responsabilidade da função, não de quem chama.

## Leitura de apoio

- [MDN — URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) — ciclo de vida da object URL e por que revogar.
- [MDN — HTMLAnchorElement.download](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/download) — forçar download em vez de navegação.
- [MDN — Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) — o tipo retornado por `response.blob()`.
