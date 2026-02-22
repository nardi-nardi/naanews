import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Narzza Media Digital",
  description:
    "Portal berita, tutorial, dan hasil eksperimen dengan format chat",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="bg-canvas">
      <body className={`${inter.className} antialiased bg-canvas min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
