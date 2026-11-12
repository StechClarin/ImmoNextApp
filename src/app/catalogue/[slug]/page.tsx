import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Home,
  CheckCircle2,
  ArrowLeft,
  LandPlot,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  getPropertyBySlug,
  getProperties,
  getTeam,
  getSettings,
} from "@/lib/db";
import { formatPriceFCFA } from "@/lib/format";
import PropertyGallery from "@/components/PropertyGallery";
import VisitRequestForm from "@/components/VisitRequestForm";
import PropertyCard from "@/components/PropertyCard";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    notFound();
  }

  const [settings, team, allProperties] = await Promise.all([
    getSettings(),
    getTeam(),
    getProperties(),
  ]);
  const agent =
    team.find((m) => m.id === property.agentId) || team[0];
  const similarProperties = allProperties
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.transactionType === property.transactionType ||
          p.city === property.city)
    )
    .slice(0, 3);

  const isSale = property.transactionType === "VENTE";

  // OpenStreetMap bounding box around property coordinates
  const lat = property.coordinates?.lat || -4.2634;
  const lng = property.coordinates?.lng || 15.2832;
  const delta = 0.015;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - delta
  }%2C${lat - delta}%2C${lng + delta}%2C${
    lat + delta
  }&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Top Breadcrumb & Summary Header */}
      <div className="bg-brand-950 text-white py-10 border-b border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-200 hover:text-fusion-300 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au catalogue des biens</span>
            </Link>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  isSale
                    ? "bg-fusion-gradient text-brand-950"
                    : "bg-brand-700 text-white"
                }`}
              >
                {isSale ? "À Vendre" : "À Louer"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-900 border border-brand-700 text-brand-200">
                Réf : {property.reference}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-fusion-300 font-medium">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>
                  {property.address} — {property.district}, {property.city}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                {property.title}
              </h1>
            </div>

            <div className="bg-brand-900/90 border border-brand-700/80 rounded-2xl px-6 py-4 shrink-0">
              <p className="text-xs uppercase tracking-wider text-brand-300">
                {isSale ? "Prix de vente" : "Loyer mensuel"}
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold bg-fusion-gradient bg-clip-text text-transparent">
                {formatPriceFCFA(property.price)}
                {property.pricePeriod && (
                  <span className="text-sm font-normal text-brand-200 ml-1">
                    {property.pricePeriod}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 8 Columns: Gallery, Specs, Description, Features, Map */}
          <div className="lg:col-span-8 space-y-8">
            {/* Interactive Photo Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Key Characteristics Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-800 mb-4">
                Caractéristiques principales
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-100">
                  <div className="flex items-center gap-2 text-brand-700 text-xs font-semibold">
                    <Home className="w-4 h-4" />
                    <span>Type</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {property.category}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-100">
                  <div className="flex items-center gap-2 text-brand-700 text-xs font-semibold">
                    <Maximize2 className="w-4 h-4" />
                    <span>Surface bâtie</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {property.surface} m²
                  </p>
                </div>

                {property.landSurface && (
                  <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-100">
                    <div className="flex items-center gap-2 text-brand-700 text-xs font-semibold">
                      <LandPlot className="w-4 h-4" />
                      <span>Terrain</span>
                    </div>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {property.landSurface} m²
                    </p>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-100">
                  <div className="flex items-center gap-2 text-brand-700 text-xs font-semibold">
                    <BedDouble className="w-4 h-4" />
                    <span>Chambres</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {property.bedrooms} chambres
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-100">
                  <div className="flex items-center gap-2 text-brand-700 text-xs font-semibold">
                    <Bath className="w-4 h-4" />
                    <span>Salles d&apos;eau</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {property.bathrooms} sdb.
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Description détaillée du bien
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features & Equipment */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
              <h2 className="text-xl font-bold text-slate-900">
                Équipements, Confort & Sécurité
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {property.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70"
                  >
                    <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
                    <span className="text-sm font-semibold text-slate-800">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map / Localization */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Localisation & Quartier
                  </h2>
                  <p className="text-sm text-slate-600">
                    {property.address} ({property.district}, {property.city})
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                  <MapPin className="w-3.5 h-3.5 text-fusion-600" />
                  {property.city}, Congo
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 h-80 bg-slate-100">
                <iframe
                  title={`Carte ${property.title}`}
                  src={osmEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Visit Form & Agent Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              <VisitRequestForm
                propertyId={property.id}
                propertyTitle={property.title}
                propertyRef={property.reference}
                whatsappNumber={agent?.whatsapp || settings.whatsapp}
              />

              {/* Dedicated Agent */}
              {agent && (
                <div className="bg-brand-950 text-white rounded-2xl p-6 border border-brand-800 space-y-4">
                  <div className="flex items-center gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-fusion-400"
                    />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-fusion-400">
                        Conseiller dédié
                      </span>
                      <h4 className="text-base font-bold text-white">
                        {agent.name}
                      </h4>
                      <p className="text-xs text-brand-200">{agent.role}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-brand-800 space-y-2 text-xs text-brand-100">
                    <a
                      href={`tel:${agent.phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-2 hover:text-fusion-300"
                    >
                      <Phone className="w-3.5 h-3.5 text-fusion-400" />
                      <span>{agent.phone}</span>
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-2 hover:text-fusion-300"
                    >
                      <Mail className="w-3.5 h-3.5 text-fusion-400" />
                      <span>{agent.email}</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-brand-300 bg-brand-900/90 p-2.5 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-fusion-400 shrink-0" />
                    <span>
                      Dossier vérifié par notre service juridique à{" "}
                      {property.city}.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
              Autres biens susceptibles de vous intéresser
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

