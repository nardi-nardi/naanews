import { CONTACT_INFO } from "@/constants/about";

const ContactSection = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
      <h2 className="mb-2 text-2xl font-bold text-slate-50">Hubungi Kami</h2>
      <p className="mb-5 text-sm text-slate-400">
        Tertarik untuk berkolaborasi, partnership, atau punya pertanyaan? Kami
        siap mendengar Anda.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTACT_INFO.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
            </div>
            <p className="text-sm font-semibold text-cyan-100">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactSection;
