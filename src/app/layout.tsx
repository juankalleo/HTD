import type { Metadata } from "next";
import "./globals.css";
import "./nexttech.css";
import { AntiFlickerScript } from "@/components/anti-flicker-script";
import { LocaleProvider } from "@/components/locale-provider";
import { getServerLocale } from "@/lib/locale-server";

const SITE_URL = "https://howtodev.site";
const SITE_DESCRIPTION =
  "How to Dev (HTD) — Juan Kalleo's personal, security-first reference for structuring Next.js and Rails applications, with real code and nothing hidden.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "How to Dev",
    template: "%s | How to Dev",
  },
  description: SITE_DESCRIPTION,
  keywords: ["How to Dev", "HTD", "Juan Kalleo", "Next.js", "Rails", "frontend standard", "web security"],
  authors: [{ name: "Juan Kalleo", url: "https://github.com/juankalleo" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "How to Dev",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "How to Dev",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Dev",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
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
