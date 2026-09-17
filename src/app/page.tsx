import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomeContent } from "@/components/home-content";
import { getGlobalSearchIndex } from "@/lib/search-index";
import { getServerLocale } from "@/lib/locale-server";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "How to Dev - Aprenda Desenvolvimento de Software",
  },
  description:
    "How to Dev é uma base prática de conhecimento sobre frontend, backend, APIs, bancos de dados, segurança, infraestrutura e arquitetura.",
  alternates: { canonical: siteUrl("/") },
  openGraph: {
    title: "How to Dev - Aprenda Desenvolvimento de Software",
    description:
      "How to Dev é uma base prática de conhecimento sobre frontend, backend, APIs, bancos de dados, segurança, infraestrutura e arquitetura.",
    url: siteUrl("/"),
  },
};

export default async function HomePage() {
  const locale = await getServerLocale();
  const searchEntries = getGlobalSearchIndex(locale);
  return (
    <>
      <Navbar activeHref="/" searchEntries={searchEntries} />
      <HomeContent />
      <Footer />
    </>
  );
}
