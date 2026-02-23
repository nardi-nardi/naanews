import { ACHIEVEMENTS } from "@/constants/about";
import React from "react";

const AchievementTentang = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
      <h2 className="mb-5 text-2xl font-bold text-slate-50">Pencapaian Kami</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACHIEVEMENTS.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-cyan-500/20 bg-linear-to-br from-cyan-500/5 to-blue-500/5 p-5 text-center"
          >
            <div className="mb-2 text-2xl">{item.icon}</div>
            <div className="text-3xl font-bold text-cyan-300">
              {item.number}
            </div>
            <div className="mt-1 text-sm text-slate-400">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AchievementTentang;
