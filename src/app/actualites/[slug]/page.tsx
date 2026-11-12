import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Clock, ArrowRight } from "lucide-react";
import { getArticleBySlug, getArticles } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const otherArticles = (await getArticles())
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-brand-950 text-white py-14 border-b border-brand-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-200 hover:text-fusion-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux actualités</span>
          </Link>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-fusion-gradient text-brand-950">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-200 pt-2">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4 text-fusion-400" />
              Par {article.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-fusion-400" />
              Publié le {article.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-fusion-400" />
              Temps de lecture : {article.readTime}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
          <div className="h-72 sm:h-96 overflow-hidden bg-brand-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            <p className="text-lg font-semibold text-brand-900 leading-relaxed border-l-4 border-fusion-500 pl-4">
              {article.excerpt}
            </p>

            <div className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-base">
              {article.content}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200 bg-brand-50/70 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-brand-950">
                  Vous avez un projet d&apos;achat, de vente ou de location au
                  Congo ?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Nos conseillers vous répondent sous 24h à Brazzaville et
                  Pointe-Noire.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-xs shrink-0"
              >
                <span>Prendre rendez-vous</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {otherArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              À lire également
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/actualites/${art.slug}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-brand-500 transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="text-xs font-bold text-fusion-600">
                      {art.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {art.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-brand-700">
                    Lire l&apos;article →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

