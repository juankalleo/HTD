"use client";

import { useState } from "react";
import { CodeExample } from "./code-example";

/**
 * Exercício "tente você mesmo" — enunciado + botão que revela a solução
 * (um CodeExample). Sem correção automática, diferente do Quiz.
 */
export function Exercise({
  prompt,
  solutionCode,
  solutionLanguage = "typescript",
}: {
  prompt: React.ReactNode;
  solutionCode: string;
  solutionLanguage?: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="nexttech-exercise">
      <h3 className="nexttech-exercise__title">Exercício</h3>
      <div className="nexttech-exercise__prompt">{prompt}</div>
      {!revealed ? (
        <button type="button" className="nexttech-exercise__reveal" onClick={() => setRevealed(true)}>
          Ver solução
        </button>
      ) : (
        <CodeExample code={solutionCode} language={solutionLanguage} label="Solução" />
      )}
    </div>
  );
}
