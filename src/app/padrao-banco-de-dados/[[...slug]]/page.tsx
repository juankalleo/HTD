import type { Metadata } from "next";
import { AreaDoc } from "@/components/area-doc";
import { getDoc, getAreaConfig } from "@/lib/docs";
import { getServerLocale } from "@/lib/locale-server";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = slug ?? [];
  const locale = await getServerLocale();
  const cfg = getAreaConfig("padrao-banco-de-dados");
  const doc = getDoc("padrao-banco-de-dados", s, locale);
  if (!doc) return { title: cfg.area };
  const canonical = siteUrl(`/padrao-banco-de-dados${s.length ? `/${s.join("/")}` : ""}`);
  const title = s.length ? `${doc.title} | ${cfg.area}` : doc.title;
  return {
    title,
    description: doc.description,
    alternates: { canonical },
    openGraph: { title, description: doc.description, url: canonical },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <AreaDoc area="padrao-banco-de-dados" slug={slug} />;
}
