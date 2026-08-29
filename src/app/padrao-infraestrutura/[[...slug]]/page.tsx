import type { Metadata } from "next";
import { AreaDoc } from "@/components/area-doc";
import { getDoc, getAreaConfig } from "@/lib/docs";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = slug ?? [];
  const cfg = getAreaConfig("padrao-infraestrutura");
  const doc = getDoc("padrao-infraestrutura", s);
  if (!doc) return { title: `${cfg.area} | WIKI-NEXT` };
  return { title: `${doc.title} | ${cfg.area} | WIKI-NEXT`, description: doc.description };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <AreaDoc area="padrao-infraestrutura" slug={slug} />;
}
