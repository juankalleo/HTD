"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import type { ComponentProps } from "react";

const SITE_ICONS: Record<string, { src: string; label: string }> = {
  "mui.com": { src: "https://mui.com/static/favicon.ico", label: "MUI" },
  "nextjs.org": { src: "https://nextjs.org/favicon.ico", label: "Next.js" },
  "pptr.dev": { src: "https://pptr.dev/img/favicon.ico", label: "Puppeteer" },
  "tanstack.com": { src: "https://tanstack.com/favicon.png", label: "TanStack" },
  "ui.shadcn.com": { src: "https://ui.shadcn.com/apple-touch-icon.png", label: "shadcn/ui" },
  "vercel.com": { src: "https://vercel.com/favicon.ico", label: "Vercel" },
};

function siteIconFor(href: string) {
  const url = new URL(href);
  const hostname = url.hostname.replace(/^www\./, "");

  return {
    hostname,
    ...(SITE_ICONS[hostname] ?? { src: `${url.origin}/favicon.ico`, label: hostname }),
  };
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function ExternalLink({ href = "", children }: ComponentProps<"a">) {
  const icon = siteIconFor(href);

  return (
    <a className="nexttech-external-site-link" href={href} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <img
        className="nexttech-external-site-link__icon"
        src={icon.src}
        alt=""
        aria-hidden="true"
        decoding="async"
        title={icon.label}
      />
    </a>
  );
}

/**
 * Um doc linka outro doc como link relativo de arquivo (`[x](ROADMAP.md)`,
 * `[x](../ROADMAP.md)`) — é assim que fica legível/navegável tanto no editor
 * quanto no GitHub. Aqui, na wiki, a rota real é `/padrao-frontend/roadmap`
 * (minúsculo, sem `.md` — ver `src/lib/docs.ts#buildTree`), então o link
 * precisa ser reescrito: resolve o relativo contra o diretório do doc atual
 * (`basePath`, a rota da pasta que contém o slug atual) via `URL` nativo
 * (que já resolve `../` corretamente), tira o `.md` e baixa a caixa.
 */
function resolveDocHref(href: string, basePath: string): string {
  const [path, hash] = href.split("#");
  const dir = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const resolvedPath = new URL(path, `https://doc-link.invalid${dir}`).pathname.replace(/\.md$/i, "").toLowerCase();
  return hash ? `${resolvedPath}#${hash}` : resolvedPath;
}

/** Também cobre `arquivo.md#heading` — o link pode apontar pra uma seção específica de outro doc. */
function isDocLink(href: string): boolean {
  if (isExternal(href) || href.startsWith("#")) return false;
  const [path] = href.split("#");
  return path.toLowerCase().endsWith(".md");
}

function Anchor({ href = "", children, basePath, ...props }: ComponentProps<"a"> & { basePath?: string }) {
  if (isExternal(href)) {
    return <ExternalLink href={href}>{children}</ExternalLink>;
  }

  const resolvedHref = isDocLink(href) && basePath ? resolveDocHref(href, basePath) : href;

  return (
    <a href={resolvedHref} {...props}>
      {children}
    </a>
  );
}

/** `basePath`: rota da pasta que contém o doc atual (ex.: `/padrao-frontend/tecnologias`), pra resolver link relativo entre `.md`s — ver `resolveDocHref`. */
export function MarkdownView({ content, basePath }: { content: string; basePath?: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, rehypeHighlight]}
      components={{ a: (props) => <Anchor {...props} basePath={basePath} /> }}
    >
      {content}
    </ReactMarkdown>
  );
}
