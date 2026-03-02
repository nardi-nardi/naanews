"use client";

import { usePathname } from "next/navigation";
import {
  AdminLink,
  AdsPlaceholder,
  MobileNavDrawer,
  NavigationSection,
  QuickAccessSection,
  TrendingSection,
} from ".";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const activePath = usePathname();

  return (
    <div className="page-shell">
      <div className="content-grid">
        {/* Sidebar Kiri */}
        <aside className="hidden w-72 shrink-0 xl:block sidebar-sticky">
          <div className="space-y-4">
            <NavigationSection activePath={activePath} />
            <AdminLink />
            {/* Theme toggle — bottom of left sidebar */}
            <div className="sidebar-widget">
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Konten Utama */}
        <main className="mx-auto w-full min-w-0 max-w-3xl">{children}</main>

        {/* Sidebar Kanan */}
        <aside className="hidden w-64 shrink-0 xl:block sidebar-sticky">
          <div className="space-y-4">
            <QuickAccessSection />
            <AdsPlaceholder label="Google Ads Slot" size="300 x 250" />
            <AdsPlaceholder label="Sponsored" size="Native Promo Block" />
            <TrendingSection />
          </div>
        </aside>
      </div>

      <MobileNavDrawer activePath={activePath} />
    </div>
  );
}
