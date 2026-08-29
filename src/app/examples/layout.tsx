import { AreaDocsLayout } from "@/components/area-docs-layout";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AreaDocsLayout area="examples">{children}</AreaDocsLayout>;
}
