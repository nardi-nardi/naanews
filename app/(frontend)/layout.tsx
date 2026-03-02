import { SiteShell } from "@/components/navigation/SiteShell";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
