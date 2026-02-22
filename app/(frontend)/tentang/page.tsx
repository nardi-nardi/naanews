import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/app/components/site-shell";

export const metadata: Metadata = {
  title: "Tentang Narzza Media Digital - Perusahaan Media Digital Inovatif",
  description:
    "Narzza Media Digital adalah perusahaan media digital yang menghadirkan konten teknologi dalam format interaktif dan mudah dicerna.",
};

const highlights = [
  {
    title: "Visi Perusahaan",
    points: [
      "Menjadi platform media digital terdepan yang mengubah cara orang mengonsumsi informasi teknologi.",
      "Menciptakan ekosistem pembelajaran yang interaktif dan engaging untuk profesional tech.",
      "Membangun komunitas pembaca yang aktif dan terus berkembang di era digital.",
    ],
  },
  {
    title: "Misi Kami",
    points: [
      "Menyajikan konten berkualitas tinggi dalam format yang mudah dipahami dan cepat dicerna.",
      "Memberikan value kepada pembaca melalui tutorial, riset, dan analisis mendalam.",
      "Berinovasi dalam penyampaian konten dengan pendekatan UX yang user-friendly.",
    ],
  },
  {
    title: "Format Konten Unik",
    points: [
      "Setiap artikel dipecah jadi deret Q&A interaktif, mirip percakapan dengan mentor.",
      "Dilengkapi visual (diagram, screenshot, ilustrasi) untuk pemahaman lebih baik.",
      "Takeaway ringkas di akhir setiap artikel untuk pembacaan cepat.",
    ],
  },
  {
    title: "Produk & Layanan",
    points: [
      "Platform media digital dengan konten berita, tutorial, dan riset teknologi.",
      "E-commerce untuk merchandise dan produk digital.",
      "Roadmap pembelajaran terstruktur untuk pengembangan skill.",
      "Buku interaktif dengan format Q&A yang engaging.",
    ],
  },
];

const team = [
  { label: "Nama Perusahaan", value: "Narzza Media Digital", icon: "🏢" },
  { label: "Tahun Berdiri", value: "2024", icon: "📅" },
  { label: "Fokus Bisnis", value: "Media Digital & EdTech", icon: "🎯" },
  { label: "Model Bisnis", value: "Content + E-commerce", icon: "💼" },
  { label: "Tim", value: "15+ Professionals", icon: "👥" },
  { label: "Lokasi", value: "Remote-first, Indonesia", icon: "🌏" },
];

const founders = [
  {
    name: "Nardi",
    role: "Founder & CEO",
    avatar: "👨‍💼",
    description:
      "Visioner di balik Narzza Media Digital dengan passion untuk mengubah cara orang mengonsumsi konten teknologi.",
  },
  {
    name: "Nur Azizah Azzahra",
    role: "Co-Founder & COO",
    avatar: "👩‍💼",
    description:
      "Mengatur operasional dan strategi bisnis untuk memastikan pertumbuhan perusahaan yang berkelanjutan.",
  },
];

const employees = [
  { name: "GPT-4", role: "Content Writer", avatar: "🤖", team: "Content" },
  { name: "Claude", role: "Technical Writer", avatar: "🧠", team: "Content" },
  { name: "Gemini", role: "Research Analyst", avatar: "💎", team: "Research" },
  {
    name: "Perplexity",
    role: "Search Specialist",
    avatar: "🔍",
    team: "Research",
  },
  { name: "Midjourney", role: "Visual Designer", avatar: "🎨", team: "Design" },
  { name: "DALL-E", role: "Graphic Artist", avatar: "🖼️", team: "Design" },
  {
    name: "Copilot",
    role: "Code Assistant",
    avatar: "💻",
    team: "Engineering",
  },
  {
    name: "Cursor",
    role: "Development Lead",
    avatar: "⚡",
    team: "Engineering",
  },
  { name: "Llama", role: "Data Processor", avatar: "🦙", team: "Data" },
  { name: "Mistral", role: "Analytics Expert", avatar: "🌪️", team: "Data" },
];

const contact = [
  { label: "Email Bisnis", value: "contact@narzza.com", icon: "📧" },
  { label: "Email Umum", value: "narzzaofficial@gmail.com", icon: "✉️" },
  { label: "GitHub", value: "github.com/narzza-media", icon: "💻" },
  { label: "LinkedIn", value: "linkedin.com/company/narzza-media", icon: "🔗" },
  { label: "Twitter/X", value: "@narzzamedia", icon: "🐦" },
  { label: "Instagram", value: "@narzza.media", icon: "📸" },
];

const achievements = [
  { number: "10K+", label: "Monthly Readers", icon: "👁️" },
  { number: "500+", label: "Articles Published", icon: "📝" },
  { number: "50+", label: "Tutorial Roadmaps", icon: "🗺️" },
  { number: "1000+", label: "Community Members", icon: "👥" },
];

const values = [
  {
    icon: "🎯",
    title: "Kualitas Konten",
    description:
      "Setiap artikel melalui proses riset dan review mendalam untuk memastikan akurasi dan relevansi.",
  },
  {
    icon: "🚀",
    title: "Inovasi Berkelanjutan",
    description:
      "Kami terus berinovasi dalam format penyajian konten untuk pengalaman pembaca yang lebih baik.",
  },
  {
    icon: "🤝",
    title: "Community First",
    description:
      "Membangun komunitas yang saling support dan berbagi pengetahuan untuk tumbuh bersama.",
  },
  {
    icon: "💡",
    title: "Pembelajaran Praktis",
    description:
      "Fokus pada konten yang actionable dan dapat langsung diterapkan dalam pekerjaan sehari-hari.",
  },
];

const stack = [
  "Next.js 14 + App Router",
  "TypeScript & Tailwind CSS",
  "MongoDB untuk database",
  "DigitalOcean Spaces",
  "Vercel Deployment",
  "Recharts untuk visualisasi",
];

const partners = [
  "Digital Ocean",
  "Vercel",
  "MongoDB Atlas",
  "GitHub",
  "Unsplash",
  "YouTube",
];

export default function TentangPage() {
  return (
    <SiteShell activePath="/tentang">
      <div className="space-y-6">
        {/* Hero Section */}
        <header className="glass-panel overflow-hidden rounded-3xl shadow-xl shadow-cyan-500/5 ring-1 ring-white/5">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Tentang Perusahaan
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-50 md:text-5xl">
              Narzza Media Digital
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-200">
              Kami adalah{" "}
              <strong className="text-cyan-300">
                perusahaan media digital
              </strong>{" "}
              yang berfokus pada transformasi cara orang mengonsumsi konten
              teknologi. Dengan pendekatan inovatif dan format interaktif,
              Narzza Media Digital menghadirkan pengalaman membaca yang lebih
              engaging dan efisien.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/berita"
                className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
              >
                Baca Konten Kami
              </Link>
              <Link
                href="/toko"
                className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-500/20"
              >
                Lihat Produk
              </Link>
            </div>
          </div>
        </header>

        {/* Achievements Section */}
        <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
          <h2 className="mb-5 text-2xl font-bold text-slate-50">
            Pencapaian Kami
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-5 text-center"
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

        {/* Visi, Misi & Highlights */}
        <div className="grid gap-4 md:grid-cols-2">
          {highlights.map((item) => (
            <section
              key={item.title}
              className="glass-panel h-full rounded-2xl p-6 ring-1 ring-white/5"
            >
              <h2 className="mb-4 text-xl font-bold text-slate-50">
                {item.title}
              </h2>
              <ul className="space-y-3 text-sm text-slate-300">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span
                      className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-cyan-400"
                      aria-hidden
                    />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Core Values */}
        <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
          <h2 className="mb-5 text-2xl font-bold text-slate-50">
            Nilai-Nilai Kami
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-5"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 font-semibold text-slate-50">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Founders & Team Section */}
        <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
          <h2 className="mb-2 text-2xl font-bold text-slate-50">Tim Kami</h2>
          <p className="mb-5 text-sm text-slate-400">
            Orang-orang di balik Narzza Media Digital
          </p>

          {/* Founders */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-cyan-300">
              Founders
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {founders.map((founder) => (
                <div
                  key={founder.name}
                  className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-5"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 text-2xl">
                      {founder.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-50">
                        {founder.name}
                      </h4>
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
              {employees.map((employee) => (
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

        {/* Company Info */}
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
            {team.map((item) => (
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

        {/* Contact Section */}
        <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
          <h2 className="mb-2 text-2xl font-bold text-slate-50">
            Hubungi Kami
          </h2>
          <p className="mb-5 text-sm text-slate-400">
            Tertarik untuk berkolaborasi, partnership, atau punya pertanyaan?
            Kami siap mendengar Anda.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contact.map((item) => (
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
                <p className="text-sm font-semibold text-cyan-100">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-50">Teknologi</h2>
              <p className="text-sm text-slate-400">
                Tech stack modern yang kami gunakan untuk membangun platform
              </p>
            </div>
            <Link
              href="https://github.com/naa-news"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-600/60 bg-slate-800/60 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-100"
            >
              GitHub Repository
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-700/60 bg-slate-900/40 px-4 py-2 text-sm font-medium text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="glass-panel rounded-2xl p-6 ring-1 ring-white/5">
          <h2 className="mb-2 text-2xl font-bold text-slate-50">
            Technology Partners
          </h2>
          <p className="mb-5 text-sm text-slate-400">
            Platform dan tools yang mendukung operasional kami
          </p>
          <div className="flex flex-wrap gap-3">
            {partners.map((partner) => (
              <div
                key={partner}
                className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 px-5 py-3 text-sm font-semibold text-slate-200"
              >
                {partner}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="glass-panel overflow-hidden rounded-2xl ring-1 ring-white/5">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-50">
              Mari Tumbuh Bersama
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-300">
              Bergabunglah dengan ribuan profesional yang sudah mempercayai
              Narzza Media Digital sebagai sumber informasi teknologi
              terpercaya.
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
      </div>
    </SiteShell>
  );
}
