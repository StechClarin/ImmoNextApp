import React from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { getArticles } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ActualitesPage() {
  const articles = await getArticles();

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-brand-950 text-white py-16 border-b border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-fusion-500/20 text-fusion-300 border border-fusion-400/30">
            Actualités & Guides Pratiques
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-3">
            Toute l&apos;Actualité de l&apos;Immobilier au Congo
          </h1>
          <p className="text-brand-200 mt-3 max-w-2xl text-base">
            Conseils juridiques, évolution des quartiers de Brazzaville et
            Pointe-Noire, astuces pour propriétaires et investisseurs.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition flex flex-col"
            >
              <div className="h-56 overflow-hidden relative bg-brand-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-bold bg-fusion-gradient text-brand-950 shadow">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      {article.publishedAt}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-brand-600" />
                      {article.author}
                    </span>
                  </div>

                  <Link href={`/actualites/${article.slug}`}>
                    <h2 className="text-xl font-bold text-slate-900 hover:text-brand-700 transition">
                      {article.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <Link
                  href={`/actualites/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-fusion-600 pt-2 border-t border-slate-100"
                >
                  <span>Lire l&apos;article ({article.readTime})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

