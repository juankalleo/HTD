import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomeContent } from "@/components/home-content";
import { getGlobalSearchIndex } from "@/lib/search-index";
import { getServerLocale } from "@/lib/locale-server";

export const metadata: Metadata = {
  title: {
    absolute: "How to Dev - Learn Software Development",
  },
  description:
    "How to Dev is a practical software development knowledge base covering frontend, backend, APIs, databases, security, infrastructure and architecture.",
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
