import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import type { SidebarItem } from "./sidebar";
import { DocsSidebarPanel } from "./docs-sidebar-panel";
import { Footer } from "./footer";
import type { AreaKey } from "@/lib/i18n";

export function DocsLayout({
  activeHref,
  children,
  area,
  sidebarTree,
}: {
  activeHref: string;
  children: ReactNode;
  area: AreaKey;
  sidebarTree: SidebarItem[];
}) {
  return (
    <>
      <Navbar activeHref={activeHref} />
      <div className="theme-layout-main main-wrapper mainWrapper_Bn9y">
        <div className="container margin-vert--lg">
          <div className="row">
            <DocsSidebarPanel area={area} tree={sidebarTree} />
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
