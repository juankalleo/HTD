import type { ReactNode } from "react";

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

export function ExternalSiteLink({ href, children }: { href: string; children: ReactNode }) {
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
