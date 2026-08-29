import type { Metadata } from "next";
import "./globals.css";
import "./nexttech.css";
import { AntiFlickerScript } from "@/components/anti-flicker-script";

export const metadata: Metadata = {
  title: "How to Dev",
  description: "Documentação dos padrões de estruturação.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="dark" data-theme-choice="dark" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/css/styles.cfff3e98.css" />
      </head>
      <body className="navigation-with-keyboard">
        <AntiFlickerScript />
        {children}
      </body>
    </html>
  );
}
