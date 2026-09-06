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

/**
 * Diagrama de rede interativo — nós conectados por linhas, com um "pacote"
 * que anima de nó em nó ao clicar em Reproduzir. Posição do pacote é
 * controlada via estado React (left/top em %, com transition CSS) em vez
 * de SMIL — mais fácil sincronizar com a legenda de cada passo e permitir
 * pausar/reiniciar do que orquestrar animateMotion encadeado.
 */
export function NetworkDiagram({
  nodes,
  hops,
  height = 260,
}: {
  nodes: NetworkNode[];
  hops: NetworkHop[];
  height?: number;
}) {
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

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

  return (
    <div className="nexttech-network-diagram">
      <div className="nexttech-network-diagram__canvas" style={{ height }}>
        <svg className="nexttech-network-diagram__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {hops.map((hop, i) => {
            const from = nodeById.get(hop.from);
            const to = nodeById.get(hop.to);
            if (!from || !to) return null;
            const isActive = stepIndex === i;
            return (
              <line
                key={`${hop.from}-${hop.to}-${i}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={`nexttech-network-diagram__edge${isActive ? " is-active" : ""}`}
                vectorEffect="non-scaling-stroke"
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
