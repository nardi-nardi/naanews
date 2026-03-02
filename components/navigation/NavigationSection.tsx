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
    <section className="sidebar-widget">
      <h2 className="widget-heading">Navigasi</h2>
      <div className="mt-3 space-y-2">
        {navLink.map((item) => {
          const isActive = activePath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate} // Panggil fungsi tutup drawer jika ada
              className={cn("nav-link", isActive && "nav-link-active")}
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
