import { navLink } from "@/constants";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tambahkan prop onNavigate
type NavigationSectionProps = {
  activePath: string;
  onNavigate?: () => void; // Fungsi ini opsional
};

const NavigationSection = ({
  activePath,
  onNavigate,
}: NavigationSectionProps) => {
  return (
    <section className="glass-panel rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-slate-100">Navigasi</h2>
      <div className="mt-3 space-y-2">
        {navLink.map((item) => {
          const isActive = activePath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate} // Panggil fungsi tutup drawer jika ada
              className={cn(
                "nav-pill block w-full rounded-xl px-3 py-2 text-left transition hover:border-cyan-300/50 hover:bg-cyan-500/10",
                isActive &&
                  "border-cyan-400/70 bg-cyan-500/15 ring-1 ring-cyan-400/30"
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-cyan-200" : "text-slate-100"
                )}
              >
                {item.title}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isActive ? "text-cyan-300/70" : "text-slate-400"
                )}
              >
                {item.note}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default NavigationSection;
