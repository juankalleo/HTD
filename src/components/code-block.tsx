"use client";

import type { ReactNode } from "react";
import { useState } from "react";

const KEYWORDS = new Set([
  "as",
  "async",
  "await",
  "catch",
  "const",
  "else",
  "export",
  "from",
  "function",
  "if",
  "import",
  "let",
  "new",
  "return",
  "throw",
  "try",
  "type",
  "typeof",
  "var",
  "void",
]);

const LITERALS = new Set(["false", "null", "true", "undefined"]);
const TYPES = new Set(["ApiResult", "Error", "LoginFormValues", "Promise", "SessionUser", "string"]);

function consumeString(code: string, start: number) {
  const quote = code[start];
  let index = start + 1;

  while (index < code.length) {
    if (code[index] === "\\") {
      index += 2;
      continue;
    }

    if (code[index] === quote) {
      return index + 1;
    }

    index += 1;
  }

  return index;
}

function consumeBlockComment(code: string, start: number) {
  const end = code.indexOf("*/", start + 2);

  return end === -1 ? code.length : end + 2;
}

function consumeLineComment(code: string, start: number) {
  const end = code.indexOf("\n", start + 2);

  return end === -1 ? code.length : end;
}

function consumeIdentifier(code: string, start: number) {
  let index = start + 1;

  while (index < code.length && /[\w$]/.test(code[index])) {
    index += 1;
  }

  return index;
}

function nextNonSpace(code: string, start: number) {
  let index = start;

  while (index < code.length && /\s/.test(code[index])) {
    index += 1;
  }

  return code[index];
}

function previousNonSpace(code: string, start: number) {
  let index = start - 1;

  while (index >= 0 && /\s/.test(code[index])) {
    index -= 1;
  }

  return code[index];
}

function classForIdentifier(code: string, start: number, end: number) {
  const value = code.slice(start, end);

  if (KEYWORDS.has(value)) return "nexttech-code-token--keyword";
  if (LITERALS.has(value)) return "nexttech-code-token--literal";
  if (TYPES.has(value) || /^[A-Z]/.test(value)) return "nexttech-code-token--type";
  if (previousNonSpace(code, start) === ".") return "nexttech-code-token--property";
  if (nextNonSpace(code, end) === ":") return "nexttech-code-token--property";
  if (nextNonSpace(code, end) === "(") return "nexttech-code-token--function";

  return "nexttech-code-token--identifier";
}

function renderHighlightedCode(code: string) {
  const parts: ReactNode[] = [];
  let index = 0;

  function push(text: string, className?: string) {
    parts.push(
      className ? (
        <span key={parts.length} className={`nexttech-code-token ${className}`}>
          {text}
        </span>
      ) : (
        text
      ),
    );
  }

  while (index < code.length) {
    const char = code[index];
    const next = code[index + 1];

    if (char === "/" && next === "/") {
      const end = consumeLineComment(code, index);
      push(code.slice(index, end), "nexttech-code-token--comment");
      index = end;
      continue;
    }

    if (char === "/" && next === "*") {
      const end = consumeBlockComment(code, index);
      push(code.slice(index, end), "nexttech-code-token--comment");
      index = end;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      const end = consumeString(code, index);
      push(code.slice(index, end), "nexttech-code-token--string");
      index = end;
      continue;
    }

    if (/\d/.test(char)) {
      const match = code.slice(index).match(/^\d+(\.\d+)?/);
      const value = match?.[0] ?? char;
      push(value, "nexttech-code-token--number");
      index += value.length;
      continue;
    }

    if (/[A-Za-z_$]/.test(char)) {
      const end = consumeIdentifier(code, index);
      push(code.slice(index, end), classForIdentifier(code, index, end));
      index = end;
      continue;
    }

    if (/[{}()[\],.;]/.test(char)) {
      push(char, "nexttech-code-token--punctuation");
      index += 1;
      continue;
    }

    if (/[=+\-*/!<>?:|&]/.test(char)) {
      push(char, "nexttech-code-token--operator");
      index += 1;
      continue;
    }

    push(char);
    index += 1;
  }

  return parts;
}

export function CodeBlock({ children, code, label }: { children?: ReactNode; code: string; label?: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(code);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      // Clipboard indisponível (ex.: contexto não seguro) — sem quebrar a página.
    }
  }

  return (
    <div className="nexttech-code-block my-3 overflow-hidden rounded-lg border border-slate-200">
      {label && (
        <div className="nexttech-code-block__header flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
          <span className="font-mono">{label}</span>
        </div>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={copiar}
          className="nexttech-code-block__copy absolute top-2 right-2 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 transition-colors hover:bg-slate-700"
        >
          {copiado ? "Copiado!" : "Copiar"}
        </button>
        <pre className="nexttech-code-block__pre overflow-x-auto bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
          <code>{children ?? renderHighlightedCode(code)}</code>
        </pre>
      </div>
    </div>
  );
}
