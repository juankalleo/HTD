import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getGlobalSearchIndex } from "@/lib/search-index";
import { getServerLocale } from "@/lib/locale-server";

export default async function AprendaLayout({ children }: { children: ReactNode }) {
  const locale = await getServerLocale();
  const searchEntries = getGlobalSearchIndex(locale);
  return (
    <>
      <Navbar activeHref="/aprenda" searchEntries={searchEntries} />
      <div className="nexttech-aprenda-wrapper">{children}</div>
      <Footer />
    </>
  );
}
