import type { ReactNode } from "react";

/**
 * Comparação visual lado a lado ("evite" vs. "prefira") pras lições de
 * UI/UX — cada lado recebe um mini-mockup livre (`children` arbitrário,
 * geralmente uma <div> com estilo inline simulando um pedaço de interface),
 * não texto explicando a diferença. O texto de explicação vai fora, em <p>.
 */
export function Compare({
  bad,
  good,
  badLabel = "Evite",
  goodLabel = "Prefira",
}: {
  bad: ReactNode;
  good: ReactNode;
  badLabel?: string;
  goodLabel?: string;
}) {
  return (
    <div className="nexttech-compare">
      <div className="nexttech-compare__col nexttech-compare__col--bad">
        <span className="nexttech-compare__badge">{badLabel}</span>
        <div className="nexttech-compare__stage">{bad}</div>
      </div>
      <div className="nexttech-compare__col nexttech-compare__col--good">
        <span className="nexttech-compare__badge">{goodLabel}</span>
        <div className="nexttech-compare__stage">{good}</div>
      </div>
    </div>
  );
}
