export type Story = {
  id: number;
  name: string;
  label: string;
  type: "Berita" | "Tutorial" | "Riset";
  palette: string;
  viral: boolean;
};

export type ChatLine = {
  role: "q" | "a";
  text: string;
  image?: string;
};

export type Feed = {
  id: number;
  title: string;
  category: "Berita" | "Tutorial" | "Riset";
  time: string;
  popularity: number;
  image: string;
  lines: ChatLine[];
  takeaway: string;
};

export type BookChapter = {
  title: string;
  lines: ChatLine[];
};

export type Book = {
  id: number;
  title: string;
  author: string;
  cover: string;
  genre: string;
  pages: number;
  rating: number;
  description: string;
  chapters: BookChapter[];
};

export type NavItem = {
  title: string;
  note: string;
  href: "/" | "/berita" | "/tutorial" | "/riset" | "/buku" | "/analytics";
};

export const stories: Story[] = [
  { id: 1, name: "AI Corner", label: "AI", type: "Berita", palette: "from-sky-400 to-blue-500", viral: true },
  { id: 2, name: "Code Daily", label: "CD", type: "Tutorial", palette: "from-amber-300 to-orange-500", viral: true },
  { id: 3, name: "Lab NAA", label: "LAB", type: "Riset", palette: "from-emerald-400 to-teal-500", viral: false },
  { id: 4, name: "Cyber Byte", label: "CB", type: "Berita", palette: "from-indigo-400 to-blue-600", viral: true },
  { id: 5, name: "UX Pulse", label: "UX", type: "Tutorial", palette: "from-pink-400 to-rose-500", viral: false },
  { id: 6, name: "Data Hunt", label: "DH", type: "Riset", palette: "from-violet-400 to-fuchsia-500", viral: true },
];

export const feeds: Feed[] = [
  {
    id: 1,
    title: "Model AI Lokal Makin Ringan untuk Device Mid-Range",
    category: "Berita",
    time: "2 jam lalu",
    popularity: 98,
    image: "https://picsum.photos/seed/ai-local/800/400",
    lines: [
      { role: "q", text: "Emang dampaknya buat user biasa apa?" },
      { role: "a", text: "Chatbot bisa jalan lebih responsif di HP 6-8 GB RAM tanpa delay panjang." },
      { role: "q", text: "Apa ini cuma demo lab?" },
      { role: "a", text: "Sudah ada uji publik terbatas, akurasi naik sekitar 11% dibanding baseline sebelumnya." },
    ],
    takeaway: "Ringkas: performa naik, biaya komputasi turun, dan akses AI jadi lebih merata.",
  },
  {
    id: 2,
    title: "Tutorial: Bikin API Cache Layer di Next.js 16",
    category: "Tutorial",
    time: "5 jam lalu",
    popularity: 94,
    image: "https://picsum.photos/seed/cache-nextjs/800/400",
    lines: [
      { role: "q", text: "Kenapa perlu cache dulu sebelum scaling server?" },
      { role: "a", text: "Karena request berulang bisa dipangkas. Latency turun dan beban infra lebih stabil." },
      { role: "q", text: "Mulai dari mana?" },
      { role: "a", text: "Mulai dengan endpoint terpanas, kasih TTL singkat, lalu ukur hit ratio per route." },
      { role: "q", text: "Indikator berhasil?" },
      { role: "a", text: "P95 response time turun, dan error timeout menurun saat traffic puncak." },
    ],
    takeaway: "Step utama: identifikasi bottleneck, pasang cache, ukur metrik, ulangi iterasi.",
  },
  {
    id: 3,
    title: "Eksperimen A/B UI Chat News vs Artikel Klasik",
    category: "Riset",
    time: "kemarin",
    popularity: 91,
    image: "https://picsum.photos/seed/ab-test-ui/800/400",
    lines: [
      { role: "q", text: "Format chat lebih efektif atau cuma trend?" },
      { role: "a", text: "Di uji 7 hari, completion rate naik 24% pada pembaca mobile." },
      { role: "q", text: "Bagian apa yang paling ngaruh?" },
      { role: "a", text: "Q&A bertahap bikin pembaca stay lebih lama karena konteks disajikan per blok kecil." },
      { role: "q", text: "Ada kekurangan?" },
      { role: "a", text: "Perlu editor yang disiplin agar jawaban tetap akurat dan tidak oversimplified." },
    ],
    takeaway: "Insight: format chat cocok untuk topik panjang, asal quality control editorial dijaga.",
  },
  {
    id: 4,
    title: "Chip ARM Generasi Baru Klaim Efisiensi 30% Lebih Tinggi",
    category: "Berita",
    time: "7 jam lalu",
    popularity: 89,
    image: "https://picsum.photos/seed/arm-chip/800/400",
    lines: [
      { role: "q", text: "Apa yang paling menonjol dari rilis ini?" },
      { role: "a", text: "Performa per watt naik, jadi cocok untuk laptop tipis dan server hemat daya." },
      { role: "q", text: "Dampak ke pengguna?" },
      { role: "a", text: "Baterai lebih awet dan suhu perangkat lebih stabil saat multitasking berat." },
    ],
    takeaway: "Efisiensi jadi fokus utama, bukan cuma angka benchmark mentah.",
  },
  {
    id: 5,
    title: "Tutorial: Setup CI/CD Next.js dengan Testing Otomatis",
    category: "Tutorial",
    time: "1 hari lalu",
    popularity: 87,
    image: "https://picsum.photos/seed/cicd-nextjs/800/400",
    lines: [
      { role: "q", text: "Kenapa CI/CD penting dari awal?" },
      { role: "a", text: "Agar deploy konsisten dan bug dasar ketangkep sebelum masuk production." },
      { role: "q", text: "Langkah minimal?" },
      { role: "a", text: "Lint, unit test, lalu build check di setiap pull request." },
    ],
    takeaway: "Pipeline sederhana sudah cukup menurunkan risiko rilis broken.",
  },
  {
    id: 6,
    title: "Riset: Prompt Bertahap Tingkatkan Akurasi Ringkasan Dokumen",
    category: "Riset",
    time: "2 hari lalu",
    popularity: 85,
    image: "https://picsum.photos/seed/prompt-research/800/400",
    lines: [
      { role: "q", text: "Seberapa besar peningkatannya?" },
      { role: "a", text: "Akurasi factual meningkat 14% saat prompt dipecah jadi beberapa tahap." },
      { role: "q", text: "Trade-offnya apa?" },
      { role: "a", text: "Waktu komputasi sedikit lebih panjang, tapi error kritis menurun." },
    ],
    takeaway: "Prompt bertahap lebih stabil untuk dokumen panjang dan kompleks.",
  },
  {
    id: 7,
    title: "Browser Baru Berbasis Rust Klaim 2x Lebih Cepat dari Chrome",
    category: "Berita",
    time: "3 jam lalu",
    popularity: 96,
    image: "https://picsum.photos/seed/rust-browser/800/400",
    lines: [
      { role: "q", text: "Kok bisa lebih cepat? Chrome kan udah mature banget." },
      { role: "a", text: "Pakai rendering engine baru yang ditulis full Rust, garbage collector hampir nol, jadi memory usage jauh lebih rendah." },
      { role: "q", text: "Udah bisa dipake sehari-hari?" },
      { role: "a", text: "Masih beta, tapi daily driver beberapa developer sudah coba dan laporan crash-nya rendah." },
      { role: "q", text: "Extension Chrome bisa dipake?" },
      { role: "a", text: "Belum full compatible, tapi roadmap-nya Q3 tahun ini target 90% extension support." },
      { role: "q", text: "Bagaimana soal privasi?" },
      { role: "a", text: "Built-in tracker blocker dan DNS-over-HTTPS by default. Tidak ada telemetry kecuali user opt-in." },
    ],
    takeaway: "Rust engine menjanjikan performa tinggi dan efisiensi memori, tapi ekosistem extension masih perlu waktu.",
  },
  {
    id: 8,
    title: "Tutorial: Fullstack Authentication dengan Next.js dan Auth.js v5",
    category: "Tutorial",
    time: "4 jam lalu",
    popularity: 93,
    image: "https://picsum.photos/seed/auth-nextjs/800/400",
    lines: [
      { role: "q", text: "Kenapa Auth.js v5 bukan v4?" },
      { role: "a", text: "v5 sudah native support App Router, edge runtime, dan session strategy lebih fleksibel." },
      { role: "q", text: "Provider apa aja yang disupport?" },
      { role: "a", text: "Google, GitHub, Discord, credentials, dan bisa custom OAuth provider sendiri." },
      { role: "q", text: "Gimana handle role-based access?" },
      { role: "a", text: "Tambahkan field role di session callback, lalu cek di middleware atau server component." },
      { role: "q", text: "Aman buat production?" },
      { role: "a", text: "Ya, CSRF protection dan encrypted JWT sudah built-in. Pastikan set secret key yang kuat." },
      { role: "q", text: "Database session vs JWT?" },
      { role: "a", text: "JWT lebih cepat karena stateless, tapi database session lebih aman untuk revoke akses instant." },
    ],
    takeaway: "Auth.js v5 + Next.js App Router = auth setup modern yang aman dan scalable.",
  },
  {
    id: 9,
    title: "Riset: Dampak Dark Mode terhadap Produktivitas Developer",
    category: "Riset",
    time: "6 jam lalu",
    popularity: 90,
    image: "https://picsum.photos/seed/dark-mode-study/800/400",
    lines: [
      { role: "q", text: "Dark mode beneran bikin produktif atau cuma estetik?" },
      { role: "a", text: "Di studi 30 hari dengan 200 developer, kelompok dark mode report eye strain 18% lebih rendah." },
      { role: "q", text: "Coding speed-nya gimana?" },
      { role: "a", text: "Tidak ada perbedaan signifikan di typing speed, tapi focus duration rata-rata naik 12 menit per sesi." },
      { role: "q", text: "Kondisi pencahayaan ngaruh?" },
      { role: "a", text: "Sangat ngaruh. Dark mode optimal di ruangan redup. Di ruang terang, light mode justru lebih nyaman." },
      { role: "q", text: "Rekomendasi akhirnya?" },
      { role: "a", text: "Gunakan auto-switch berdasarkan ambient light sensor. Jangan paksa satu mode untuk semua kondisi." },
    ],
    takeaway: "Dark mode bantu kurangi eye strain, tapi efektivitasnya bergantung pada kondisi pencahayaan ruangan.",
  },
  {
    id: 10,
    title: "OpenAI Rilis Model GPT-5 Turbo dengan Context 500K Token",
    category: "Berita",
    time: "1 jam lalu",
    popularity: 99,
    image: "https://picsum.photos/seed/gpt5-release/800/400",
    lines: [
      { role: "q", text: "500K token itu setara berapa halaman?" },
      { role: "a", text: "Kurang lebih 750 halaman buku standar. Cukup untuk analisis satu novel utuh dalam satu prompt." },
      { role: "q", text: "Harganya gimana?" },
      { role: "a", text: "Sekitar 40% lebih murah per token dibanding GPT-4 Turbo, karena arsitektur inference baru." },
      { role: "q", text: "Reasoning-nya lebih bagus?" },
      { role: "a", text: "Benchmark MMLU naik 8 poin, dan coding benchmark HumanEval tembus 96.2%." },
      { role: "q", text: "Kapan available untuk semua user?" },
      { role: "a", text: "Rollout bertahap mulai minggu ini. Plus dan Team user duluan, free tier menyusul bulan depan." },
      { role: "q", text: "Multimodal juga?" },
      { role: "a", text: "Ya, vision, audio input, dan tool use sudah native. Bisa analisis video pendek juga." },
    ],
    takeaway: "GPT-5 Turbo: lebih pintar, lebih murah, context window raksasa, dan full multimodal.",
  },
  {
    id: 11,
    title: "Tutorial: Optimasi Web Vitals untuk Skor Lighthouse 100",
    category: "Tutorial",
    time: "8 jam lalu",
    popularity: 88,
    image: "https://picsum.photos/seed/lighthouse-score/800/400",
    lines: [
      { role: "q", text: "Skor 100 itu realistis buat production app?" },
      { role: "a", text: "Realistis kalau fokus di LCP, CLS, dan INP. Ketiga metrik ini paling berdampak ke skor." },
      { role: "q", text: "LCP paling susah diperbaiki, tips-nya?" },
      { role: "a", text: "Preload hero image, gunakan next/image dengan priority, dan pastikan font tidak blocking render." },
      { role: "q", text: "CLS sering muncul di mana?" },
      { role: "a", text: "Iklan yang load telat, image tanpa width/height, dan dynamic content yang geser layout." },
      { role: "q", text: "INP itu apa?" },
      { role: "a", text: "Interaction to Next Paint — ukur seberapa cepat UI merespons klik atau input user. Target di bawah 200ms." },
      { role: "q", text: "Tool monitoring yang recommended?" },
      { role: "a", text: "Pakai web-vitals library di production, kirim ke analytics, dan pantau via CrUX dashboard." },
    ],
    takeaway: "Fokus di 3 Core Web Vitals: LCP, CLS, INP. Ukur di production, bukan cuma di lab.",
  },
  {
    id: 12,
    title: "Riset: Perbandingan State Management React 2026",
    category: "Riset",
    time: "1 hari lalu",
    popularity: 86,
    image: "https://picsum.photos/seed/react-state/800/400",
    lines: [
      { role: "q", text: "Zustand vs Jotai vs Redux Toolkit, mana yang menang?" },
      { role: "a", text: "Tergantung use case. Zustand paling populer untuk medium app, Jotai untuk atomic state, RTK untuk enterprise." },
      { role: "q", text: "Bundle size ngaruh banyak?" },
      { role: "a", text: "Zustand cuma 1.1KB gzipped, Jotai 3.5KB, RTK sekitar 11KB. Untuk app kecil, Zustand jelas menang." },
      { role: "q", text: "Server component compatible?" },
      { role: "a", text: "Ketiganya butuh client boundary. Tapi Zustand dan Jotai lebih mudah di-scope ke komponen tertentu." },
      { role: "q", text: "DevTools gimana?" },
      { role: "a", text: "RTK punya Redux DevTools yang paling mature. Zustand bisa pakai middleware devtools. Jotai ada plugin tapi basic." },
      { role: "q", text: "Rekomendasi untuk project baru?" },
      { role: "a", text: "Mulai tanpa library dulu pakai React context. Kalau sudah kompleks, migrate ke Zustand." },
    ],
    takeaway: "Tidak ada solusi universal — pilih berdasarkan skala project dan kebutuhan debugging.",
  },
  {
    id: 13,
    title: "Kubernetes 2.0 Preview: Simpler Config, Faster Scaling",
    category: "Berita",
    time: "5 jam lalu",
    popularity: 92,
    image: "https://picsum.photos/seed/k8s-v2/800/400",
    lines: [
      { role: "q", text: "K8s 2.0 beneran lebih simple?" },
      { role: "a", text: "YAML config dikurangi drastis. Pod spec baru lebih deklaratif dan default-nya production-ready." },
      { role: "q", text: "Backward compatible?" },
      { role: "a", text: "Ada migration tool otomatis. Manifest v1 tetap jalan sampai 2028, tapi fitur baru hanya di v2." },
      { role: "q", text: "Autoscaling-nya apa yang berubah?" },
      { role: "a", text: "HPA v3 bisa scale berdasarkan custom metrics tanpa adapter tambahan. Respon scale-up 3x lebih cepat." },
      { role: "q", text: "Kapan stable release?" },
      { role: "a", text: "Target Q4 2026. Sekarang masih alpha, tapi sudah bisa dicoba di test cluster." },
    ],
    takeaway: "K8s 2.0 fokus ke developer experience: config lebih simple, scaling lebih cepat.",
  },
  {
    id: 14,
    title: "Tutorial: Integrasi AI Chatbot di Website dengan Vercel AI SDK",
    category: "Tutorial",
    time: "10 jam lalu",
    popularity: 91,
    image: "https://picsum.photos/seed/vercel-ai-sdk/800/400",
    lines: [
      { role: "q", text: "Vercel AI SDK itu apa bedanya sama langsung panggil API OpenAI?" },
      { role: "a", text: "SDK-nya handle streaming, token counting, rate limiting, dan UI hooks out of the box." },
      { role: "q", text: "Support model selain OpenAI?" },
      { role: "a", text: "Ya, bisa pakai Anthropic, Google Gemini, Mistral, bahkan local model via Ollama." },
      { role: "q", text: "Streaming response-nya smooth?" },
      { role: "a", text: "Pakai useChat hook, response langsung stream ke UI character by character. UX-nya sangat responsif." },
      { role: "q", text: "Bisa handle conversation history?" },
      { role: "a", text: "Built-in. Chat history di-maintain di client state, dan bisa di-persist ke database kalau mau." },
      { role: "q", text: "Berapa lama setup awal?" },
      { role: "a", text: "Kalau sudah ada Next.js project, kurang dari 30 menit untuk chatbot basic yang functional." },
    ],
    takeaway: "Vercel AI SDK bikin integrasi chatbot jadi plug-and-play. Cocok untuk MVP cepat.",
  },
  {
    id: 15,
    title: "Riset: Efektivitas Pair Programming AI vs Human",
    category: "Riset",
    time: "3 hari lalu",
    popularity: 84,
    image: "https://picsum.photos/seed/pair-prog-ai/800/400",
    lines: [
      { role: "q", text: "AI pair programmer bisa gantiin human partner?" },
      { role: "a", text: "Belum sepenuhnya. Di task routine, AI 15% lebih cepat. Tapi di architectural decision, human masih unggul." },
      { role: "q", text: "Kualitas code-nya gimana?" },
      { role: "a", text: "Bug rate AI pair programming 8% lebih rendah untuk boilerplate code, tapi 12% lebih tinggi untuk logic kompleks." },
      { role: "q", text: "Developer satisfaction?" },
      { role: "a", text: "72% developer prefer AI untuk repetitive task, tapi 85% masih mau human untuk code review kritis." },
      { role: "q", text: "Best practice-nya gimana?" },
      { role: "a", text: "Hybrid approach: AI untuk scaffolding dan boilerplate, human untuk review, architecture, dan edge case." },
    ],
    takeaway: "AI pair programming efektif untuk task rutin, tapi human judgment tetap krusial untuk keputusan arsitektur.",
  },
  {
    id: 16,
    title: "Apple Rilis M5 Ultra: Neural Engine 2x Lebih Kuat",
    category: "Berita",
    time: "30 menit lalu",
    popularity: 97,
    image: "https://picsum.photos/seed/m5-ultra-chip/800/400",
    lines: [
      { role: "q", text: "M5 Ultra buat siapa?" },
      { role: "a", text: "Target utama creative pro dan ML engineer. Neural engine 40 TOPS, bisa training model medium langsung di device." },
      { role: "q", text: "Dibanding M4 Ultra, apa yang beda?" },
      { role: "a", text: "GPU core naik 50%, memory bandwidth 800GB/s, dan support hingga 256GB unified memory." },
      { role: "q", text: "Harga kira-kira berapa?" },
      { role: "a", text: "Mac Studio dengan M5 Ultra mulai dari $4,999. Mahal, tapi dibanding workstation equivalent lebih hemat." },
      { role: "q", text: "Bisa buat gaming?" },
      { role: "a", text: "Technically bisa dan performa luar biasa, tapi game library macOS masih terbatas dibanding Windows." },
      { role: "q", text: "Worth it buat developer biasa?" },
      { role: "a", text: "Overkill. M5 Pro sudah lebih dari cukup untuk web development dan mobile app." },
    ],
    takeaway: "M5 Ultra untuk pro yang butuh power maksimal. Developer biasa cukup M5 Pro.",
  },
  {
    id: 17,
    title: "Tutorial: Database Edge dengan Turso dan Drizzle ORM",
    category: "Tutorial",
    time: "12 jam lalu",
    popularity: 86,
    image: "https://picsum.photos/seed/turso-drizzle/800/400",
    lines: [
      { role: "q", text: "Kenapa edge database, bukan Postgres biasa?" },
      { role: "a", text: "Data disimpan dekat user secara geografis. Query latency bisa turun dari 200ms ke 5ms." },
      { role: "q", text: "Turso itu based on apa?" },
      { role: "a", text: "Fork dari libSQL yang merupakan fork SQLite. Jadi ringan, embedded, dan bisa replicate ke edge." },
      { role: "q", text: "Drizzle ORM kenapa bukan Prisma?" },
      { role: "a", text: "Drizzle lebih ringan, type-safe tanpa code generation, dan bundle size jauh lebih kecil untuk edge." },
      { role: "q", text: "Migration gimana?" },
      { role: "a", text: "Drizzle punya drizzle-kit yang auto-generate migration SQL dari schema TypeScript." },
      { role: "q", text: "Cocok buat app skala apa?" },
      { role: "a", text: "Small to medium. Untuk app besar dengan complex join dan transaction, tetap pertimbangkan Postgres." },
    ],
    takeaway: "Turso + Drizzle = combo ringan untuk app yang butuh latency rendah di edge.",
  },
  {
    id: 18,
    title: "Riset: Pengaruh Code Review AI terhadap Bug Rate di Production",
    category: "Riset",
    time: "2 hari lalu",
    popularity: 83,
    image: "https://picsum.photos/seed/ai-code-review/800/400",
    lines: [
      { role: "q", text: "AI code review beneran ngurangin bug?" },
      { role: "a", text: "Di studi 6 bulan dengan 50 tim, bug rate production turun rata-rata 21% setelah adopsi AI review." },
      { role: "q", text: "Jenis bug apa yang paling ketangkep?" },
      { role: "a", text: "Null reference, off-by-one error, dan resource leak. Pattern-based bug paling mudah dideteksi AI." },
      { role: "q", text: "False positive banyak?" },
      { role: "a", text: "Awalnya sekitar 35%, tapi setelah fine-tuning 2 bulan turun ke 12%. Tim perlu sabar di fase awal." },
      { role: "q", text: "Human reviewer masih perlu?" },
      { role: "a", text: "Wajib. AI bagus untuk pattern matching, tapi business logic dan security review tetap butuh human." },
      { role: "q", text: "Tool yang dipakai?" },
      { role: "a", text: "Campuran GitHub Copilot code review, CodeRabbit, dan custom rules pakai SonarQube." },
    ],
    takeaway: "AI code review efektif untuk bug mekanis, tapi human review tetap esensial untuk logic dan security.",
  },
];

export const navItems: NavItem[] = [
  { title: "Home Feed", note: "Semua update terbaru", href: "/" },
  { title: "Berita", note: "Tren dan breaking tech", href: "/berita" },
  { title: "Tutorial", note: "Step-by-step praktis", href: "/tutorial" },
  { title: "Riset", note: "Hasil eksperimen tim", href: "/riset" },
  { title: "Buku", note: "Belajar lewat Q&A", href: "/buku" },
  { title: "Analytics", note: "Pantau konten viral", href: "/analytics" },
];

export const books: Book[] = [
  {
    id: 1,
    title: "Clean Code dalam Bahasa Manusia",
    author: "Tim NAA Editorial",
    cover: "https://picsum.photos/seed/clean-code-book/400/600",
    genre: "Software Engineering",
    pages: 48,
    rating: 4.8,
    description: "Prinsip clean code disederhanakan lewat format tanya jawab. Cocok buat developer yang mau nulis kode lebih rapi tanpa harus baca buku tebal.",
    chapters: [
      {
        title: "Bab 1: Kenapa Clean Code Penting?",
        lines: [
          { role: "q", text: "Clean code itu sebenernya apa sih?" },
          { role: "a", text: "Kode yang bisa dibaca, dipahami, dan dimodifikasi dengan mudah oleh developer lain — termasuk diri sendiri 6 bulan ke depan." },
          { role: "q", text: "Kalau kode udah jalan, kenapa harus clean?" },
          { role: "a", text: "Karena 80% waktu developer dihabiskan untuk membaca kode, bukan menulis. Kode yang berantakan = waktu terbuang." },
          { role: "q", text: "Contoh kode kotor yang sering ditemui?" },
          { role: "a", text: "Nama variabel satu huruf, fungsi 200+ baris, nested if 5 level, dan komentar yang menjelaskan hal yang sudah jelas." },
          { role: "q", text: "Mulai dari mana biar kode lebih clean?" },
          { role: "a", text: "Tiga hal: naming yang deskriptif, fungsi kecil yang fokus satu tugas, dan hapus dead code tanpa ragu." },
        ],
      },
      {
        title: "Bab 2: Naming yang Bermakna",
        lines: [
          { role: "q", text: "Nama variabel penting banget ya?" },
          { role: "a", text: "Sangat. Nama variabel adalah dokumentasi paling minimal. 'userAge' jauh lebih baik daripada 'x' atau 'data1'." },
          { role: "q", text: "Fungsi sebaiknya dinamai gimana?" },
          { role: "a", text: "Gunakan verb + noun. Contoh: 'calculateTotalPrice', 'fetchUserProfile', 'validateEmailFormat'." },
          { role: "q", text: "Boolean variable gimana?" },
          { role: "a", text: "Prefix 'is', 'has', 'can', atau 'should'. Contoh: 'isLoggedIn', 'hasPermission', 'canEdit'." },
          { role: "q", text: "Kalau nama terlalu panjang gimana?" },
          { role: "a", text: "Lebih baik panjang tapi jelas, daripada pendek tapi bikin bingung. IDE modern punya autocomplete." },
        ],
      },
      {
        title: "Bab 3: Fungsi yang Fokus",
        lines: [
          { role: "q", text: "Satu fungsi idealnya berapa baris?" },
          { role: "a", text: "Tidak ada angka pasti, tapi rule of thumb: kalau perlu scroll untuk baca satu fungsi, itu sudah terlalu panjang." },
          { role: "q", text: "Single responsibility itu maksudnya?" },
          { role: "a", text: "Satu fungsi hanya melakukan SATU hal. Kalau ada kata 'dan' saat menjelaskan fungsi, pecah jadi dua." },
          { role: "q", text: "Parameter fungsi baiknya berapa?" },
          { role: "a", text: "Idealnya 0-2. Kalau lebih dari 3, pertimbangkan untuk mengelompokkan ke object." },
          { role: "q", text: "Side effect itu apa dan kenapa bahaya?" },
          { role: "a", text: "Fungsi yang diam-diam mengubah state lain di luar scope-nya. Bikin bug susah dilacak karena behaviour tersembunyi." },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "JavaScript Modern: ES2024+ Deep Dive",
    author: "NAA Dev Team",
    cover: "https://picsum.photos/seed/js-modern-book/400/600",
    genre: "JavaScript",
    pages: 62,
    rating: 4.7,
    description: "Fitur-fitur JavaScript terbaru dijelaskan lewat dialog santai. Dari temporal API sampai pattern matching, semuanya jadi lebih mudah dipahami.",
    chapters: [
      {
        title: "Bab 1: Array & Object Terbaru",
        lines: [
          { role: "q", text: "Array method baru apa yang harus diketahui?" },
          { role: "a", text: "Array.groupBy() untuk grouping, Array.fromAsync() untuk async iterables, dan toSorted()/toReversed() yang immutable." },
          { role: "q", text: "Bedanya toSorted() sama sort()?" },
          { role: "a", text: "toSorted() return array baru tanpa mengubah original. sort() mutate array asli. Immutability lebih aman." },
          { role: "q", text: "Structuredclone itu buat apa?" },
          { role: "a", text: "Deep clone object tanpa library. Bisa handle Date, Map, Set, bahkan circular reference. Pengganti JSON.parse(JSON.stringify())." },
          { role: "q", text: "Object.hasOwn() kenapa lebih baik?" },
          { role: "a", text: "Lebih aman dari obj.hasOwnProperty() karena tetap works meskipun object dibuat dengan Object.create(null)." },
        ],
      },
      {
        title: "Bab 2: Async Pattern Lanjutan",
        lines: [
          { role: "q", text: "Promise.withResolvers() itu apa?" },
          { role: "a", text: "Shortcut untuk bikin promise yang resolve/reject-nya bisa dipanggil dari luar. Berguna untuk event-based code." },
          { role: "q", text: "Top-level await udah stabil?" },
          { role: "a", text: "Ya, di ES modules. Bisa langsung await di root module tanpa perlu async wrapper function." },
          { role: "q", text: "AbortSignal.any() fungsinya?" },
          { role: "a", text: "Gabungkan beberapa abort signal jadi satu. Useful kalau mau cancel request berdasarkan multiple condition." },
          { role: "q", text: "Error handling async yang best practice?" },
          { role: "a", text: "Selalu try-catch di level tertinggi, gunakan Error cause untuk chaining, dan jangan pernah swallow error tanpa logging." },
        ],
      },
      {
        title: "Bab 3: Pattern Matching & Decorators",
        lines: [
          { role: "q", text: "Pattern matching di JS kayak gimana?" },
          { role: "a", text: "Masih proposal stage 3, tapi konsepnya mirip switch tapi lebih powerful — bisa match berdasarkan struktur object." },
          { role: "q", text: "Decorators udah bisa dipake?" },
          { role: "a", text: "Stage 3 dan sudah di-support TypeScript 5+. Bisa dipakai untuk logging, validation, caching di level class/method." },
          { role: "q", text: "Contoh decorator yang useful?" },
          { role: "a", text: "@log untuk auto-log method calls, @memoize untuk caching return value, @validate untuk input checking." },
          { role: "q", text: "Kapan harus pakai decorator vs HOF?" },
          { role: "a", text: "Decorator untuk class/method concerns. Higher-order function untuk functional composition. Keduanya saling melengkapi." },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "System Design untuk Web Developer",
    author: "NAA Architecture Team",
    cover: "https://picsum.photos/seed/sys-design-book/400/600",
    genre: "System Design",
    pages: 56,
    rating: 4.9,
    description: "Konsep system design yang biasanya rumit, disajikan lewat pertanyaan sederhana. Dari load balancer sampai database sharding.",
    chapters: [
      {
        title: "Bab 1: Fundamentals Scaling",
        lines: [
          { role: "q", text: "Kapan app perlu di-scale?" },
          { role: "a", text: "Saat response time mulai naik di bawah traffic normal, atau CPU/memory usage konsisten di atas 70%." },
          { role: "q", text: "Horizontal vs vertical scaling?" },
          { role: "a", text: "Vertical = upgrade mesin (RAM, CPU). Horizontal = tambah mesin. Horizontal lebih sustainable untuk long-term." },
          { role: "q", text: "Load balancer itu apa sederhananya?" },
          { role: "a", text: "Traffic cop. Dia distribusikan request ke beberapa server supaya gak ada satu server yang kelebihan beban." },
          { role: "q", text: "Algorithm load balancing yang umum?" },
          { role: "a", text: "Round robin (bergilir), least connections (ke server paling senggang), dan weighted (berdasarkan kapasitas server)." },
        ],
      },
      {
        title: "Bab 2: Caching Strategy",
        lines: [
          { role: "q", text: "Cache itu disimpan di mana?" },
          { role: "a", text: "Bisa di browser (client), CDN (edge), application layer (Redis/Memcached), atau database query cache." },
          { role: "q", text: "Cache invalidation kenapa susah?" },
          { role: "a", text: "Karena harus pastikan data cache selalu sinkron dengan source of truth. Stale data bisa bikin bug yang susah di-debug." },
          { role: "q", text: "TTL vs event-based invalidation?" },
          { role: "a", text: "TTL simple tapi bisa stale. Event-based lebih akurat tapi lebih complex. Pilih berdasarkan seberapa penting data freshness." },
          { role: "q", text: "Cache hit ratio yang bagus berapa?" },
          { role: "a", text: "Di atas 90% sudah bagus. Kalau di bawah 70%, review cache key strategy dan TTL configuration." },
        ],
      },
      {
        title: "Bab 3: Database di Scale Besar",
        lines: [
          { role: "q", text: "Read replica itu apa?" },
          { role: "a", text: "Copy database yang khusus handle query baca. Write tetap ke primary. Ini cara paling mudah scale read-heavy app." },
          { role: "q", text: "Sharding kapan dibutuhkan?" },
          { role: "a", text: "Saat satu database sudah gak kuat handle volume data. Data dipecah ke beberapa database berdasarkan shard key." },
          { role: "q", text: "SQL vs NoSQL untuk scale?" },
          { role: "a", text: "NoSQL lebih mudah di-scale horizontal, tapi SQL lebih reliable untuk data yang butuh strong consistency dan complex joins." },
          { role: "q", text: "CAP theorem itu apa?" },
          { role: "a", text: "Distributed system cuma bisa pilih 2 dari 3: Consistency, Availability, Partition tolerance. Pahami trade-off sebelum pilih database." },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "React Performance Mastery",
    author: "NAA Frontend Guild",
    cover: "https://picsum.photos/seed/react-perf-book/400/600",
    genre: "React",
    pages: 44,
    rating: 4.6,
    description: "Optimasi React dari dasar sampai advanced. Kenapa component lambat, kapan pakai memo, dan bagaimana profiling yang benar.",
    chapters: [
      {
        title: "Bab 1: Memahami Re-render",
        lines: [
          { role: "q", text: "Kenapa component React bisa re-render terus?" },
          { role: "a", text: "Setiap kali parent re-render, semua child ikut re-render by default. Ini by design, bukan bug." },
          { role: "q", text: "Re-render itu selalu buruk?" },
          { role: "a", text: "Tidak. React sudah sangat efisien. Yang buruk itu unnecessary re-render pada component yang berat (list panjang, chart, dll)." },
          { role: "q", text: "Cara deteksi component yang lambat?" },
          { role: "a", text: "Pakai React DevTools Profiler. Record interaksi, lalu lihat component mana yang render paling lama." },
          { role: "q", text: "React.memo kapan dipake?" },
          { role: "a", text: "Hanya saat component menerima props yang jarang berubah dan render-nya mahal. Jangan memo semua component — overhead-nya gak worth." },
        ],
      },
      {
        title: "Bab 2: State Management yang Efisien",
        lines: [
          { role: "q", text: "State di level mana yang ideal?" },
          { role: "a", text: "Sedekat mungkin dengan component yang membutuhkan. Jangan angkat state ke atas kalau gak perlu." },
          { role: "q", text: "Context API bikin lambat?" },
          { role: "a", text: "Context sendiri gak lambat. Yang lambat itu semua consumer re-render saat value berubah. Solusi: split context atau pakai selector." },
          { role: "q", text: "useMemo vs useCallback?" },
          { role: "a", text: "useMemo untuk cache computed value. useCallback untuk cache function reference. Keduanya cuma berguna kalau dipakai bareng React.memo." },
          { role: "q", text: "Zustand lebih performant dari Redux?" },
          { role: "a", text: "Untuk kebanyakan app, ya. Zustand punya built-in selector dan gak trigger re-render global seperti context." },
        ],
      },
      {
        title: "Bab 3: Virtualization & Code Splitting",
        lines: [
          { role: "q", text: "Virtualization itu apa?" },
          { role: "a", text: "Hanya render item yang visible di viewport. List 10,000 item cuma render 20-30 yang keliatan. Library: react-window atau tanstack-virtual." },
          { role: "q", text: "Lazy loading component gimana?" },
          { role: "a", text: "Pakai React.lazy() + Suspense. Component berat di-load hanya saat dibutuhkan, bukan saat initial bundle." },
          { role: "q", text: "Dynamic import vs static import?" },
          { role: "a", text: "Static import masuk ke main bundle. Dynamic import(\u0027./module\u0027) bikin chunk terpisah yang di-load on demand." },
          { role: "q", text: "Bundle size target yang sehat?" },
          { role: "a", text: "Initial JS bundle di bawah 200KB gzipped. Pakai next/bundle-analyzer atau source-map-explorer untuk audit." },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Git & GitHub untuk Tim Produktif",
    author: "NAA DevOps Team",
    cover: "https://picsum.photos/seed/git-team-book/400/600",
    genre: "DevOps",
    pages: 38,
    rating: 4.5,
    description: "Workflow Git yang bikin kolaborasi tim smooth. Branching strategy, code review etiquette, dan CI/CD pipeline dari nol.",
    chapters: [
      {
        title: "Bab 1: Branching Strategy",
        lines: [
          { role: "q", text: "Git Flow vs Trunk-based, mana yang lebih baik?" },
          { role: "a", text: "Trunk-based lebih cocok untuk tim yang deploy sering. Git Flow untuk project dengan release cycle panjang." },
          { role: "q", text: "Feature branch sebaiknya berapa lama?" },
          { role: "a", text: "Maksimal 2-3 hari. Semakin lama, semakin susah merge dan semakin besar risiko conflict." },
          { role: "q", text: "Rebase vs merge?" },
          { role: "a", text: "Rebase untuk feature branch supaya history bersih. Merge untuk main branch supaya ada record kapan feature masuk." },
          { role: "q", text: "Commit message yang baik gimana?" },
          { role: "a", text: "Format: 'type(scope): description'. Contoh: 'feat(auth): add Google OAuth login'. Gunakan conventional commits." },
        ],
      },
      {
        title: "Bab 2: Code Review yang Efektif",
        lines: [
          { role: "q", text: "PR sebaiknya seberapa besar?" },
          { role: "a", text: "Di bawah 400 baris changed. Riset menunjukkan review quality turun drastis di atas angka itu." },
          { role: "q", text: "Apa yang harus dicek saat review?" },
          { role: "a", text: "Logic correctness, edge cases, naming clarity, test coverage, dan apakah sesuai dengan arsitektur yang disepakati." },
          { role: "q", text: "Gimana kasih feedback yang konstruktif?" },
          { role: "a", text: "Fokus di kode, bukan orang. Tanyakan 'what if' daripada 'you should'. Berikan contoh alternatif, bukan cuma kritik." },
          { role: "q", text: "Auto review tools yang recommended?" },
          { role: "a", text: "GitHub Copilot PR review, Danger JS untuk automated checks, dan CODEOWNERS untuk auto-assign reviewer." },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "TypeScript Praktis: Dari Nol ke Confident",
    author: "NAA TypeScript Guild",
    cover: "https://picsum.photos/seed/ts-practical-book/400/600",
    genre: "TypeScript",
    pages: 52,
    rating: 4.8,
    description: "Belajar TypeScript tanpa teori berlebihan. Langsung praktek dengan pattern yang sering dipakai di dunia nyata.",
    chapters: [
      {
        title: "Bab 1: Kenapa TypeScript?",
        lines: [
          { role: "q", text: "TypeScript worth it gak sih buat project kecil?" },
          { role: "a", text: "Ya. Autocomplete dan error checking di editor alone sudah bikin development 30% lebih cepat, bahkan di project kecil." },
          { role: "q", text: "Learning curve-nya gimana?" },
          { role: "a", text: "Kalau udah familiar JavaScript, 1-2 minggu sudah bisa produktif. Advanced types bisa dipelajari bertahap sesuai kebutuhan." },
          { role: "q", text: "Strict mode harus selalu on?" },
          { role: "a", text: "Idealnya ya. Strict mode catch lebih banyak bug. Kalau migrating dari JS, bisa nyalakan bertahap per rule." },
          { role: "q", text: "'any' boleh dipake?" },
          { role: "a", text: "Sebagai escape hatch sementara, boleh. Tapi long-term, setiap 'any' adalah potential bug yang gak ketangkep compiler." },
        ],
      },
      {
        title: "Bab 2: Types yang Sering Dipakai",
        lines: [
          { role: "q", text: "Interface vs Type, kapan pakai yang mana?" },
          { role: "a", text: "Interface untuk object shape yang bisa di-extend. Type untuk union, intersection, dan mapped types. Keduanya bisa saling ganti untuk simple cases." },
          { role: "q", text: "Generic itu buat apa?" },
          { role: "a", text: "Bikin function/component yang type-safe tapi flexible. Contoh: function getFirst<T>(arr: T[]): T — works untuk array apapun." },
          { role: "q", text: "Utility types yang must-know?" },
          { role: "a", text: "Partial<T>, Required<T>, Pick<T,K>, Omit<T,K>, Record<K,V>, dan ReturnType<T>. Enam ini cover 90% kebutuhan." },
          { role: "q", text: "Discriminated union itu powerful ya?" },
          { role: "a", text: "Sangat. Bikin type-safe state machine. Contoh: type Result = { status: 'ok'; data: User } | { status: 'error'; message: string }." },
        ],
      },
      {
        title: "Bab 3: TypeScript di React",
        lines: [
          { role: "q", text: "Props typing yang best practice?" },
          { role: "a", text: "Definisikan type terpisah. Gunakan children: React.ReactNode. Hindari inline typing yang bikin JSX berantakan." },
          { role: "q", text: "Event handler type gimana?" },
          { role: "a", text: "React.ChangeEvent<HTMLInputElement> untuk onChange, React.FormEvent<HTMLFormElement> untuk onSubmit. Hover di handler untuk lihat type-nya." },
          { role: "q", text: "useState dengan complex type?" },
          { role: "a", text: "const [user, setUser] = useState<User | null>(null). Explicit generic kalau initial value gak cukup buat inference." },
          { role: "q", text: "Ref typing yang benar?" },
          { role: "a", text: "useRef<HTMLDivElement>(null) untuk DOM refs. useRef<number>(0) untuk mutable values. Pastikan generic type-nya sesuai." },
        ],
      },
    ],
  },
];

export const tags = ["#ai-local", "#nextjs16", "#cache-api", "#ux-chatfeed"];

export function searchFeeds(query: string): Feed[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);

  return feeds
    .filter((feed) => {
      const haystack = [
        feed.title,
        feed.category,
        feed.takeaway,
        ...feed.lines.map((line) => line.text),
      ]
        .join(" ")
        .toLowerCase();

      return tokens.every((token) => haystack.includes(token));
    })
    .sort((a, b) => b.popularity - a.popularity);
}
