import type { Metadata } from "next";
import "./globals.css";
import "./nexttech.css";
import { AntiFlickerScript } from "@/components/anti-flicker-script";
import { LocaleProvider } from "@/components/locale-provider";
import { getServerLocale } from "@/lib/locale-server";

const SITE_URL = "https://howtodev.site";
const SITE_DESCRIPTION =
  "How to Dev is a practical software development knowledge base for learning frontend, backend, APIs, databases, security, infrastructure and architecture.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "How to Dev",
    template: "%s | How to Dev",
  },
  description: SITE_DESCRIPTION,
  keywords: ["How to Dev", "HowToDev", "software development", "developer roadmap", "web development", "API security"],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
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

// Dados estruturados (schema.org) — não é pra Google "mostrar bonito" só,
// é o que motor de busca com IA (AI Overviews, Perplexity, etc.) usa pra
// entender com confiança quem/o que é "How to Dev" antes de citar
// a página numa resposta. Sem isso, o site é só texto solto pra eles.
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://howtodev.site/#website",
      name: "How to Dev",
      alternateName: ["HowToDev", "howtodev.site"],
      url: "https://howtodev.site/",
      description:
        "Practical software development knowledge base covering frontend, backend, APIs, databases, security, infrastructure and architecture.",
      inLanguage: ["en", "pt-BR"],
      author: { "@id": "https://howtodev.site/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://howtodev.site/#person",
      name: "Juan Kalleo",
      jobTitle: "Staff Fullstack Software Engineer",
      url: "https://howtodev.site",
      sameAs: ["https://github.com/juankalleo"],
    },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();
  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} data-theme="dark" data-theme-choice="dark" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/css/styles.cfff3e98.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }} />
      </head>
      <body className="navigation-with-keyboard">
        <AntiFlickerScript />
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
