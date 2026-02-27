import {
  AdminLink,
  AdsPlaceholder,
  MobileNavDrawer,
  NavigationSection,
  QuickAccessSection,
  TrendingSection,
} from ".";

type SiteShellProps = {
  activePath: string;
  children: React.ReactNode;
};

export function SiteShell({ activePath, children }: SiteShellProps) {
  return (
    <div className="bg-canvas min-h-screen pb-6 pt-20 text-slate-100 xl:pt-0">
      <div className="mx-auto flex w-full min-w-0 max-w-375 gap-4 px-3 py-4 md:px-5 md:py-6">
        {/* Sidebar Kiri */}
        <aside className="hidden w-72 shrink-0 xl:block">
          <div className="sticky top-6 space-y-4">
            <NavigationSection activePath={activePath} />
            <QuickAccessSection />
            <AdminLink />
          </div>
        </aside>

        {/* Konten Utama */}
        <main className="mx-auto w-full min-w-0 max-w-3xl">{children}</main>

        {/* Sidebar Kanan */}
        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="sticky top-6 space-y-4">
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
