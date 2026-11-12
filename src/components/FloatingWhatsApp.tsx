"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp({
  whatsapp,
  agencyName,
}: {
  whatsapp: string;
  agencyName: string;
}) {
  const pathname = usePathname();

  // Ne jamais afficher le bouton flottant WhatsApp sur la page d'administration
  if (!whatsapp || pathname?.startsWith("/admin")) {
    return null;
  }

  const text = encodeURIComponent(
    `Bonjour ${agencyName}, je visite votre site web et je souhaiterais avoir des renseignements immobiliers.`
  );

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 bg-brand-950 hover:bg-brand-900 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl border-2 border-fusion-400/80 transition-all duration-300 hover:scale-105"
    >
      <span className="w-8 h-8 rounded-full bg-fusion-gradient text-brand-950 flex items-center justify-center shadow">
        <MessageCircle className="w-4 h-4 fill-current" />
      </span>
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-wider text-fusion-300 font-bold leading-none">
          Assistance Directe
        </p>
        <p className="text-xs font-extrabold text-white leading-tight mt-0.5">
          WhatsApp (+242)
        </p>
      </div>
    </a>
  );
}
