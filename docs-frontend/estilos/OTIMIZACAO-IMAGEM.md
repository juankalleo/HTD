---
video: xkkSiYitZbM
videoEn: IU_qq_c_lKA
---

# Otimização de imagem

**O que é:** reduzir peso e latência de imagem (avatar, logo, ilustração) sem perder qualidade — o Next.js entrega isso nativo via `next/image`, que faz resize, conversão pra formato moderno (WebP/AVIF) e lazy-load automático.

## Padrão adotado (quando a imagem é estática/local)

Use sempre `next/image` em vez de `<img>`:

```tsx
import Image from "next/image";

<Image src="/logo.svg" alt="Logo" width={120} height={40} priority />;
```

`priority` só em imagem above-the-fold (logo, hero); o resto fica com lazy-load implícito.

## Realidade do base-front: imagens vêm da API (host dinâmico)

No `base-front` avatar/logo vêm do backend via `NEXT_PUBLIC_API_URL` — host que muda por ambiente, então `next/image` (que exige domínio fixo em `next.config.ts` `images.remotePatterns`) não é usado. O código usa `<img>` consciente, com `eslint-disable` justificado (`features/admin/config-institucional/components/identidade-form.tsx`):

```tsx
// eslint-disable-next-line @next/next/no-img-element -- vem da API (host dinâmico via NEXT_PUBLIC_API_URL), next/image exige domínio fixo em next.config
<img src={urlDaApi} alt="Logo" />
```

**Padrão a seguir** caso a imagem seja de host conhecido (ex.: CDN fixa): registrar o domínio em `next.config.ts` e voltar pro `next/image`:

```ts
// next.config.ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "cdn.empresa.com" }],
}
```

## Outras regras

- Imagem de UI decorativa (ícone, logo de marca) prefere **SVG inline** ou `next/image` com `width`/`height` fixos pra não causar layout shift (CLS).
- `sizes` deve ser informado em `next/image` responsivo pra o Next escolher a resolução certa.
- Nunca passar `<img>` de host estático sem `width`/`height` — causa CLS e piora Core Web Vitals (que o `eslint-config-next` já fiscaliza).

**Convenção:** `next/image` é o padrão; `<img>` é exceção documentada só para host dinâmico da API, com `eslint-disable` e comentário explicando o porquê.

## Leitura de apoio

- [Next.js — Image component (docs)](https://nextjs.org/docs/app/api-reference/components/image) — resize, WebP/AVIF, lazy-load e `priority`.
- [Next.js Image optimization (LogRocket)](https://blog.logrocket.com/next-js-automatic-image-optimization-next-image/) — por que `next/image` melhora Core Web Vitals (CLS, lazy-load).
- [DebugBear — Next.js Image Optimization](https://www.debugbear.com/blog/nextjs-image-optimization) — formatos modernos e `sizes`/`priority`.
