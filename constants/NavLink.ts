type NavLink = {
  title: string;
  note: string;
  href:
    | "/"
    | "/berita"
    | "/tutorial"
    | "/riset"
    | "/buku"
    | "/roadmap"
    | "/toko"
    | "/tentang";
};

export const navLink: NavLink[] = [
  { title: "Home Feed", note: "Semua update terbaru", href: "/" },
  { title: "Berita", note: "Tren dan breaking tech", href: "/berita" },
  { title: "Tutorial", note: "Step-by-step praktis", href: "/tutorial" },
  { title: "Roadmap", note: "Urutan belajar terpandu", href: "/roadmap" },
  { title: "Riset", note: "Hasil eksperimen tim", href: "/riset" },
  { title: "Buku", note: "Belajar lewat Q&A", href: "/buku" },
  { title: "Toko", note: "Belanja merchandise", href: "/toko" },
  { title: "Tentang", note: "Misi, tim, kontak", href: "/tentang" },
];
