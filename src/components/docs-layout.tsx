import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Sidebar, type SidebarItem } from "./sidebar";
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
            <aside className="col col--3 nexttech-space-sidebar">
              <Sidebar area={area} tree={sidebarTree} />
            </aside>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
