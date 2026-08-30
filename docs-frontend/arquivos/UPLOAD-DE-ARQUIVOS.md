---
video: G5UZmvkLWSQ
videoEn: 83bECYmPbI4
---

# Upload de arquivos (geral)

Mecanismo de **entrada** de binário pra API: enviar um arquivo qualquer
(documento, CSV, anexo) do cliente pro servidor Rails (`api/`) via
`multipart/form-data`. Distinto do
[Upload de imagem](../arquivos/UPLOAD-DE-IMAGEM.md), que é o caso específico
de **imagem com recorte/posicionamento antes** de sair do navegador — aqui o
arquivo vai "cru" (posicionamento não faz sentido pra um PDF ou planilha), mas
o transporte é o mesmo padrão de `FormData`.

## O problema que isso resolve

Enviar arquivo por `fetch` exige `multipart/form-data` (o `Content-Type`
precisa de um `boundary` que só o `FormData` monta). Mandar JSON com o arquivo
codificado não funciona com o ActiveStorage do lado da api/, e setar
`Content-Type` na mão quebra o boundary. O padrão do projeto deixa o browser
montar tudo a partir de um `FormData`, e o token de sessão vai no header como
em qualquer outra requisição autenticada.

## O padrão: `FormData` + `fetch` (`services/api-institucional.ts`)

```ts
export async function updateConfiguracaoInstitucionalAdmin(id: number, formData: FormData): Promise<ConfiguracaoInstitucional> {
  const token = getAccessToken();
  if (!token) throw new ConfiguracaoInstitucionalApiError("Sem sessão.", 401);

  const response = await fetch(`${BASE_URL}/api/v1/admin/c_configuracoes/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` }, // só o token; NUNCA defina Content-Type
    body: formData,                                // browser monta o multipart/boundary
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ConfiguracaoInstitucionalApiError(extrairMensagem(payload, "Não foi possível salvar a configuração."), response.status);
  }
  return (payload as { data: ConfiguracaoInstitucional }).data;
}
```

### Montando o `FormData` na tela

```ts
const formData = new FormData();
formData.append("config[nome_sistema]", nomeSistema);          // campo textual junto, se houver
formData.append("config[icone_sistema]", arquivoSelecionado);  // File vindo do <input type="file">
formData.append("config[imagem_fundo_login]", arquivoFundo);

await updateConfiguracaoInstitucionalAdmin(id, formData);
```

- `File` vem direto do `<input type="file">` (ou do `File` já processado pelo
  recorte de imagem — ver [Upload de imagem](../arquivos/UPLOAD-DE-IMAGEM.md)).
- `formData.append(nome, arquivo)` aceita `File`/`Blob` sem conversão; o
  browser cuida do `boundary` do multipart.
- **Não** setar `Content-Type` manualmente: o `fetch` infere
  `multipart/form-data; boundary=...` a partir do `FormData`. Setar na mão
  apaga o boundary e a api/ rejeita o upload.
- Autenticação é o `Bearer` no header, igual a `GET`/`POST` JSON — o
  `FormData` só troca o `body`.

## Validação antes de enviar

O `base-front` valida tamanho de arquivo **no client antes** do envio (ex.:
`TAMANHO_MAXIMO_ARQUIVO_MB` no upload de imagem). Para arquivos não-imagem, a
mesma ideia se aplica: checar `arquivo.size` e o tipo (`arquivo.type`) antes de
montar o `FormData`, pra não desperdiçar uma requisição que a api/ rejeitaria
de qualquer forma.

## Quando usar

- **Arquivo genérico pra api/** (documento, planilha, anexo, binário qualquer):
  `FormData` + `fetch` autenticado, sem `Content-Type` manual.
- **Só imagem com enquadramento**: use o fluxo de
  [Upload de imagem](../arquivos/UPLOAD-DE-IMAGEM.md) (recorte via
  react-easy-crop antes do `FormData`).

## Convenção do projeto

- Upload pra api/ é sempre `FormData`/`multipart` — nunca JSON com arquivo
  embutido.
- `Content-Type` nunca é definido à mão num upload de arquivo.
- Token de sessão (`Bearer`) vai no header, independente do formato do body.
- Validação de tamanho/tipo ocorre no client antes de montar/ enviar o
  `FormData`.

## Leitura de apoio

- [MDN — FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) — `append` de campos e `File`.
- [MDN — Using FormData objects](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects) — por que o browser monta o `boundary`.
- [Upload de imagem](../arquivos/UPLOAD-DE-IMAGEM.md) — o caso de imagem (recorte antes do mesmo `FormData`).
