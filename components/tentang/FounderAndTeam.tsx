import { FOUNDERS, AI_TEAM } from "@/constants/about";
import React from "react";

const FounderAndTeam = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
      <h2 className="mb-2 text-2xl font-bold text-slate-50">Tim Kami</h2>
      <p className="mb-5 text-sm text-slate-400">
        Orang-orang di balik Narzza Media Digital
      </p>

      {/* Founders */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-cyan-300">Founders</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {FOUNDERS.map((founder) => (
            <div
              key={founder.name}
              className="rounded-xl border border-cyan-500/30 bg-linear-to-br from-cyan-500/10 to-blue-500/10 p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 text-2xl">
                  {founder.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-50">{founder.name}</h4>
                  <p className="text-sm text-cyan-300">{founder.role}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                {founder.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Employees */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-cyan-300">
          AI Team Members
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {AI_TEAM.map((employee) => (
            <div
              key={employee.name}
              className="rounded-lg border border-slate-700/60 bg-slate-900/40 p-4 text-center transition hover:border-cyan-500/40 hover:bg-slate-800/60"
            >
              <div className="mb-2 text-3xl">{employee.avatar}</div>
              <h4 className="mb-1 font-semibold text-slate-50">
                {employee.name}
              </h4>
              <p className="mb-1 text-xs text-slate-400">{employee.role}</p>
              <span className="inline-block rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-medium text-cyan-300">
                {employee.team}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FounderAndTeam;
