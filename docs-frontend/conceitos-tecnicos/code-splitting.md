---
video: fB4vG3MmuDo
videoEn: JU6sl_yyZqs
sidebar_label: Code Splitting
---

# Code Splitting

Divisão do código da aplicação em pedaços menores (bundles) carregados sob
demanda, acelerando o carregamento inicial da página. Em vez de mandar
pro navegador um único arquivo JavaScript com tudo, o bundler quebra em
pedaços (chunks) que só são baixados quando aquela parte da tela é
realmente necessária.

## No padrão frontend

Next.js já faz code splitting automático **por rota** — cada página só
carrega o que a própria rota importa, sem configuração manual. Isso já
mantém dependências pesadas (como `echarts`, usado só nas telas de
relatório) fora do bundle de todo o resto do app.

Pra dentro de uma mesma rota, o padrão é usar `next/dynamic` em qualquer
componente **client-only, pesado e condicional** — que só aparece atrás de
uma interação, não no primeiro paint da tela. Exemplo real: o modal de
recorte de imagem (`shared/ui/sistema/image-cropper-modal.tsx`, que
empacota a lib `react-easy-crop`) só é usado quando alguém escolhe um
arquivo em Identidade institucional. Em vez de importar estático, o
formulário importa o modal assim:

```tsx
import dynamic from "next/dynamic";

const ImageCropperModal = dynamic(
  () => import("@/shared/ui/sistema/image-cropper-modal").then((modulo) => modulo.ImageCropperModal),
  { ssr: false },
);
```

`ssr: false` porque esse componente só faz sentido no navegador (usa
`document.body`/`createPortal`, `URL.createObjectURL`) — sem isso o Next
tentaria renderizá-lo no servidor à toa. O import aponta pro arquivo
direto (não pelo barrel compartilhado `@/shared/ui`), pra garantir que o
bundler consiga isolar esse chunk de verdade.

Componente sempre visível na tela **não** entra nesse padrão — só
adicionaria uma etapa de carregamento sem necessidade. `next/dynamic` é
reservado pra quando a condição "só aparece atrás de uma interação" é
real.
