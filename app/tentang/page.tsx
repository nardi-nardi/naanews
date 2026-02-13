import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/app/components/site-shell";

export const metadata: Metadata = {
  title: "Tentang NAA Newsroom",
  description: "Alasan dibuatnya NAA Newsroom, tim di baliknya, dan cara menghubungi kami.",
};

const highlights = [
  {
    title: "Kenapa web ini ada?",
    points: [
      "Menyajikan berita, tutorial, dan riset dalam format chat biar lebih ringan dibaca.",
      "Memotong waktu baca panjang jadi inti cepat: pertanyaan singkat, jawaban padat.",
      "Eksperimen UX untuk konten teknis yang biasanya kaku jadi lebih ramah.",
    ],
  },
  {
    title: "Bagaimana formatnya?",
    points: [
      "Setiap konten dipecah jadi deret Q&A, mirip percakapan teman kerja.",
      "Bisa sisip gambar tiap line untuk konteks visual (diagram, screenshot, ilustrasi).",
      "Ada takeaway ringkas di akhir supaya pembaca dapat poin utama dalam hitungan detik.",
    ],
  },
];

const team = [
  { label: "Tim", value: "NAA Dev & Editorial" },
  { label: "Fokus", value: "Eksperimen konten tech yang cepat dicerna" },
  { label: "Lokasi", value: "Remote-first" },
];

const contact = [
  { label: "Email", value: "halo@naa.news" },
  { label: "GitHub", value: "github.com/naa-dev" },
  { label: "LinkedIn", value: "linkedin.com/company/naa-dev" },
];

const stack = [
  "Next.js 14 + App Router",
  "TypeScript & Tailwind",
  "MongoDB untuk konten",
  "DigitalOcean Spaces untuk media",
];

export default function TentangPage() {
  return (
    <SiteShell activePath="/tentang">
      <div className="space-y-6">
        <header className="glass-panel rounded-3xl p-6 shadow-xl shadow-cyan-500/5 ring-1 ring-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Tentang</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-50">Mengapa NAA Newsroom dibuat</h1>
          <p className="mt-3 text-slate-300">
            NAA Newsroom lahir dari kebutuhan membaca cepat tanpa kehilangan konteks. Kami uji cara baru menyajikan berita,
            tutorial, dan riset dalam format percakapan supaya lebih enak di-scroll dan mudah diingat.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => (
            <section key={item.title} className="glass-panel h-full rounded-2xl p-5 ring-1 ring-white/5">
              <h2 className="text-lg font-semibold text-slate-100">{item.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="glass-panel rounded-2xl p-5 ring-1 ring-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Siapa di baliknya?</h2>
              <p className="text-sm text-slate-400">Tim kecil yang suka eksperimen konten dan produk.</p>
            </div>
            <Link
              href="/admin"
              className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
            >
              Buka Admin
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {team.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="text-sm font-semibold text-slate-50">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-5 ring-1 ring-white/5">
          <h2 className="text-lg font-semibold text-slate-100">Kontak & kontribusi</h2>
          <p className="mt-1 text-sm text-slate-400">
            Punya ide topik, mau kolaborasi, atau menemukan bug? Silakan hubungi atau kirim PR.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {contact.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="text-sm font-semibold text-cyan-100">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-5 ring-1 ring-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Teknologi</h2>
              <p className="text-sm text-slate-400">Stack yang dipakai untuk membangun situs ini.</p>
            </div>
            <Link
              href="https://github.com/naa-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-100"
            >
              Lihat repositori
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1 text-xs text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
