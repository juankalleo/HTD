import type { Metadata } from "next";
import { AreaDoc } from "@/components/area-doc";
import { getDoc, getAreaConfig } from "@/lib/docs";
import { getServerLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = slug ?? [];
  const locale = await getServerLocale();
  const cfg = getAreaConfig("padrao-banco-de-dados");
  const doc = getDoc("padrao-banco-de-dados", s, locale);
  if (!doc) return { title: cfg.area };
  return { title: `${doc.title} | ${cfg.area}`, description: doc.description };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <AreaDoc area="padrao-banco-de-dados" slug={slug} />;
}
