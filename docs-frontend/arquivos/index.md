---
sidebar_label: Arquivos
date: "29 de agosto de 2026"
---

# Arquivos

Tudo que envolve entrada e saída de arquivo no [HTD-Front](https://github.com/juankalleo/HTD-Front): o upload de
imagem (com recorte/posicionamento antes de enviar), e a geração de relatórios
em PDF e Excel no servidor. Cada formato de export tem seu módulo completo —
motor, tipos e templates — pra "onde é PDF" e "onde é Excel" nunca dependerem
um do outro.

## Índice

| Tópico | Abrange |
|---|---|
| [Upload de imagem](UPLOAD-DE-IMAGEM.md) | Recorte/posicionamento com react-easy-crop antes do upload (padrão de todo campo de imagem) |
| [Upload de arquivos](UPLOAD-DE-ARQUIVOS.md) | Envio genérico de arquivo pra API via `FormData`/`multipart` (autenticado, sem `Content-Type` manual) |
| [Download de arquivos](DOWNLOAD-DE-ARQUIVOS.md) | Saída de binário (`Blob`) pro usuário via `baixarArquivo` — usado pelas exportações |
| [Estilos de PDF](ESTILOS-DE-PDF.md) | Templates e estilo dos relatórios em PDF (Puppeteer) |
| [Estilos de Excel](ESTILOS-DE-EXCEL.md) | Templates e estilo dos relatórios em Excel (ExcelJS) |

## Princípios comuns

- **Upload de imagem é no client, mas com limite garantido:** o arquivo é
  recortado/redimensionado antes de sair do navegador — o backend nunca
  recebe imagem fora do tamanho/enquadramento do campo. Upload de arquivo
  genérico (sem recorte) em [Upload de arquivos](UPLOAD-DE-ARQUIVOS.md).
- **Exportação (PDF/Excel) é no servidor**, via rotas únicas
  `app/api/relatorios/{pdf,excel}/route.ts` (runtime `nodejs`) — nunca no
  Client Component. A tela monta `RelatorioPdfDados`/`RelatorioExcelDados` e
  escolhe um `template` já existente. Detalhe de segurança de ambas em
  [Segurança de exportação](../seguranca/SEGURANCA-EXPORTACAO.md).
- **Preview antes de baixar:** nenhuma exportação dispara o download direto
  no clique — PDF abre em modal de preview, Excel numa página de preview dos
  dados de origem. O download em si (o `Blob` vindo da API virando arquivo no
  navegador) é centralizado em [Download de arquivos](DOWNLOAD-DE-ARQUIVOS.md).
