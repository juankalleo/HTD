"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrackPercent } from "@/lib/aprenda-progress";
import { getTrackMeta, type TrackSlug } from "@/content/aprenda/tracks";
import { getTrackLessons } from "@/content/aprenda/registry";

type TreeNode = {
  slug: TrackSlug;
  code: string;
  x: number;
  y: number;
};

/**
 * Layout desenhado à mão (não é um algoritmo de grafo genérico) — só 8 nós
 * fixos, então posicionar por coordenada é mais simples e mais previsível
 * visualmente do que um layout automático. Conta a história da esquerda para
 * a direita: fundamentos entram primeiro, depois frontend/backend/rede, e
 * Docker fecha como integração final.
 */
const NODES: TreeNode[] = [
  { slug: "git", code: "Git", x: 8, y: 22 },
  { slug: "javascript", code: "JS", x: 8, y: 53 },
  { slug: "sql", code: "SQL", x: 8, y: 84 },
  { slug: "typescript", code: "TS", x: 28, y: 53 },
  { slug: "frontend", code: "Next.js", x: 49, y: 40 },
  { slug: "rails", code: "Rails", x: 49, y: 72 },
  { slug: "networking", code: "Net", x: 68, y: 84 },
  { slug: "docker", code: "Docker", x: 90, y: 56 },
];

const EDGES: [TrackSlug, TrackSlug][] = [
  ["javascript", "typescript"],
  ["typescript", "frontend"],
  ["sql", "rails"],
  ["git", "rails"],
  ["frontend", "docker"],
  ["rails", "docker"],
  ["networking", "docker"],
];

function nodeById(slug: TrackSlug) {
  return NODES.find((n) => n.slug === slug)!;
}

/** Curva suave estilo "flowchart" — avança horizontalmente entre os nós. */
function edgePath(from: TreeNode, to: TreeNode): string {
  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
}

function TechIcon({ slug }: { slug: TrackSlug }) {
  if (slug === "git") {
    return (
      <svg className="nexttech-learning-tree__icon nexttech-learning-tree__icon--git" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="10" y="10" width="28" height="28" rx="5" transform="rotate(45 24 24)" />
        <circle cx="19" cy="18" r="3.4" />
        <circle cx="29" cy="28" r="3.4" />
        <circle cx="19" cy="30" r="3.4" />
        <path d="M21.7 20.7l4.8 4.8M19 21.4V30" />
      </svg>
    );
  }

  if (slug === "javascript") {
    return (
      <svg className="nexttech-learning-tree__icon nexttech-learning-tree__icon--javascript" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="8" width="32" height="32" rx="6" />
        <text x="24" y="31" textAnchor="middle">JS</text>
      </svg>
    );
  }

  if (slug === "typescript") {
    return (
      <svg className="nexttech-learning-tree__icon nexttech-learning-tree__icon--typescript" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="8" width="32" height="32" rx="6" />
        <text x="24" y="31" textAnchor="middle">TS</text>
      </svg>
    );
  }

  if (slug === "sql") {
    return (
      <svg className="nexttech-learning-tree__icon nexttech-learning-tree__icon--sql" viewBox="0 0 48 48" aria-hidden="true">
        <ellipse cx="24" cy="13" rx="13" ry="5" />
        <path d="M11 13v18c0 2.8 5.8 5 13 5s13-2.2 13-5V13" />
        <path d="M11 22c0 2.8 5.8 5 13 5s13-2.2 13-5" />
        <path d="M11 31c0 2.8 5.8 5 13 5s13-2.2 13-5" />
      </svg>
    );
  }

  if (slug === "frontend") {
    return (
      <svg className="nexttech-learning-tree__icon nexttech-learning-tree__icon--frontend" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="17" />
        <path d="M17 17h14v14L17 17z" />
        <path d="M31 31L17 17" />
      </svg>
    );
  }

  if (slug === "rails") {
    return (
      <svg className="nexttech-learning-tree__icon nexttech-learning-tree__icon--rails" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 7l18 10v14L24 41 6 31V17L24 7z" />
        <text x="24" y="29" textAnchor="middle">R</text>
      </svg>
    );
  }

  if (slug === "docker") {
    return (
      <svg className="nexttech-learning-tree__icon nexttech-learning-tree__icon--docker" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="10" y="24" width="7" height="6" rx="1" />
        <rect x="18" y="24" width="7" height="6" rx="1" />
        <rect x="26" y="24" width="7" height="6" rx="1" />
        <rect x="18" y="17" width="7" height="6" rx="1" />
        <rect x="26" y="17" width="7" height="6" rx="1" />
        <path d="M8 31h30c-.9 5.6-5.8 9-13 9h-6c-5.9 0-10.3-3.5-11-9z" />
        <path d="M37 29c2.2 0 3.7-1.1 4.6-3.2" />
      </svg>
    );
  }

  return (
    <svg className="nexttech-learning-tree__icon nexttech-learning-tree__icon--networking" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="15" />
      <path d="M9 24h30M24 9c4 4 6 9 6 15s-2 11-6 15M24 9c-4 4-6 9-6 15s2 11 6 15" />
      <path d="M14 15c3 1.3 6.3 2 10 2s7-.7 10-2M14 33c3-1.3 6.3-2 10-2s7 .7 10 2" />
    </svg>
  );
}

export function LearningTree() {
  const [percents, setPercents] = useState<Record<string, number>>({});

  useEffect(() => {
    const next: Record<string, number> = {};
    for (const node of NODES) {
      next[node.slug] = getTrackPercent(node.slug, getTrackLessons(node.slug).length);
    }
    setPercents(next);
  }, []);

  return (
    <div className="nexttech-learning-tree">
      <svg
        className="nexttech-learning-tree__lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {EDGES.map(([from, to]) => (
          <path
            key={`${from}-${to}`}
            d={edgePath(nodeById(from), nodeById(to))}
            className="nexttech-learning-tree__edge"
            vectorEffect="non-scaling-stroke"
            fill="none"
          />
        ))}
      </svg>

      {NODES.map((node) => {
        const meta = getTrackMeta(node.slug);
        if (!meta) return null;
        const percent = percents[node.slug] ?? 0;
        const firstLesson = getTrackLessons(node.slug)[0];
        const href = firstLesson ? `/aprenda/${node.slug}/${firstLesson.meta.slug}` : `/aprenda/${node.slug}`;
        return (
          <Link
            key={node.slug}
            href={href}
            className={`nexttech-learning-tree__node${node.slug === "docker" ? " is-capstone" : ""}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <TechIcon slug={node.slug} />
            <span className="nexttech-learning-tree__code">{node.code}</span>
            <span className="nexttech-learning-tree__percent">{percent}%</span>
            <span className="nexttech-learning-tree__title">{meta.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
