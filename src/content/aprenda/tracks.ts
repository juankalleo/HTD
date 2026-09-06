export type TrackSlug = "git" | "javascript" | "typescript" | "networking" | "frontend" | "sql" | "rails" | "docker";

export type TrackMeta = {
  slug: TrackSlug;
  title: string;
  summary: string;
};

/**
 * As trilhas do Aprenda, na ordem do básico pro avançado — não é só
 * ordem alfabética, é a ordem que faz sentido estudar (git e JS antes de
 * qualquer framework; SQL antes de aplicar num backend real). Currículo
 * completo de cada uma está detalhado em
 * docs/superpowers/specs/2026-09-05-aprenda-design.md seção 8 — aqui é
 * só o registro que a home, o hub e as rotas de trilha/lição consultam.
 */
export const TRACKS: TrackMeta[] = [
  {
    slug: "git",
    title: "Git e controle de versão",
    summary: "Do primeiro commit a branch, merge, conflito e pull request — a base de qualquer projeto em equipe.",
  },
  {
    slug: "javascript",
    title: "JavaScript do zero",
    summary: "Variável, função, array, objeto e assíncrono — o que todo o resto do Aprenda assume que você já sabe.",
  },
  {
    slug: "typescript",
    title: "TypeScript do zero",
    summary: "Por que tipos, interface, generics e os tipos utilitários que aparecem em código Next.js/Rails real.",
  },
  {
    slug: "networking",
    title: "Redes e Internet",
    summary: "Como uma requisição realmente viaja — IP, DNS, HTTP, proxy, CDN e load balancer, com diagramas interativos.",
  },
  {
    slug: "frontend",
    title: "Frontend — Tailwind & Next.js",
    summary: "Do utility-first do Tailwind até App Router, data fetching e formulários no Next.js.",
  },
  {
    slug: "sql",
    title: "SQL e banco de dados",
    summary: "Do SELECT básico a JOIN, agregação e índice — a base por trás de qualquer ORM.",
  },
  {
    slug: "rails",
    title: "Ruby on Rails",
    summary: "Do Ruby essencial até scaffold, Devise, serializer e service object numa API REST.",
  },
  {
    slug: "docker",
    title: "Infraestrutura — Docker",
    summary: "Do Dockerfile ao docker-compose orquestrando a app construída nas outras trilhas.",
  },
];

export function getTrackMeta(slug: string): TrackMeta | undefined {
  return TRACKS.find((track) => track.slug === slug);
}
