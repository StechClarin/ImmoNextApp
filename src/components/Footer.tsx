import React from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { AgencySettings } from "@/types/immo";

export default function Footer({ settings }: { settings: AgencySettings }) {
  return (
    <footer className="bg-brand-950 text-brand-100 border-t border-brand-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 border border-brand-700/80 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-fusion-500/20 text-fusion-300 border border-fusion-400/30">
              Propriétaires & Investisseurs au Congo
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Vous souhaitez vendre ou mettre en location votre maison ?
            </h3>
            <p className="text-brand-200 max-w-2xl text-sm md:text-base">
              Confiez votre bien à notre équipe à Brazzaville et Pointe-Noire :
              estimation réaliste, reportage photo, sélection des acquéreurs ou
              locataires et sécurisation juridique.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact?sujet=estimation"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-sm shadow-lg shadow-fusion-500/20 hover:brightness-110 transition"
            >
              <span>Confier un bien</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-brand-950 hover:bg-brand-900 text-white font-semibold text-sm border border-brand-700 transition"
            >
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-14">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logoUrl}
                  alt={settings.name}
                  className="h-10 w-auto object-contain rounded-lg"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-fusion-gradient p-0.5">
                  <div className="w-full h-full bg-brand-950 rounded-[10px] flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-fusion-400" />
                  </div>
                </div>
              )}
              <span className="text-xl font-bold text-white">
                {settings.name}
              </span>
            </div>
            <p className="text-sm text-brand-300 leading-relaxed">
              {settings.slogan}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-fusion-300">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Transactions sécurisées & vérification foncière</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-fusion-400 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-200">
              <li>
                <Link href="/" className="hover:text-fusion-300 transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?transaction=VENTE"
                  className="hover:text-fusion-300 transition"
                >
                  Maisons & Villas à Vendre
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?transaction=LOCATION"
                  className="hover:text-fusion-300 transition"
                >
                  Maisons & Appartements à Louer
                </Link>
              </li>
              <li>
                <Link
                  href="/entreprise"
                  className="hover:text-fusion-300 transition"
                >
                  Notre Entreprise & Nos Activités
                </Link>
              </li>
              <li>
                <Link
                  href="/equipe"
                  className="hover:text-fusion-300 transition"
                >
                  Notre Équipe
                </Link>
              </li>
              <li>
                <Link
                  href="/actualites"
                  className="hover:text-fusion-300 transition"
                >
                  Actualités & Conseils Immo
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Zones Couvertes */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-fusion-400 mb-4">
              Secteurs au Congo
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-200">
              <li>
                <Link
                  href="/catalogue?city=Brazzaville"
                  className="hover:text-fusion-300 transition"
                >
                  Brazzaville — Centre-Ville & Corniche
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?city=Brazzaville"
                  className="hover:text-fusion-300 transition"
                >
                  Brazzaville — Mpila & Plateau des 15 ans
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?city=Brazzaville"
                  className="hover:text-fusion-300 transition"
                >
                  Brazzaville — Bacongo & Moungali
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?city=Brazzaville"
                  className="hover:text-fusion-300 transition"
                >
                  Kintélé — Nouveau Pôle Résidentiel
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?city=Pointe-Noire"
                  className="hover:text-fusion-300 transition"
                >
                  Pointe-Noire — Côte Sauvage & Centre
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-fusion-400 mb-4">
              Nos Coordonnées
            </h4>
            <ul className="space-y-3 text-sm text-brand-200">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-fusion-400 shrink-0 mt-1" />
                <span>
                  {settings.address}, {settings.city}, {settings.country}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-fusion-400 shrink-0" />
                <div>
                  <a
                    href={`tel:${settings.phonePrimary.replace(/\s+/g, "")}`}
                    className="hover:text-fusion-300 block"
                  >
                    {settings.phonePrimary}
                  </a>
                  {settings.phoneSecondary && (
                    <a
                      href={`tel:${settings.phoneSecondary.replace(/\s+/g, "")}`}
                      className="hover:text-fusion-300 block text-xs text-brand-300"
                    >
                      {settings.phoneSecondary}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-fusion-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-fusion-300"
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-fusion-400 shrink-0 mt-1" />
                <span className="text-xs text-brand-300">
                  {settings.openingHours}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Developer Signature */}
      <div className="border-t border-brand-900 py-5 px-4 text-xs text-brand-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © 2026           <a
            href="https://ethernanos.space"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-900/90 hover:bg-brand-800 border border-brand-700/80 hover:border-fusion-400/60 text-brand-200 hover:text-white transition group shadow-sm"
          >              <img
                src="/logo_eth.svg"
                alt="ethernanos logo"
                className="w-4 h-4 object-contain"
              />Ethernanos</a>.
            Tous droits réservés.
          </p>

          {/* Developer Signature */}
          <a
            href="https://ethernanos.space"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-900/90 hover:bg-brand-800 border border-brand-700/80 hover:border-fusion-400/60 text-brand-200 hover:text-white transition group shadow-sm"
          >
            <span className="w-6 h-6 rounded-full bg-white/95 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo_eth.svg"
                alt="ethernanos logo"
                className="w-4 h-4 object-contain"
              />
            </span>
            <span className="text-xs tracking-wide">
              developed by{" "}
              <strong className="font-bold bg-fusion-gradient bg-clip-text text-transparent">
                
              </strong>
            </span>
          </a>

          <div className="flex items-center gap-4">
            {/* <Link href="/admin" className="hover:text-fusion-300">
              Accès Back-Office
            </Link> */}
            <span>•</span>
            <Link href="/contact" className="hover:text-fusion-300">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
