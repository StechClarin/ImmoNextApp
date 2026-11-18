import React from "react";
import Link from "next/link";
import { Phone, Mail, Award, MessageSquare, ArrowRight } from "lucide-react";
import { getTeam, getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EquipePage() {
  const [team, settings] = await Promise.all([getTeam(), getSettings()]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header (Hauteur fixe & Arrière-plan avec photo) */}
      <section className="relative bg-brand-950 text-white min-h-[360px] flex items-center border-b border-brand-800 overflow-hidden">
        {/* Photo de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 transform scale-105 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-950/85 to-brand-900/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/90 via-transparent to-brand-950/95" />
        <div className="absolute -top-20 left-1/3 w-80 h-80 rounded-full bg-fusion-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-fusion-500/20 text-fusion-300 border border-fusion-400/30">
            Les Visages de {settings.name}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-3">
            Notre Équipe d&apos;Experts Immobiliers
          </h1>
          <p className="text-brand-200 mt-3 max-w-2xl text-base leading-relaxed">
            Nos conseillers immobiliers et juristes fonciers vous accompagnent
            sur le terrain à Brazzaville, Kintélé et Pointe-Noire.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition flex flex-col"
            >
              <div className="h-80 overflow-hidden relative bg-brand-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-fusion-gradient text-brand-950 shadow">
                    <Award className="w-3.5 h-3.5" />
                    {member.experienceYears} ans d&apos;exp.
                  </span>
                </div>
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h2 className="text-2xl font-bold">{member.name}</h2>
                  <p className="text-sm text-fusion-300 font-medium">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 rounded-lg bg-brand-50 text-brand-800 text-xs font-bold">
                    Spécialité : {member.specialty}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <a
                    href={`tel:${member.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 hover:text-brand-700"
                  >
                    <Phone className="w-4 h-4 text-fusion-500" />
                    <span>{member.phone}</span>
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-brand-700"
                  >
                    <Mail className="w-4 h-4 text-brand-600" />
                    <span>{member.email}</span>
                  </a>
                  {member.whatsapp && (
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/${member.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-fusion-400" />
                        <span>Contacter sur WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recruitment / Join Banner */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Vous souhaitez rejoindre notre équipe commerciale ?
            </h3>
            <p className="text-sm text-slate-600">
              Nous recrutons régulièrement des agents commerciaux passionnés à
              Brazzaville et Pointe-Noire.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-sm shrink-0"
          >
            <span>Envoyer une candidature</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

