import { TEAMS } from "@/constants/about";
import Link from "next/link";
import React from "react";

const CompanyInfo = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">
            Profil Perusahaan
          </h2>
          <p className="text-sm text-slate-400">
            Informasi lengkap tentang Narzza Media Digital
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
        >
          Portal Admin
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEAMS.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
            </div>
            <p className="text-base font-semibold text-slate-50">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompanyInfo;
