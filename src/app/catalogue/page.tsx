import React from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Home,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { getProperties } from "@/lib/db";
import PropertyCard from "@/components/PropertyCard";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 9; // 3 lignes x 3 colonnes

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: {
    transaction?: string;
    city?: string;
    category?: string;
    minBedrooms?: string;
    maxPrice?: string;
    q?: string;
    page?: string;
  };
}) {
  const allProperties = await getProperties();

  const transaction = searchParams.transaction || "";
  const city = searchParams.city || "";
  const category = searchParams.category || "";
  const minBedrooms = searchParams.minBedrooms
    ? Number(searchParams.minBedrooms)
    : 0;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : 0;
  const q = (searchParams.q || "").toLowerCase().trim();
  const currentPage = Math.max(1, Number(searchParams.page) || 1);

  const filtered = allProperties.filter((p) => {
    if (transaction && p.transactionType !== transaction) return false;
    if (city && p.city.toLowerCase() !== city.toLowerCase()) return false;
    if (category && p.category !== category) return false;
    if (minBedrooms > 0 && p.bedrooms < minBedrooms) return false;
    if (maxPrice > 0 && p.price > maxPrice) return false;
    if (
      q &&
      !p.title.toLowerCase().includes(q) &&
      !p.district.toLowerCase().includes(q) &&
      !p.city.toLowerCase().includes(q) &&
      !p.reference.toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  function buildPageHref(pageNumber: number) {
    const params = new URLSearchParams();
    if (transaction) params.set("transaction", transaction);
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    if (minBedrooms) params.set("minBedrooms", String(minBedrooms));
    if (maxPrice) params.set("maxPrice", String(maxPrice));
    if (searchParams.q) params.set("q", searchParams.q);
    params.set("page", String(pageNumber));
    return `/catalogue?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <section className="bg-brand-950 text-white py-14 border-b border-brand-800 relative overflow-hidden">
        <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-fusion-500/15 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-fusion-500/20 text-fusion-300 border border-fusion-400/30">
            Vente & Location au Congo-Brazzaville
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3">
            Notre Catalogue de Maisons, Villas & Appartements
          </h1>
          <p className="text-brand-200 mt-2 max-w-2xl text-sm sm:text-base">
            Parcourez nos biens vérifiés à Brazzaville, Kintélé et Pointe-Noire.
            Affichage structuré en grille 3×3 (9 biens par page).
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter Bar */}
        <form
          action="/catalogue"
          method="GET"
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-brand-900">
              <SlidersHorizontal className="w-4 h-4 text-fusion-500" />
              <span>Filtrer les biens immobiliers</span>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser les filtres</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Mot-clé, quartier ou réf.
              </label>
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q || ""}
                placeholder="Ex: Mpila, Piscine, Côte Sauvage..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Opération
              </label>
              <select
                name="transaction"
                defaultValue={transaction}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="">Tout (Vente & Location)</option>
                <option value="VENTE">Vente</option>
                <option value="LOCATION">Location</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Ville
              </label>
              <select
                name="city"
                defaultValue={city}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="">Toutes les villes</option>
                <option value="Brazzaville">Brazzaville</option>
                <option value="Pointe-Noire">Pointe-Noire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Catégorie
              </label>
              <select
                name="category"
                defaultValue={category}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="">Toutes catégories</option>
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
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-sm shadow hover:brightness-110 transition h-[42px]"
              >
                <Search className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </form>

        {/* Results Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-100 text-brand-800 text-xs font-bold">
              <LayoutGrid className="w-3.5 h-3.5 text-brand-700" />
              Grille 3 × 3
            </span>
            <p className="text-sm text-slate-600">
              Affichage de{" "}
              <span className="font-bold text-slate-900">
                {filtered.length === 0 ? 0 : startIndex + 1}–
                {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}
              </span>{" "}
              sur{" "}
              <span className="font-bold text-slate-900">
                {filtered.length}
              </span>{" "}
              {filtered.length > 1 ? "biens disponibles" : "bien disponible"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/catalogue"
              className={`px-3 py-1.5 rounded-lg font-semibold ${
                !transaction
                  ? "bg-brand-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Tous
            </Link>
            <Link
              href="/catalogue?transaction=VENTE"
              className={`px-3 py-1.5 rounded-lg font-semibold ${
                transaction === "VENTE"
                  ? "bg-fusion-gradient text-brand-950"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              En Vente
            </Link>
            <Link
              href="/catalogue?transaction=LOCATION"
              className={`px-3 py-1.5 rounded-lg font-semibold ${
                transaction === "LOCATION"
                  ? "bg-brand-700 text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              En Location
            </Link>
          </div>
        </div>

        {/* 3x3 Grid (3 rows x 3 columns = 9 items per page) */}
        {paginatedProperties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
              <Home className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Aucun bien ne correspond à ces critères
            </h3>
            <p className="text-slate-600 max-w-md mx-auto text-sm">
              Essayez d&apos;élargir votre recherche ou contactez notre équipe :
              nous disposons également de biens en mandat off-market à
              Brazzaville et Pointe-Noire.
            </p>
            <div className="pt-2">
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-900 text-white text-sm font-semibold"
              >
                Voir tous les biens
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {paginatedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {safePage > 1 ? (
                  <Link
                    href={buildPageHref(safePage - 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-brand-50 text-xs font-bold shadow-sm transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </span>
                )}

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                  (pageNum) => (
                    <Link
                      key={pageNum}
                      href={buildPageHref(pageNum)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition shadow-sm ${
                        pageNum === safePage
                          ? "bg-fusion-gradient text-brand-950 ring-2 ring-fusion-400/50"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-brand-50"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  )
                )}

                {safePage < totalPages ? (
                  <Link
                    href={buildPageHref(safePage + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-brand-50 text-xs font-bold shadow-sm transition"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed">
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
