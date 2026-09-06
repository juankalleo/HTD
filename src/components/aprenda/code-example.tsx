"use client";

import { useMemo, useState } from "react";
import hljs from "highlight.js";
import { useLocale } from "@/components/locale-provider";

export type CodeExampleProps = {
  code: string;
  language?: string;
  /** Saída esperada (terminal simulado) — quando presente, mostra abas Código/Resultado. */
  result?: string;
  label?: string;
};

/**
 * Bloco de código das lições do Aprenda. Usa `highlight.js` direto no
 * client (já é dependência instalada, usada hoje via `rehype-highlight`
 * em markdown-view.tsx) em vez de estender o tokenizer manual de
 * `code-block.tsx`, que só entende o vocabulário de um snippet específico.
 * O tema `github-dark.css` já é importado globalmente em `globals.css`.
 */
export function CodeExample({ code, language = "plaintext", result, label }: CodeExampleProps) {
  const { t } = useLocale();
  const hasResult = result !== undefined;
  const [tab, setTab] = useState<"code" | "result">("code");
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    try {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    } catch {
      return hljs.highlightAuto(code).value;
    }
  }, [code, language]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard indisponível — falha silenciosa
    }
  }

  const showingCode = !hasResult || tab === "code";

  return (
    <div className="nexttech-code-example">
      <div className="nexttech-code-example__header">
        {label && <span className="nexttech-code-example__label">{label}</span>}
        {hasResult && (
          <div className="nexttech-code-example__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "code"}
              className={`nexttech-code-example__tab${tab === "code" ? " is-active" : ""}`}
              onClick={() => setTab("code")}
            >
              Código
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "result"}
              className={`nexttech-code-example__tab${tab === "result" ? " is-active" : ""}`}
              onClick={() => setTab("result")}
            >
              Resultado
            </button>
          </div>
        )}
        <button type="button" className="nexttech-code-example__copy" onClick={handleCopy}>
          {copied ? t.code.copied : t.code.copy}
        </button>
      </div>
      {showingCode ? (
        <pre className="nexttech-code-example__pre">
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      ) : (
        <pre className="nexttech-code-example__pre nexttech-code-example__result">{result}</pre>
      )}
    </div>
  );
}
