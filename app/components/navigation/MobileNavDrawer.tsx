"use client";

import { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DrawerHeader, MenuButton, NavigationSection } from ".";

// Helper agar class Tailwind lebih enak dibaca
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MobileNavDrawerProps = {
  activePath: string;
};

export function MobileNavDrawer({ activePath }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Logic: Lock Scroll saat Drawer terbuka
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const toggleDrawer = () => setIsOpen((prev) => !prev);
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* 1. Mobile Top Bar */}
      <header className="glass-panel fixed inset-x-3 top-3 z-30 rounded-2xl px-4 py-3 xl:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-slate-100">
            Narzza Media Digital
          </p>
          <MenuButton onClick={toggleDrawer} />
        </div>
      </header>

      {/* 2. Overlay & Panel */}
      <div
        className={cn(
          "fixed inset-0 z-40 xl:hidden transition-all duration-300",
          isOpen
            ? "pointer-events-auto visibility-visible"
            : "pointer-events-none visibility-hidden"
        )}
      >
        {/* Dark Background Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/65 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={closeDrawer}
        />

        {/* Sidebar Panel */}
        <aside
          className={cn(
            "glass-panel absolute inset-y-0 left-0 w-[86%] max-w-[320px] border-r border-slate-600/50 p-4 transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <DrawerHeader onClose={closeDrawer} />

          <nav className="mt-4 space-y-2">
            <NavigationSection
              activePath={activePath}
              onNavigate={() => setIsOpen(false)}
            />
          </nav>
        </aside>
      </div>
    </>
  );
}
