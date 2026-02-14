import type { Metadata } from "next";
import { LightboxProvider } from "@/app/(frontend)/components/chat-image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Narzza Media Digital",
  description: "Portal berita, tutorial, dan hasil eksperimen dengan format chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <LightboxProvider>{children}</LightboxProvider>
      </body>
    </html>
  );
}
