export type RoadmapVideo = {
  id: string;
  author: string;
};

export type RoadmapStep = {
  title: string;
  description: string;
  focus: string;
  videos: RoadmapVideo[];
};

export type Roadmap = {
  slug: string;
  title: string;
  summary: string;
  duration: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  tags: string[];
  image: string;
  steps: RoadmapStep[];
};

export function getStaticSlugs() {
  return roadmaps.map((item) => ({ slug: item.slug }));
}

export const roadmaps: Roadmap[] = [
  {
    slug: "frontend-foundations",
    title: "Frontend Foundations",
    summary: "Urutan dasar untuk masuk dunia web: struktur HTML, styling responsif, hingga JavaScript inti.",
    duration: "3-5 minggu",
    level: "Pemula",
    tags: ["HTML", "CSS", "JavaScript"],
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    steps: [
      {
        title: "HTML & Semantic Structure",
        description: "Latih penulisan heading, list, dan elemen semantik supaya konten mudah dipahami pembaca dan mesin pencari.",
        focus: "Struktur & aksesibilitas",
        videos: [
          { id: "pQN-pnXPaVg", author: "Traversy Media" },
          { id: "mU6anWqZJcc", author: "freeCodeCamp.org" },
        ],
      },
      {
        title: "CSS, Layout, dan Responsive Design",
        description: "Kuasi Flexbox, Grid, serta breakpoint agar layout adaptif di mobile sampai desktop.",
        focus: "Layout modern",
        videos: [
          { id: "yfoY53QXEnI", author: "Traversy Media" },
          { id: "1Rs2ND1ryYc", author: "Web Dev Simplified" },
        ],
      },
      {
        title: "JavaScript Fundamentals",
        description: "Pahami tipe data, kontrol alur, DOM, dan async (fetch, async/await) sebagai pondasi aplikasi.",
        focus: "Logika inti",
        videos: [
          { id: "hdI2bqOjy3c", author: "Traversy Media" },
          { id: "PkZNo7MFNFg", author: "freeCodeCamp.org" },
        ],
      },
      {
        title: "Version Control dengan Git",
        description: "Belajar branching, commit yang rapi, dan pull request supaya kolaborasi lebih aman.",
        focus: "Kolaborasi dev",
        videos: [
          { id: "2sjqTHE0zok", author: "The Net Ninja" },
        ],
      },
      {
        title: "Build Tools & NPM Basics",
        description: "Mengerti npm scripts, package.json, serta bundling dasar untuk workflow modern.",
        focus: "Tooling awal",
        videos: [
          { id: "v4cd1O4zkGw", author: "Fireship" },
        ],
      },
    ],
  },
  {
    slug: "react-specialist",
    title: "React Specialist",
    summary: "Fokus ke arsitektur komponen, state management, performa, dan testing UI di React.",
    duration: "4-6 minggu",
    level: "Menengah",
    tags: ["React", "Hooks", "State"],
    image: "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=1200&q=80",
    steps: [
      {
        title: "Component Patterns & Hooks",
        description: "Dalami props, composition, custom hooks, dan pengelolaan state lokal yang bersih.",
        focus: "Komposisi komponen",
        videos: [
          { id: "w7ejDZ8SWv8", author: "Traversy Media" },
          { id: "Ke90Tje7VS0", author: "Programming with Mosh" },
        ],
      },
      {
        title: "Routing & Data Fetching",
        description: "Gunakan React Router atau Next.js client untuk data, loading states, dan error boundaries.",
        focus: "Alur halaman",
        videos: [
          { id: "Law7wfdg_ls", author: "Web Dev Simplified" },
        ],
      },
      {
        title: "State Management",
        description: "Bandingkan Context, Zustand, Redux Toolkit, atau Jotai; pilih sesuai skala aplikasi.",
        focus: "State global",
        videos: [
          { id: "35lXWvCuM8o", author: "Fireship" },
          { id: "tD_QfK4bJbE", author: "Jack Herrington" },
        ],
      },
      {
        title: "Performance & Profiling",
        description: "Optimalkan render dengan memoization, lazy loading, dan profiling untuk deteksi bottleneck.",
        focus: "Performa UI",
        videos: [
          { id: "XxVg_s8xAms", author: "React" },
        ],
      },
      {
        title: "Testing UI",
        description: "Pakai React Testing Library dan Vitest/Jest untuk unit dan integration test komponen.",
        focus: "Kualitas kode",
        videos: [
          { id: "JKOwJUM4_RM", author: "Kent C. Dodds" },
        ],
      },
    ],
  },
  {
    slug: "fullstack-nextjs",
    title: "Fullstack Next.js",
    summary: "Kuasi App Router, data fetching, autentikasi, dan deployment agar siap produksi.",
    duration: "4-6 minggu",
    level: "Menengah",
    tags: ["Next.js", "API", "Deploy"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    steps: [
      {
        title: "App Router Fundamentals",
        description: "Pelajari server components, routing dinamis, metadata, dan layouting di App Router.",
        focus: "Dasar App Router",
        videos: [
          { id: "1WmNXEVia8I", author: "Lee Robinson" },
          { id: "KjY94sAKLlw", author: "Net Ninja" },
        ],
      },
      {
        title: "Data Fetching & Caching",
        description: "Gunakan fetch cache, revalidate, dan server actions untuk data yang konsisten dan cepat.",
        focus: "Data layer",
        videos: [
          { id: "vCOSTG10Y4o", author: "Vercel" },
        ],
      },
      {
        title: "Auth & Middleware",
        description: "Integrasi Auth.js atau custom JWT, role-based access, dan middleware untuk proteksi route.",
        focus: "Keamanan & akses",
        videos: [
          { id: "BaT_PytW7cI", author: "Codevolution" },
        ],
      },
      {
        title: "File Upload & Media",
        description: "Atur upload via presigned URL, optimasi gambar dengan next/image, dan handle CDN caching.",
        focus: "Media pipeline",
        videos: [
          { id: "k5LUfXQ5I9M", author: "Josh tried coding" },
        ],
      },
      {
        title: "Observability & Deploy",
        description: "Pasang logging, metrics, error tracking, dan deploy ke Vercel/Node dengan praktik CI/CD.",
        focus: "Siap produksi",
        videos: [
          { id: "JodP_8Zx5zQ", author: "Vercel" },
        ],
      },
    ],
  },
];

export function getRoadmapBySlug(slug: string) {
  return roadmaps.find((item) => item.slug === slug);
}
