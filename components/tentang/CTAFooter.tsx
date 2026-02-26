import Link from "next/link";

const CTAFooter = () => {
  return (
    <section className="glass-panel overflow-hidden rounded-2xl ring-1 ring-white/5">
      <div className="bg-linear-to-br from-cyan-500/10 to-blue-600/10 p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-50">
          Mari Tumbuh Bersama
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300">
          Bergabunglah dengan ribuan profesional yang sudah mempercayai Narzza
          Media Digital sebagai sumber informasi teknologi terpercaya.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
          >
            Mulai Membaca
          </Link>
          <Link
            href="/roadmap"
            className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
          >
            Lihat Roadmap
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTAFooter;
