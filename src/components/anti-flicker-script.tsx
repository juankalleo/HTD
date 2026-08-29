"use client";

import { useServerInsertedHTML } from "next/navigation";

// Roda antes da hidratação para evitar flash de tema errado. Esta wiki nasce
// escura por padrão e ignora valores antigos de `theme=light` salvos no browser.
const THEME_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("nexttech-theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme-choice", theme);
  } catch (e) {}
})();
`;

/**
 * Injeta o script de tema no stream do SSR, FORA da árvore React. O
 * `useServerInsertedHTML` só escreve durante o SSR — no cliente o hook não
 * emite nada, então o React 19 nunca "vê" uma `<script>` sendo renderizada
 * por componente e não dispara o aviso "Encountered a script tag" (falso
 * positivo do React 19 com `next/script`). O script continua rodando antes
 * da hidratação, sem flash de tema.
 */
export function AntiFlickerScript() {
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
  ));
  return null;
}
