import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomeContent } from "@/components/home-content";
import { getGlobalSearchIndex } from "@/lib/search-index";
import { getServerLocale } from "@/lib/locale-server";

export const metadata: Metadata = {
  title: "How to Dev",
  description:
    "Juan Kalleo's personal documentation of the frontend, API, and infrastructure standards used as a project reference.",
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
