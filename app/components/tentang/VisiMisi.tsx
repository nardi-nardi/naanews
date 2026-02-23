import { ABOUT_HIGHLIGHTS } from "@/constants/about";
import React from "react";

const VisiMisi = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {ABOUT_HIGHLIGHTS.map((item) => (
        <section
          key={item.title}
          className="glass-panel h-full rounded-2xl p-6 ring-1 ring-white/5"
        >
          <h2 className="mb-4 text-xl font-bold text-slate-50">{item.title}</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            {item.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400"
                  aria-hidden
                />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default VisiMisi;
