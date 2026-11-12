import React from "react";
import Link from "next/link";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Property } from "@/types/immo";
import { formatPriceFCFA } from "@/lib/format";

export default function PropertyCard({ property }: { property: Property }) {
  const isSale = property.transactionType === "VENTE";

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 flex flex-col">
      {/* Image Cover */}
      <div className="relative h-64 overflow-hidden bg-brand-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow ${
                isSale
                  ? "bg-fusion-gradient text-brand-950"
                  : "bg-brand-700 text-white border border-brand-500/50"
              }`}
            >
              {isSale ? "À Vendre" : "À Louer"}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-950/80 text-brand-100 backdrop-blur-sm">
              {property.category}
            </span>
          </div>

          {property.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-400/95 text-brand-950 shadow">
               Coup de cœur
            </span>
          )}
        </div>

        {/* Status overlay if sold/rented */}
        {property.status !== "DISPONIBLE" && (
          <div className="absolute top-14 left-3.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-600 text-white shadow">
              {property.status === "VENDU"
                ? "Vendu"
                : property.status === "LOUE"
                ? "Loué"
                : "Sous offre"}
            </span>
          </div>
        )}

        {/* Bottom Price on image */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between text-white">
          <div>
            <p className="text-xs text-brand-200 font-medium">
              Réf: {property.reference}
            </p>
            <p className="text-xl font-extrabold tracking-tight text-white drop-shadow">
              {formatPriceFCFA(property.price)}
              {property.pricePeriod && (
                <span className="text-sm font-normal text-fusion-300 ml-1">
                  {property.pricePeriod}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700">
            <MapPin className="w-3.5 h-3.5 text-fusion-600 shrink-0" />
            <span className="truncate">
              {property.district} — {property.city}
            </span>
          </div>

          <Link href={`/catalogue/${property.slug}`} className="block">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition line-clamp-2">
              {property.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 line-clamp-2">
            {property.description}
          </p>
        </div>

        {/* Key Specs & Link */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-brand-50/70 px-2.5 py-1.5 rounded-lg">
              <Maximize2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="font-semibold text-slate-800">
                {property.surface} m²
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-50/70 px-2.5 py-1.5 rounded-lg">
              <BedDouble className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="font-semibold text-slate-800">
                {property.bedrooms} ch.
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-50/70 px-2.5 py-1.5 rounded-lg">
              <Bath className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="font-semibold text-slate-800">
                {property.bathrooms} sdb.
              </span>
            </div>
          </div>

          <Link
            href={`/catalogue/${property.slug}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm transition group-hover:bg-fusion-gradient group-hover:text-brand-950"
          >
            <span>Voir la fiche détaillée</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

