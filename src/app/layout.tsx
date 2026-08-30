import type { Metadata } from "next";
import "./globals.css";
import "./nexttech.css";
import { AntiFlickerScript } from "@/components/anti-flicker-script";
import { LocaleProvider } from "@/components/locale-provider";

export const metadata: Metadata = {
  title: "How to Dev",
  description: "Personal documentation of the structuring standards I use as a reference.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-theme-choice="dark" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/css/styles.cfff3e98.css" />
      </head>
      <body className="navigation-with-keyboard">
        <AntiFlickerScript />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
