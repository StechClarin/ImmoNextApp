import React from "react";
import Link from "next/link";
import {
  Home,
  Key,
  Building,
  ShieldCheck,
  CheckCircle2,
  Award,
  Globe2,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EntreprisePage() {
  const settings = await getSettings();

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Sécurité Juridique Absolue",
      desc: "Chaque maison ou terrain de notre catalogue fait l'objet d'une vérification documentaire approfondie (Titre Foncier, Cadastre) et d'une transaction devant notaire.",
    },
    {
      icon: Handshake,
      title: "Transparence & Confiance",
      desc: "Des prix clairs en FCFA, des mandats transparents et des comptes-rendus réguliers pour nos propriétaires bailleurs comme pour nos acquéreurs.",
    },
    {
      icon: Globe2,
      title: "Pont avec la Diaspora & les Expatriés",
      desc: "Nous permettons aux Congolais de l'étranger et aux entreprises internationales d'investir, de louer ou de faire gérer leurs biens à Brazzaville et Pointe-Noire en toute sérénité.",
    },
    {
      icon: Award,
      title: "Exigence Technique",
      desc: "Nous veillons aux standards indispensables au confort moderne au Congo : autonomie en eau (forage/bâche), secours électrique (groupe/solaire), sécurité et accessibilité.",
    },
  ];

  const detailedServices = [
    {
      icon: Home,
      badge: "Transaction Vente",
      title: "Vente & Acquisition de Maisons, Villas et Terrains",
      points: [
        "Estimation réaliste basée sur les transactions récentes par quartier (Centre-Ville, Mpila, Plateau des 15 ans, Bacongo, Kintélé, Côte Sauvage).",
        "Mise en valeur professionnelle du bien (photos HD, visites qualifiées).",
        "Vérification de la chaîne de propriété auprès des services fonciers.",
        "Accompagnement complet jusqu'à la signature de l'acte authentique chez le notaire.",
      ],
    },
    {
      icon: Key,
      badge: "Mise en Location",
      title: "Location Résidentielle & Professionnelle",
      points: [
        "Recherche rapide de locataires solvables (particuliers, cadres d'entreprises, diplomates, ONG).",
        "Rédaction de contrats de bail conformes à la réglementation en République du Congo.",
        "États des lieux d'entrée et de sortie contradictoires et détaillés.",
        "Solutions de location longue durée ou meublée haut standing.",
      ],
    },
    {
      icon: Building,
      badge: "Gestion de Patrimoine",
      title: "Gestion Locative Clé en Main",
      points: [
        "Appel et recouvrement mensuel des loyers avec délivrance de quittances.",
        "Reversement ponctuel aux propriétaires (au Congo ou par virement international pour la diaspora).",
        "Gestion des travaux d'entretien et des urgences techniques (climatisation, plomberie, groupe électrogène).",
        "Représentation du propriétaire auprès des administrations et syndics.",
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-brand-950 text-white py-16 lg:py-24 border-b border-brand-800 relative overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-fusion-500/15 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl space-y-5">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-fusion-500/20 text-fusion-300 border border-fusion-400/30">
              À Propos de {settings.name}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Réinventer l&apos;expérience immobilière en{" "}
              <span className="bg-fusion-gradient bg-clip-text text-transparent">
                République du Congo
              </span>
            </h1>
            <p className="text-lg text-brand-100 leading-relaxed">
              {settings.aboutIntro}
            </p>
          </div>
        </div>
      </section>

      {/* Story & Stats */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              Notre Histoire & Vision
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Un partenaire ancré à Brazzaville et Pointe-Noire
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {settings.aboutStory}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-brand-800">
                  {settings.stats.propertiesSoldOrRented}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Transactions réalisées
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-fusion-600">
                  {settings.stats.satisfiedClients}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Clients satisfaits
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-brand-800">
                  100%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Titres fonciers vérifiés
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-2xl font-extrabold text-slate-900">
                  +4,8 Mrd
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  FCFA sous gestion
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-2xl font-extrabold text-fusion-600">
                  21 jours
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Délai moyen location
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-2xl font-extrabold text-brand-800">
                  99,2%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Recouvrement loyers
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                alt="Villa Moderne Congo"
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-brand-950/90 backdrop-blur-md text-white p-5 rounded-2xl border border-brand-700">
                <p className="text-sm font-bold text-fusion-300">
                  Présence locale & standards internationaux
                </p>
                <p className="text-xs text-brand-100 mt-1">
                  Nos équipes vous accueillent du lundi au samedi pour étudier
                  votre projet d&apos;acquisition, de location ou de mise en
                  gestion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              Nos Engagements
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              Pourquoi choisir notre agence ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-900 text-fusion-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Activities */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
            Nos Domaines d&apos;Intervention
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Nos Activités Immobilières en Détail
          </h2>
          <p className="text-slate-600 mt-2">
            De l&apos;estimation initiale à la gestion quotidienne, nous
            couvrons l&apos;ensemble de la chaîne de valeur immobilière.
          </p>
        </div>

        <div className="space-y-8">
          {detailedServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-8 items-start"
              >
                <div className="lg:w-1/3 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fusion-100 text-fusion-800 text-xs font-bold">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{srv.badge}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {srv.title}
                  </h3>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-fusion-600 pt-2"
                  >
                    <span>Demander un accompagnement</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {srv.points.map((pt, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-3 p-4 rounded-xl bg-brand-50/50 border border-brand-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-relaxed">
                        {pt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

