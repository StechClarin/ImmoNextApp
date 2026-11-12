import React from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import { getSettings } from "@/lib/db";
import ContactFormClient from "@/components/ContactFormClient";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { sujet?: string };
}) {
  const settings = await getSettings();
  const defaultType =
    searchParams.sujet === "estimation" ? "ESTIMATION" : "CONTACT";

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-brand-950 text-white py-16 border-b border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-fusion-500/20 text-fusion-300 border border-fusion-400/30">
            Contact & Rendez-vous
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-3">
            Parlons de votre projet immobilier
          </h1>
          <p className="text-brand-200 mt-3 max-w-2xl text-base">
            Que vous cherchiez à acheter, louer ou confier la gestion de votre
            maison en République du Congo, notre équipe est à votre écoute.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-950 text-white rounded-2xl p-6 sm:p-8 border border-brand-800 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Nos Coordonnées Directes
                </h2>
                <p className="text-xs text-brand-300 mt-1">
                  Siège social à {settings.city}, {settings.country}
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-900 border border-brand-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-fusion-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Adresse de l&apos;agence</p>
                    <p className="text-brand-200 mt-0.5">{settings.address}</p>
                    <p className="text-brand-300 text-xs">
                      {settings.city}, {settings.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-900 border border-brand-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-fusion-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Téléphones</p>
                    <a
                      href={`tel:${settings.phonePrimary.replace(/\s+/g, "")}`}
                      className="text-fusion-300 font-semibold block mt-0.5"
                    >
                      {settings.phonePrimary}
                    </a>
                    {settings.phoneSecondary && (
                      <a
                        href={`tel:${settings.phoneSecondary.replace(/\s+/g, "")}`}
                        className="text-brand-200 block text-xs mt-0.5"
                      >
                        {settings.phoneSecondary}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-900 border border-brand-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-fusion-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Email</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-brand-200 hover:text-fusion-300 block mt-0.5"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-900 border border-brand-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-fusion-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Horaires d&apos;ouverture</p>
                    <p className="text-brand-200 text-xs mt-0.5">
                      {settings.openingHours}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-800">
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Écrire sur WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Embedded Map of Brazzaville Centre-Ville */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="h-60 rounded-xl overflow-hidden">
                <iframe
                  title="Carte Brazzaville"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=15.255%2C-4.285%2C15.295%2C-4.255&layer=mapnik&marker=-4.270%2C15.275"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <ContactFormClient defaultType={defaultType} />
          </div>
        </div>
      </div>
    </div>
  );
}

