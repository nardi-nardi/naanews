import { SiteShell } from "@/components/navigation/SiteShell";
import {
  HeroTentang,
  AchievementTentang,
  VisiMisi,
  CoreValues,
  FounderAndTeam,
  CompanyInfo,
  ContactSection,
  TechnologyStack,
  Partners,
  CTAFooter,
} from "@/components/tentang";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Narzza Media Digital - Perusahaan Media Digital Inovatif",
  description:
    "Narzza Media Digital adalah perusahaan media digital yang menghadirkan konten teknologi dalam format interaktif dan mudah dicerna.",
};

export default function TentangPage() {
  return (
    <SiteShell activePath="/tentang">
      <div className="space-y-6">
        {/* Hero Section */}
        <HeroTentang />

        {/* Achievements Section */}
        <AchievementTentang />

        {/* Visi, Misi & Highlights */}
        <VisiMisi />

        {/* Core Values */}
        <CoreValues />

        {/* Founders & Team Section */}
        <FounderAndTeam />

        {/* Company Info */}
        <CompanyInfo />

        {/* Contact Section */}
        <ContactSection />

        {/* Technology Stack */}
        <TechnologyStack />

        {/* Partners */}
        <Partners />

        {/* CTA Footer */}
        <CTAFooter />
      </div>
    </SiteShell>
  );
}
