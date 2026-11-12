import React from "react";
import Link from "next/link";
import {
  Search,
  Home,
  Key,
  ShieldCheck,
  Building,
  Users,
  ArrowRight,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Sparkles,
} from "lucide-react";
import { getProperties, getArticles, getTeam, getSettings } from "@/lib/db";
import PropertyCard from "@/components/PropertyCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, properties, allArticles, allTeam] = await Promise.all([
    getSettings(),
    getProperties(),
    getArticles(),
    getTeam(),
  ]);
  const featuredProperties = properties
    .filter((p) => p.featured || p.status === "DISPONIBLE")
    .slice(0, 6);
  const articles = allArticles.slice(0, 3);
  const team = allTeam.slice(0, 3);

  const activities = [
    {
      icon: Home,
      title: "Vente de Maisons, Villas & Terrains",
      description:
        "Accompagnement complet pour l'achat ou la vente de biens résidentiels et parcelles avec vérification systématique du Titre Foncier et acte notarié.",
      badge: "Transaction sécurisée",
    },
    {
      icon: Key,
      title: "Location Résidentielle & Professionnelle",
      description:
        "Villas avec piscine, duplex sécurisés, appartements modernes et bureaux à Brazzaville et Pointe-Noire pour particuliers, cadres et expatriés.",
      badge: "Court & Long terme",
    },
    {
      icon: Building,
      title: "Gestion Locative & Patrimoine",
      description:
        "Sélection des locataires, rédaction des baux, encaissement des loyers et suivi technique de vos maisons (groupe électrogène, forage, entretien).",
      badge: "Spécial Propriétaires & Diaspora",
    },
    {
      icon: ShieldCheck,
      title: "Conseil, Estimation & Sécurisation Foncière",
      description:
        "Évaluation au juste prix du marché congolais, audit documentaire au cadastre et accompagnement des investisseurs.",
      badge: "Expertise locale",
    },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative bg-brand-950 text-white overflow-hidden">
        {/* Background image with Teal & Fusion overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900/95 to-brand-800/80" />
        {/* Decorative fusion glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-fusion-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-brand-400/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-900/90 border border-fusion-400/40 text-fusion-300 text-xs font-semibold tracking-wide">
              
              <span>
                Immobilier de Référence en République du Congo (Brazzaville &
                Pointe-Noire)
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Trouvez la maison idéale pour{" "}
              <span className="bg-fusion-gradient bg-clip-text text-transparent">
                acheter ou louer
              </span>{" "}
              au Congo.
            </h1>

            <p className="text-lg text-brand-100/90 leading-relaxed max-w-2xl">
              {settings.aboutIntro}
            </p>
          </div>

          {/* Quick Search Bar */}
          <form
            action="/catalogue"
            method="GET"
            className="mt-10 bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-2xl border border-brand-700/30 text-slate-800 max-w-5xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-800 mb-1.5">
                  Type d&apos;opération
                </label>
                <select
                  name="transaction"
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="">Vente & Location</option>
                  <option value="VENTE">Acheter un bien</option>
                  <option value="LOCATION">Louer un bien</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-800 mb-1.5">
                  Ville / Localisation
                </label>
                <select
                  name="city"
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="">Toutes les villes</option>
                  <option value="Brazzaville">Brazzaville</option>
                  <option value="Pointe-Noire">Pointe-Noire</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-800 mb-1.5">
                  Type de bien
                </label>
                <select
                  name="category"
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="">Tous les types</option>
                  <option value="Villa">Villa</option>
                  <option value="Maison">Maison</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Terrain">Terrain</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-sm shadow-lg shadow-fusion-500/25 hover:brightness-110 transition h-[42px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </button>
              </div>
            </div>
          </form>

          {/* Key Stats (8 Executive KPIs) */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl">
            <div className="bg-brand-900/60 border border-brand-800 rounded-xl p-4">
              <p className="text-2xl sm:text-3xl font-extrabold bg-fusion-gradient bg-clip-text text-transparent">
                {settings.stats.propertiesSoldOrRented}
              </p>
              <p className="text-xs text-brand-200 mt-1">
                Biens vendus & loués
              </p>
            </div>
            <div className="bg-brand-900/60 border border-brand-800 rounded-xl p-4">
              <p className="text-2xl sm:text-3xl font-extrabold bg-fusion-gradient bg-clip-text text-transparent">
                {settings.stats.satisfiedClients}
              </p>
              <p className="text-xs text-brand-200 mt-1">Clients satisfaits</p>
            </div>
            <div className="bg-brand-900/60 border border-brand-800 rounded-xl p-4">
              <p className="text-2xl sm:text-3xl font-extrabold bg-fusion-gradient bg-clip-text text-transparent">
                {settings.stats.yearsExperience}
              </p>
              <p className="text-xs text-brand-200 mt-1">
                D&apos;expertise au Congo
              </p>
            </div>
            <div className="bg-brand-900/60 border border-brand-800 rounded-xl p-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                100%
              </p>
              <p className="text-xs text-brand-200 mt-1">
                Titres fonciers vérifiés
              </p>
            </div>
            <div className="bg-brand-900/45 border border-brand-800/80 rounded-xl p-4">
              <p className="text-xl sm:text-2xl font-extrabold text-fusion-300">
                +4,8 Mrd FCFA
              </p>
              <p className="text-xs text-brand-200 mt-1">
                Patrimoine sous gestion
              </p>
            </div>
            <div className="bg-brand-900/45 border border-brand-800/80 rounded-xl p-4">
              <p className="text-xl sm:text-2xl font-extrabold text-fusion-300">
                &lt; 24h
              </p>
              <p className="text-xs text-brand-200 mt-1">
                Organisation de visite
              </p>
            </div>
            <div className="bg-brand-900/45 border border-brand-800/80 rounded-xl p-4">
              <p className="text-xl sm:text-2xl font-extrabold text-fusion-300">
                15+ Quartiers
              </p>
              <p className="text-xs text-brand-200 mt-1">
                Brazzaville, Kintélé, PNR
              </p>
            </div>
            <div className="bg-brand-900/45 border border-brand-800/80 rounded-xl p-4">
              <p className="text-xl sm:text-2xl font-extrabold text-white">
                99,2%
              </p>
              <p className="text-xs text-brand-200 mt-1">
                Recouvrement locatif
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOGUE PREVIEW SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              Notre Catalogue Immobilier
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Nos Maisons & Villas à la Une
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Découvrez notre sélection de biens disponibles à la vente et à la
              location à Brazzaville, Kintélé et Pointe-Noire.
            </p>
          </div>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm transition shrink-0"
          >
            <span>Voir tout le catalogue ({properties.length} biens)</span>
            <ArrowRight className="w-4 h-4 text-fusion-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* ENTREPRISE & ACTIVITÉS SECTION */}
      <section className="py-20 bg-brand-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-fusion-500/20 text-fusion-300 border border-fusion-400/30">
                Notre Entreprise & Nos Activités
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Une expertise complète au service de votre{" "}
                <span className="bg-fusion-gradient bg-clip-text text-transparent">
                  patrimoine immobilier
                </span>
              </h2>
              <p className="text-brand-200 leading-relaxed text-sm sm:text-base">
                {settings.aboutStory}
              </p>

              <ul className="space-y-3 pt-2 text-sm text-brand-100">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-fusion-400 shrink-0" />
                  <span>
                    Vérification systématique des titres fonciers et documents
                    cadastraux
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-fusion-400 shrink-0" />
                  <span>
                    Accompagnement dédié pour la diaspora congolaise et les
                    expatriés
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-fusion-400 shrink-0" />
                  <span>
                    Visites rapides sur rendez-vous à Brazzaville et
                    Pointe-Noire
                  </span>
                </li>
              </ul>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href="/entreprise"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-sm hover:brightness-110 transition"
                >
                  <span>Découvrir nos activités</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm border border-brand-700 transition"
                >
                  <PhoneCall className="w-4 h-4 text-fusion-400" />
                  <span>Parler à un conseiller</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activities.map((act, index) => {
                const Icon = act.icon;
                return (
                  <div
                    key={index}
                    className="bg-brand-900/80 border border-brand-800 hover:border-fusion-400/50 rounded-2xl p-6 space-y-4 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-fusion-gradient p-0.5">
                        <div className="w-full h-full bg-brand-950 rounded-[10px] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-fusion-400" />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-800 text-fusion-300">
                        {act.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-fusion-300 transition">
                      {act.title}
                    </h3>
                    <p className="text-sm text-brand-200 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              Capital Humain
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Rencontrez Notre Équipe
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Des professionnels de l&apos;immobilier à votre écoute pour
              concrétiser votre projet d&apos;achat, de vente ou de location.
            </p>
          </div>
          <Link
            href="/equipe"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-brand-200 bg-white hover:bg-brand-50 text-brand-900 font-semibold text-sm transition"
          >
            <Users className="w-4 h-4 text-brand-700" />
            <span>Voir toute l&apos;équipe</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition flex flex-col"
            >
              <div className="h-64 overflow-hidden relative bg-brand-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-fusion-gradient text-brand-950">
                    {member.experienceYears} ans d&apos;expérience
                  </span>
                  <h3 className="text-lg font-bold mt-1">{member.name}</h3>
                  <p className="text-xs text-brand-200">{member.role}</p>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
                    {member.specialty}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                    {member.bio}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <a
                    href={`tel:${member.phone.replace(/\s+/g, "")}`}
                    className="text-brand-800 hover:text-fusion-600"
                  >
                    {member.phone}
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-slate-500 hover:text-brand-700"
                  >
                    Envoyer un email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACTUALITÉS SECTION */}
      <section className="py-20 bg-brand-50/60 border-t border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
                Blog & Conseils
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                Nos Dernières Actualités Immobilières
              </h2>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Tendances du marché à Brazzaville et Pointe-Noire, conseils
                juridiques et vie de notre agence.
              </p>
            </div>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm transition"
            >
              <span>Toutes les actualités</span>
              <ArrowRight className="w-4 h-4 text-fusion-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition flex flex-col"
              >
                <div className="h-52 overflow-hidden relative bg-brand-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-fusion-gradient text-brand-950 shadow">
                    {article.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-600" />
                        {article.publishedAt}
                      </span>
                      <span>•</span>
                      <span>Lecture {article.readTime}</span>
                    </div>
                    <Link href={`/actualites/${article.slug}`}>
                      <h3 className="text-lg font-bold text-slate-900 hover:text-brand-700 transition line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/actualites/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-fusion-600 transition pt-2"
                  >
                    <span>Lire l&apos;article complet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

