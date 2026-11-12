import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings.name} | Vente & Location Immobilière au Congo-Brazzaville`,
    description: settings.slogan,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Navbar settings={settings} />
        <main className="flex-1">{children}</main>
        <FloatingWhatsApp
          whatsapp={settings.whatsapp}
          agencyName={settings.name}
        />
        <Footer settings={settings} />
      </body>
    </html>
  );
}

