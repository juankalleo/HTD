import type { Metadata } from "next";
import { AreaDoc } from "@/components/area-doc";
import { getDoc, getAreaConfig } from "@/lib/docs";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = slug ?? [];
  const cfg = getAreaConfig("padrao-frontend");
  const doc = getDoc("padrao-frontend", s);
  if (!doc) return { title: `${cfg.area} | How to Dev` };
  return { title: `${doc.title} | ${cfg.area} | How to Dev`, description: doc.description };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <AreaDoc area="padrao-frontend" slug={slug} />;
}
