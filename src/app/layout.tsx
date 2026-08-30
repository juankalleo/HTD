import type { Metadata } from "next";
import "./globals.css";
import "./nexttech.css";
import { AntiFlickerScript } from "@/components/anti-flicker-script";
import { LocaleProvider } from "@/components/locale-provider";
import { getServerLocale } from "@/lib/locale-server";

export const metadata: Metadata = {
  title: "How to Dev",
  description: "Personal documentation of the structuring standards I use as a reference.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();
  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} data-theme="dark" data-theme-choice="dark" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/css/styles.cfff3e98.css" />
      </head>
      <body className="navigation-with-keyboard">
        <AntiFlickerScript />
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
