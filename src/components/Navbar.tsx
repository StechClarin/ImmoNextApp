"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Menu,
  X,
  Phone,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { AgencySettings } from "@/types/immo";

export default function Navbar({ settings }: { settings: AgencySettings }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/entreprise", label: "L'Entreprise & Activités" },
    { href: "/equipe", label: "Notre Équipe" },
    { href: "/actualites", label: "Actualités" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-950/95 backdrop-blur-md border-b border-brand-800/80 text-white">
      {/* Top Info Bar */}
      <div className="bg-brand-900/90 border-b border-brand-800/60 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-brand-100">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-fusion-400 animate-pulse" />
              {settings.city}, {settings.country}
            </span>
            <span className="hidden md:inline text-brand-300">|</span>
            <span className="hidden md:inline text-brand-200">
              {settings.openingHours}
            </span>
          </div>
          {/* <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.phonePrimary.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 text-fusion-300 hover:text-fusion-200 font-medium transition"
            >
              <Phone className="w-3.5 h-3.5" />
              {settings.phonePrimary}
            </a>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-800 hover:bg-brand-700 text-brand-100 border border-brand-600/50 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-fusion-400" />
              <span>Administration</span>
            </Link>
          </div> */}
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logoUrl}
              alt={settings.name}
              className="h-11 w-auto object-contain rounded-lg"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-fusion-gradient p-0.5 shadow-lg shadow-fusion-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-brand-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-fusion-400" />
              </div>
            </div>
          )}
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              {settings.name.split(" ")[0]}
              <span className="bg-fusion-gradient bg-clip-text text-transparent ml-1">
                {settings.name.split(" ").slice(1).join(" ") || "Congo"}
              </span>
            </span>
            <p className="text-[11px] text-brand-300 uppercase tracking-widest">
              Vente • Location • Gestion
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-800/90 text-fusion-300 border border-brand-700"
                    : "text-brand-100 hover:text-white hover:bg-brand-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-fusion-gradient text-brand-950 font-semibold text-sm shadow-md shadow-fusion-500/20 hover:brightness-110 transition"
          >
            <span>Trouver un bien</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-brand-200 hover:text-white hover:bg-brand-800"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-900 border-t border-brand-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-brand-800 text-fusion-300"
                    : "text-brand-100 hover:bg-brand-800/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/catalogue"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-fusion-gradient text-brand-950 font-semibold text-sm"
            >
              Explorer le Catalogue
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-brand-800 text-brand-100 font-medium text-sm border border-brand-700"
            >
              Panneau d&apos;Administration
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

