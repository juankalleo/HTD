---
video: zWARLxSSDHI
videoEn: 2oiBKSjOOFE
sidebar_label: Web Accessibility (a11y)
---

# Web Accessibility (a11y)

Práticas e padrões (como atributos ARIA) que garantem o uso do site por
pessoas com deficiências visuais ou motoras — navegação por teclado sem
mouse, leitores de tela anunciando o que está na tela, foco visível e
previsível, contraste de cor suficiente.

## No padrão frontend

Feedback de sucesso/erro e confirmação usam SweetAlert2, que já cuida de
`role`/`aria-live`/foco sozinho — o código-fonte da lib instalada define
`role="alert"`/`aria-live="polite"` pros toasts, `role="dialog"`/
`aria-live="assertive"` pros diálogos normais:

```js
// node_modules/sweetalert2/dist/sweetalert2.js
popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');
```

Todo campo de texto do padrão associa `label`/`htmlFor` corretamente via
`FormField` (ver [Formulários](/padrao-frontend/formularios)).

## Regra do padrão pra `<dialog>` nativo

Quando um componente precisa de um `<dialog>` HTML nativo em vez de
SweetAlert2 (caso do modal de recorte de imagem,
`shared/ui/sistema/image-cropper-modal.tsx`), a regra do padrão é: **abrir
sempre via `.showModal()`, nunca só com o atributo `open`**. Só
`showModal()` coloca o elemento no *top layer* do navegador — o que dá
foco preso, fechamento no Esc e `role="dialog"` implícito de graça. Um
`<dialog open>` sem `showModal()` continua um elemento de fluxo comum:
visualmente pode ficar idêntico (o DaisyUI estiliza via seletor CSS puro
em cima do atributo `open`), mas sem nenhum dos comportamentos de
acessibilidade que um diálogo modal precisa ter.

Implementação de referência:

```tsx
const dialogRef = useRef<HTMLDialogElement>(null);

useLayoutEffect(() => {
  const dialog = dialogRef.current;
  if (!dialog || !imageSrc) return;
  if (!dialog.open) dialog.showModal();
  dialog.addEventListener("close", onCancelar);
  return () => dialog.removeEventListener("close", onCancelar);
}, [imageSrc]);

// ...
<dialog ref={dialogRef} className="modal" aria-labelledby="image-cropper-titulo">
  <div className="modal-box max-w-lg">
    <h3 id="image-cropper-titulo">Posicionar imagem</h3>
```

`useLayoutEffect` (não `useEffect`) garante que `showModal()` roda antes
do primeiro paint. `aria-labelledby` dá nome acessível ao diálogo, e o
listener de `close` sincroniza o Esc (que fecha o `<dialog>` sozinho, sem
passar pelos botões React) de volta pro estado do formulário.

## Fora do escopo desta página

Ainda não fazem parte do padrão documentado: contraste de cor mínimo sob
tema customizado (cores de borda/texto configuráveis em
[Configuração institucional](/padrao-frontend/layout/configuracao-institucional)),
navegação por teclado ponta a ponta em tabela com ordenação por coluna, e
`aria-sort` no cabeçalho de tabela ordenável.
