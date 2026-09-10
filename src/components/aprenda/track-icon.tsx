import type { TrackSlug } from "@/content/aprenda/tracks";

export type TechIconName =
  | TrackSlug
  | "api"
  | "auth"
  | "bash"
  | "cache"
  | "cloudflare"
  | "css3"
  | "eslint"
  | "forms"
  | "githubactions"
  | "html5"
  | "linux"
  | "nextjs"
  | "nginx"
  | "nodejs"
  | "postgresql"
  | "rbac"
  | "react"
  | "redis"
  | "ruby"
  | "security"
  | "swagger"
  | "table"
  | "tailwindcss"
  | "testing"
  | "vitejs"
  | "vitest";

const TRACK_ICON_BY_SLUG: Record<TrackSlug, TechIconName> = {
  docker: "docker",
  frontend: "nextjs",
  git: "git",
  javascript: "javascript",
  networking: "cloudflare",
  rails: "rails",
  sql: "postgresql",
  typescript: "typescript",
};

const ICON_SRC: Partial<Record<TechIconName, string>> = {
  bash: "/img/tech-icons/bash.svg",
  cloudflare: "/img/tech-icons/cloudflare.svg",
  css3: "/img/tech-icons/css3.svg",
  docker: "/img/tech-icons/docker.svg",
  eslint: "/img/tech-icons/eslint.svg",
  git: "/img/tech-icons/git.svg",
  githubactions: "/img/tech-icons/githubactions.svg",
  html5: "/img/tech-icons/html5.svg",
  javascript: "/img/tech-icons/javascript.svg",
  linux: "/img/tech-icons/linux.svg",
  nextjs: "/img/tech-icons/nextjs.svg",
  nginx: "/img/tech-icons/nginx.svg",
  nodejs: "/img/tech-icons/nodejs.svg",
  postgresql: "/img/tech-icons/postgresql.svg",
  rails: "/img/tech-icons/rails.svg",
  react: "/img/tech-icons/react.svg",
  redis: "/img/tech-icons/redis.svg",
  ruby: "/img/tech-icons/ruby.svg",
  swagger: "/img/tech-icons/swagger.svg",
  tailwindcss: "/img/tech-icons/tailwindcss.svg",
  typescript: "/img/tech-icons/typescript.svg",
  vitejs: "/img/tech-icons/vitejs.svg",
  vitest: "/img/tech-icons/vitest.svg",
};

function GenericConceptIcon({ name, label }: { name: TechIconName; label: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
  };

  switch (name) {
    case "api":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
        </svg>
      );
    case "auth":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...common} x="5" y="10" width="14" height="10" rx="2" />
          <path {...common} d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
        </svg>
      );
    case "cache":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <ellipse {...common} cx="12" cy="6" rx="7" ry="3" />
          <path {...common} d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );
    case "forms":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...common} x="5" y="4" width="14" height="16" rx="2" />
          <path {...common} d="M9 8h6M9 12h6M9 16h3" />
        </svg>
      );
    case "rbac":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M12 3l7 3v5c0 4.2-2.8 7.8-7 10-4.2-2.2-7-5.8-7-10V6l7-3z" />
          <path {...common} d="M9 12h6M12 9v6" />
        </svg>
      );
    case "security":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...common} d="M12 3l7 4v5c0 4-2.7 7.4-7 9-4.3-1.6-7-5-7-9V7l7-4zM9.5 12l1.7 1.7 3.5-4" />
        </svg>
      );
    case "table":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...common} x="4" y="5" width="16" height="14" rx="2" />
          <path {...common} d="M4 10h16M9 5v14M15 5v14" />
        </svg>
      );
    case "testing":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...common} cx="12" cy="12" r="8" />
          <path {...common} d="M8.5 12.5l2.2 2.2 4.8-5.4" />
        </svg>
      );
    default:
      return <span>{label.slice(0, 3).toUpperCase()}</span>;
  }
}

export function TechIcon({
  name,
  label,
  className = "",
}: {
  name: TechIconName;
  label: string;
  className?: string;
}) {
  const src = ICON_SRC[name];
  const classes = ["nexttech-tech-icon", !src && "nexttech-tech-icon--fallback", className].filter(Boolean).join(" ");

  return (
    <span className={classes} aria-hidden="true" title={label}>
      {src ? <img src={src} alt="" loading="lazy" /> : <GenericConceptIcon name={name} label={label} />}
    </span>
  );
}

export function TrackIcon({
  slug,
  label,
  className,
}: {
  slug: TrackSlug;
  label: string;
  className?: string;
}) {
  return <TechIcon name={TRACK_ICON_BY_SLUG[slug]} label={label} className={className} />;
}
