"use client";

import dynamic from "next/dynamic";

/**
 * Sandpack é pesado e 100% client-side (bundla e roda no navegador do
 * visitante) — carregado via next/dynamic com ssr:false pra não entrar no
 * HTML servidor nem no bundle inicial de quem nunca abre uma lição com
 * editor ao vivo. Só a trilha Frontend usa isso (Tailwind/React isolado —
 * não simula App Router/servidor, ver nota na lição quando relevante).
 */
const Sandpack = dynamic(() => import("@codesandbox/sandpack-react").then((mod) => mod.Sandpack), {
  ssr: false,
  loading: () => <div className="nexttech-live-editor__loading">Carregando editor...</div>,
});

const TAILWIND_INDEX_HTML = `<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

export type LiveEditorProps = {
  /** Conteúdo de /App.js — o resto (index, HTML com Tailwind via CDN) já vem pronto e fica oculto. */
  code: string;
};

export function LiveEditor({ code }: LiveEditorProps) {
  return (
    <div className="nexttech-live-editor">
      <Sandpack
        template="react"
        theme="dark"
        files={{
          "/App.js": code,
          "/public/index.html": { code: TAILWIND_INDEX_HTML, hidden: true },
        }}
        options={{ showLineNumbers: true, editorHeight: 360, showTabs: false }}
      />
    </div>
  );
}
