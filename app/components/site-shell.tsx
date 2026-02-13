import Link from "next/link";
import { MobileNavDrawer } from "@/app/components/mobile-nav-drawer";
import { navItems, tags } from "@/app/data/content";

type SiteShellProps = {
  activePath: string;
  children: React.ReactNode;
};

export function SiteShell({ activePath, children }: SiteShellProps) {
  return (
    <div className="bg-canvas min-h-screen pb-6 pt-20 text-slate-100 xl:pt-0">
      <div className="mx-auto flex w-full max-w-[1500px] gap-4 px-3 py-4 md:px-5 md:py-6">
        <aside className="hidden w-72 shrink-0 xl:block">
          <div className="sticky top-6 space-y-4">
            <section className="glass-panel rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-slate-100">Navigasi</h2>
              <div className="mt-3 space-y-2">
                {navItems.map((item) => {
                  const isActive = activePath === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-pill block w-full rounded-xl px-3 py-2 text-left transition hover:border-cyan-300/50 hover:bg-cyan-500/10 ${
                        isActive
                          ? "border-cyan-400/70 bg-cyan-500/15 ring-1 ring-cyan-400/30"
                          : ""
                      }`}
                    >
                      <p className={`text-sm font-medium ${isActive ? "text-cyan-200" : "text-slate-100"}`}>{item.title}</p>
                      <p className={`text-xs ${isActive ? "text-cyan-300/70" : "text-slate-400"}`}>{item.note}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
            <section className="glass-panel rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-slate-100">Quick Access</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Link href="/berita" className="rounded-full bg-slate-700/70 px-3 py-1 text-slate-200 hover:bg-slate-600/70 transition">#berita</Link>
                <Link href="/tutorial" className="rounded-full bg-slate-700/70 px-3 py-1 text-slate-200 hover:bg-slate-600/70 transition">#tutorial</Link>
                <Link href="/riset" className="rounded-full bg-slate-700/70 px-3 py-1 text-slate-200 hover:bg-slate-600/70 transition">#riset</Link>
              </div>
            </section>
            <Link
              href="/admin"
              className="glass-panel block rounded-2xl p-4 text-center text-sm font-medium text-amber-300 transition hover:border-amber-400/50"
            >
              🛠️ Admin Panel
            </Link>
          </div>
        </aside>

        <main className="mx-auto w-full max-w-3xl">
          {children}
        </main>

        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="sticky top-6 space-y-4">
            <div className="glass-panel rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-200">Google Ads Slot</p>
              <div className="mt-3 rounded-xl border border-dashed border-slate-500/50 bg-slate-900/40 p-4 text-center text-xs text-slate-400">
                300 x 250
                <br />
                Sidebar Right
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-4">
              <p className="text-sm font-semibold text-slate-200">Sponsored</p>
              <div className="mt-3 rounded-xl border border-dashed border-slate-500/50 bg-slate-900/40 p-4 text-center text-xs text-slate-400">
                Native Promo Block
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-slate-100">Trending Keywords</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag.replace(/^#/, "")}`}
                    className="rounded-full bg-slate-700/70 px-3 py-1 text-slate-200 hover:bg-slate-600/70 transition"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <MobileNavDrawer activePath={activePath} items={navItems} />
    </div>
  );
}
