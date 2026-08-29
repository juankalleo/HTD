---
video: lIPhz8SlwAg
---

# Modal

> O `base-front` **não tem um componente de modal genérico**. Há dois padrões
> consagrados no projeto — confirmação (SweetAlert2) e modal customizado
> (DaisyUI `<dialog>` + portal) — e qualquer modal novo segue um deles.

## 1. Confirmação / ação destrutiva — `confirmDialog`

`shared/ui/sistema/confirm-dialog.ts`. Wrapper sobre SweetAlert2, com tema
DaisyUI aplicado via `customClass` (não usa o estilo padrão da lib). Dois
variantes de botão: `default` (primário) e `destructive` (erro, pra exclusão).

```ts
import { confirmDialog } from "@/shared/ui/sistema/confirm-dialog";

const ok = await confirmDialog({
  title: "Excluir usuário?",
  text: "Esta ação não pode ser desfeita.",
  confirmVariant: "destructive",
  confirmButtonText: "Excluir",
});
if (ok) {
  // segue com a mutation
}
```

`showConfirmDialog(...)` devolve o `SweetAlertResult` cru (quando precisa
saber qual botão foi clicado além do `isConfirmed`). Botões em
`flex-row-reverse` (Cancelar à esquerda), foco parte do Cancelar quando há
botão de cancelar.

## 2. Modal customizado — `<dialog>` DaisyUI + `createPortal`

Para qualquer conteúdo que não é só confirmar/cancelar (ex.: recorte de
imagem, preview), usa-se o `<dialog class="modal">` do DaisyUI
(`modal-box`, `modal-action`, backdrop com `<form method="dialog">`).

**Gotcha obrigatório (já resolvido em `ImageCropperModal`):**
`shared/ui/sistema/image-cropper-modal.tsx` renderiza via
`createPortal(..., document.body)`. Um modal desse tipo costuma ser aberto
**de dentro de uma tela que já é um `<form>`** (ex.: `IdentidadeForm`). O
backdrop do DaisyUI usa `<form method="dialog">`, e `<form>` dentro de
`<form>` é HTML inválido → erro de hidratação (`<form> cannot be a descendant
of <form>`). O portal joga o `<dialog>` pro fim do `<body>`, fora de qualquer
formulário. **Qualquer modal novo que use `<form method="dialog">` (ou
qualquer `<form>` interno) e possa abrir de dentro de uma tela com formulário
segue o mesmo padrão.**

Exemplo real completo: recorte de imagem em
[`arquivos/UPLOAD-DE-IMAGEM.md`](../arquivos/UPLOAD-DE-IMAGEM.md).

```tsx
"use client";
import { createPortal } from "react-dom";

function MeuModal({ onClose }: { onClose: () => void }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold text-base-content">Título</h3>
        {/* conteúdo */}
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Fechar</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>fechar</button>
      </form>
    </dialog>,
    document.body,
  );
}
```

## Quando usar qual

- **Sim/Não com texto** → `confirmDialog` (uma linha, sem JSX).
- **Conteúdo rico / interação** (crop, preview, formulário inline) →
  `<dialog>` + portal.
- **Preview de PDF** → `PdfPreviewModal` (`shared/ui/relatorios/`), que também
  segue o padrão de modal próprio (ver
  [Segurança de exportação](../seguranca/SEGURANCA-EXPORTACAO.md)).
