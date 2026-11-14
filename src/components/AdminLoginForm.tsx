"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function AdminLoginForm({
  agencyName,
  logoUrl,
}: {
  agencyName: string;
  logoUrl?: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Identifiant ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError("Erreur de connexion au serveur.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 relative overflow-hidden">
      {/* Decorative Teal & Fusion ambient glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-fusion-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-400/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-brand-800/30 overflow-hidden">
          {/* Card Header */}
          <div className="bg-brand-950 text-white px-6 py-7 text-center space-y-3 border-b border-brand-800">
            <div className="flex justify-center">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={agencyName}
                  className="h-12 w-auto object-contain rounded-xl"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-fusion-gradient p-0.5 shadow-lg shadow-fusion-500/25">
                  <div className="w-full h-full bg-brand-950 rounded-[14px] flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-fusion-400" />
                  </div>
                </div>
              )}
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-fusion-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Accès Back-Office Sécurisé</span>
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">
                {agencyName}
              </h1>
              <p className="text-xs text-brand-300 mt-1">
                Connectez-vous pour gérer le catalogue, les demandes et le site
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="admin-username"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre identifiant"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-fusion-gradient text-brand-950 font-extrabold text-sm shadow-lg shadow-fusion-500/25 hover:brightness-110 transition disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {loading ? "Connexion en cours..." : "Se connecter à l'admin"}
              </span>
            </button>

            <div className="pt-2 text-center space-y-2">
              <p className="text-[11px] text-slate-500">
                🔒 Session active limitée à 1h • Un seul poste connecté simultanément
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour au site vitrine</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

