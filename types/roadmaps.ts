// FILE: app/(frontend)/data/roadmaps.ts
// (Ini tempat menyimpan Tipe & Data Dummy)

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
  _id?: string;
  slug: string;
  title: string;
  summary: string;
  duration: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  tags: string[];
  image: string;
  steps: RoadmapStep[];
  createdAt?: number;
  updatedAt?: number;
};

export const roadmaps: Roadmap[] = [
  {
    slug: "frontend-foundations",
    title: "Frontend Foundations (Offline Mode)",
    summary: "Mode offline: Data roadmap tidak dapat dimuat dari database.",
    duration: "-",
    level: "Pemula",
    tags: ["Offline"],
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    steps: [],
  },
];

export function getRoadmapBySlug(slug: string) {
  return roadmaps.find((item) => item.slug === slug);
}
