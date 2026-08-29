import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Sidebar, type SidebarItem } from "./sidebar";
import { Footer } from "./footer";

export function DocsLayout({
  activeHref,
  children,
  sidebarTitle,
  sidebarTree,
}: {
  activeHref: string;
  children: ReactNode;
  sidebarTitle: string;
  sidebarTree: SidebarItem[];
}) {
  return (
    <>
      <Navbar activeHref={activeHref} />
      <div className="theme-layout-main main-wrapper mainWrapper_Bn9y">
        <div className="container margin-vert--lg">
          <div className="row">
            <aside className="col col--3 nexttech-space-sidebar">
              <Sidebar title={sidebarTitle} tree={sidebarTree} />
            </aside>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
