"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type NetworkNodeKind = "client" | "server" | "dns" | "proxy" | "cdn" | "loadbalancer" | "database";

export type NetworkNode = {
  id: string;
  label: string;
  kind: NetworkNodeKind;
  /** posição em porcentagem do quadro (0-100) */
  x: number;
  y: number;
};

export type NetworkEdge = {
  from: string;
  to: string;
};

export type NetworkHop = {
  from: string;
  to: string;
  /** legenda mostrada enquanto esse trecho do fluxo está tocando */
  caption: string;
};

const ICON_PATHS: Record<NetworkNodeKind, React.ReactNode> = {
  client: (
    <>
      <rect x="3.5" y="4.5" width="17" height="12" rx="1.5" />
      <path d="M8.5 20h7M12 16.5V20" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="16" height="6.5" rx="1.5" />
      <path d="M8 7.25h.01M8 16.75h.01" />
    </>
  ),
  dns: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 15 0 17M12 3.5c-2.5 2.3-2.5 15 0 17" />
    </>
  ),
  proxy: (
    <>
      <path d="M5 4h14l-4.5 8v6.5L9.5 20v-8L5 4Z" />
    </>
  ),
  cdn: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="7" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="7" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
      <path d="M12 8.4 8 13.5M12 8.4l4 5.1M8.5 15h7" />
    </>
  ),
  loadbalancer: (
    <>
      <path d="M4 12h4M4 12l3-3M4 12l3 3" />
      <path d="M8 12h4M12 5v14M12 5h6M12 12h6M12 19h6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
    </>
  ),
};

function NodeIcon({ kind }: { kind: NetworkNodeKind }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[kind]}
    </svg>
  );
}

/** Curva suave (mesma ideia do LearningTree) em vez de linha reta — entra/sai
 * levemente arqueada, então dois nós lado a lado não viram um traço plano. */
function edgePath(from: NetworkNode, to: NetworkNode): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // Curva mais pronunciada quando os nós estão desalinhados (diagonal);
  // uma leve barriga mesmo na horizontal, pra não ficar 100% reto.
  const bow = Math.max(Math.abs(dx), Math.abs(dy)) * 0.18;
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - (dx !== 0 ? bow : 0);
  return `M ${from.x} ${from.y} Q ${midX} ${midY}, ${to.x} ${to.y}`;
}

function edgeKey(from: string, to: string) {
  return [from, to].sort().join("::");
}

/**
 * Diagrama de rede interativo. `edges` é a topologia ESTÁTICA — todas as
 * conexões possíveis, sempre desenhadas (evita nó "flutuando" sem linha
 * quando ele só não é o alvo do passo atual, ex.: load balancer com 3
 * servidores mas só 1 ativo por vez). `hops` é a sequência animada; cada
 * hop precisa corresponder a uma edge (mesmo par from/to, em qualquer
 * ordem) pra saber qual linha destacar. Se `edges` não for passado, é
 * derivado dos próprios hops (funciona pra fluxo linear simples).
 */
export function NetworkDiagram({
  nodes,
  edges,
  hops,
  height = 260,
}: {
  nodes: NetworkNode[];
  edges?: NetworkEdge[];
  hops: NetworkHop[];
  height?: number;
}) {
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const resolvedEdges = useMemo<NetworkEdge[]>(() => {
    if (edges && edges.length) return edges;
    const seen = new Set<string>();
    const derived: NetworkEdge[] = [];
    for (const hop of hops) {
      const key = edgeKey(hop.from, hop.to);
      if (seen.has(key)) continue;
      seen.add(key);
      derived.push({ from: hop.from, to: hop.to });
    }
    return derived;
  }, [edges, hops]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function play() {
    if (playing) return;
    setPlaying(true);
    setStepIndex(0);
    let i = 0;
    const advance = () => {
      i += 1;
      if (i >= hops.length) {
        setPlaying(false);
        return;
      }
      setStepIndex(i);
      timeoutRef.current = setTimeout(advance, 1300);
    };
    timeoutRef.current = setTimeout(advance, 1300);
  }

  function reset() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPlaying(false);
    setStepIndex(-1);
  }

  const currentHop = stepIndex >= 0 ? hops[stepIndex] : undefined;
  const packetTarget = currentHop ? nodeById.get(currentHop.to) : nodeById.get(hops[0]?.from);
  const activeFromId = currentHop?.from;
  const activeToId = currentHop?.to;
  const activeEdgeKey = currentHop ? edgeKey(currentHop.from, currentHop.to) : undefined;

  return (
    <div className="nexttech-network-diagram">
      <div className="nexttech-network-diagram__canvas" style={{ height }}>
        <svg className="nexttech-network-diagram__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {resolvedEdges.map((edge) => {
            const from = nodeById.get(edge.from);
            const to = nodeById.get(edge.to);
            if (!from || !to) return null;
            const isActive = activeEdgeKey === edgeKey(edge.from, edge.to);
            return (
              <path
                key={edgeKey(edge.from, edge.to)}
                d={edgePath(from, to)}
                className={`nexttech-network-diagram__edge${isActive ? " is-active" : ""}`}
                vectorEffect="non-scaling-stroke"
                fill="none"
              />
            );
          })}
        </svg>

        {nodes.map((node) => {
          const isActive = node.id === activeFromId || node.id === activeToId;
          return (
            <div
              key={node.id}
              className={`nexttech-network-diagram__node${isActive ? " is-active" : ""}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <span className="nexttech-network-diagram__node-icon">
                <NodeIcon kind={node.kind} />
              </span>
              <span className="nexttech-network-diagram__node-label">{node.label}</span>
            </div>
          );
        })}

        {packetTarget && (
          <div
            className={`nexttech-network-diagram__packet${playing ? " is-moving" : ""}`}
            style={{ left: `${packetTarget.x}%`, top: `${packetTarget.y}%` }}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="nexttech-network-diagram__controls">
        <button type="button" className="nexttech-network-diagram__play" onClick={play} disabled={playing}>
          {playing ? "Reproduzindo…" : "▶ Reproduzir fluxo"}
        </button>
        {(playing || stepIndex >= 0) && (
          <button type="button" className="nexttech-network-diagram__reset" onClick={reset}>
            Reiniciar
          </button>
        )}
      </div>

      <p className="nexttech-network-diagram__caption">
        {currentHop ? currentHop.caption : "Clique em “Reproduzir fluxo” para ver a requisição passo a passo."}
      </p>
    </div>
  );
}
