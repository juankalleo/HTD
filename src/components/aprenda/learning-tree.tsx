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
  { slug: "frontend", code: "FE", x: 49, y: 40 },
  { slug: "rails", code: "RoR", x: 49, y: 72 },
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
            <span className="nexttech-learning-tree__code">{node.code}</span>
            <span className="nexttech-learning-tree__percent">{percent}%</span>
            <span className="nexttech-learning-tree__title">{meta.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
