import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  // PNG já achatado (sem canal alpha) — o Satori (renderizador do
  // next/og) não compõe corretamente o alpha do PNG original e mostra
  // um quadrado xadrez de "transparência" em vez do fundo escuro atrás
  // do dado.
  const dice = fs.readFileSync(path.join(process.cwd(), "src/app/og-assets/dice-flat.png"));
  const diceSrc = `data:image/png;base64,${dice.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#18191a",
          color: "#e3e3e3",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={diceSrc} width={176} height={176} alt="" />
        <div style={{ fontSize: 84, fontWeight: 900, marginTop: 28, letterSpacing: -2 }}>How to Dev</div>
        <div style={{ fontSize: 30, color: "#aeb7c2", marginTop: 12 }}>
          A personal, security-first frontend reference
        </div>
      </div>
    ),
    { ...size },
  );
}
