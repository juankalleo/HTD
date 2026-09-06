export type TrackSlug = "frontend" | "rails" | "docker";

export type TrackMeta = {
  slug: TrackSlug;
  title: string;
  summary: string;
};

/**
 * As 3 trilhas do Aprenda. Currículo completo de cada uma está detalhado
 * em docs/superpowers/specs/2026-09-05-aprenda-design.md seção 8 — aqui é
 * só o registro que a home, o hub e as rotas de trilha/lição consultam.
 */
export const TRACKS: TrackMeta[] = [
  {
    slug: "frontend",
    title: "Frontend — Tailwind & Next.js",
    summary: "Do utility-first do Tailwind até App Router, data fetching e formulários no Next.js.",
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
