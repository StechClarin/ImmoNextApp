"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export interface HeroSlide {
  url: string;
  caption?: string;
  location?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=85",
    caption: "Villa Contemporaine avec Piscine & Verrière",
    location: "Centre-Ville, Brazzaville",
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85",
    caption: "Duplex de Haut Standing Vue Fleuve Congo",
    location: "Plateau des 15 Ans, Brazzaville",
  },
  {
    url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=85",
    caption: "Villa de Prestige avec Jardin Tropical & Palmiers",
    location: "Côte Sauvage, Pointe-Noire",
  },
  {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85",
    caption: "Résidence Moderne Neuve Clé en Main",
    location: "Kintélé, République du Congo",
  },
  {
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=85",
    caption: "Intérieurs de Luxe & Salons de Réception",
    location: "Brazzaville & Pointe-Noire",
  },
];

interface HeroBackgroundSliderProps {
  slides?: HeroSlide[];
  intervalMs?: number;
}

export default function HeroBackgroundSlider({
  slides = DEFAULT_SLIDES,
  intervalMs = 5500,
}: HeroBackgroundSliderProps) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length
    );
  }, [activeSlides.length]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPaused, intervalMs, nextSlide]);

  const currentSlide = activeSlides[currentIndex];

  return (
    <div
      className="absolute inset-0 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Carrousel d'images immobilières en arrière-plan"
    >
      {/* SLIDES D'IMAGES AVEC TRANSITION FLUIDE & EFFET KEN BURNS */}
      {activeSlides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.url + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-[7000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
              style={{
                backgroundImage: `url('${slide.url}')`,
              }}
            />
          </div>
        );
      })}

      {/* GRADIENTS DE CONTRASTE SOPHISTIQUÉS (POUR UNE PARFAITE LISIBILITÉ DU TEXTE) */}
      {/* Gradient principal : Teal profond sombre vers les côtés */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-brand-950/95 via-brand-950/80 to-brand-900/65" />
      {/* Gradient vertical : assure le fondu en haut et en bas */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-brand-950/90 via-transparent to-brand-950/95" />

      {/* LUMIÈRES D'AMBIANCE FUSION (OR & ORANGE CHAUD) */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-fusion-500/20 blur-3xl pointer-events-none z-20" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-brand-400/15 blur-3xl pointer-events-none z-20" />

      {/* BANNIÈRE D'ANNONCE FLOTTANTE (HAUTEUR STRICTEMENT FIXE & VIGNETTE IMAGE INCLUSE) */}
      {currentSlide && (
        <div className="hidden sm:flex absolute top-6 right-6 z-30 h-16 w-80 lg:w-96 items-center gap-3 px-3.5 bg-brand-950/80 backdrop-blur-md rounded-2xl border border-white/15 text-white shadow-2xl overflow-hidden transition-all duration-300">
          {/* Vignette image de l'annonce */}
          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-sm bg-brand-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSlide.url}
              alt={currentSlide.caption || "Annonce immobilière"}
              className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
            />
          </div>

          {/* Textes de l'annonce avec hauteur et lignes strictement fixes */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-fusion-500/20 text-fusion-300 border border-fusion-400/30 shrink-0">
                À la une
              </span>
              <p className="text-xs font-bold text-white truncate">
                {currentSlide.caption || "Annonce de prestige"}
              </p>
            </div>
            {currentSlide.location && (
              <p className="text-[11px] text-brand-200 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-fusion-400 shrink-0" />
                <span className="truncate">{currentSlide.location}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* CONTRÔLES NAVIGATION FLÉCHÉS (Gretchen & Dexter) */}
      <div className="hidden md:flex absolute bottom-8 right-8 z-30 items-center gap-2">
        <button
          type="button"
          onClick={prevSlide}
          className="w-9 h-9 rounded-full bg-brand-900/70 hover:bg-brand-800 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition shadow-lg hover:scale-105 active:scale-95"
          title="Image précédente"
          aria-label="Image précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="w-9 h-9 rounded-full bg-brand-900/70 hover:bg-brand-800 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition shadow-lg hover:scale-105 active:scale-95"
          title="Image suivante"
          aria-label="Image suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* INDICATEURS DE SLIDE (PAGINATION DOTS) */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-brand-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
        {activeSlides.map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => setCurrentIndex(dotIdx)}
            className={`transition-all duration-300 rounded-full ${
              dotIdx === currentIndex
                ? "w-6 h-2 bg-gradient-to-r from-fusion-500 to-amber-400 shadow-sm"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
            title={`Diapositive ${dotIdx + 1}`}
            aria-label={`Aller à la diapositive ${dotIdx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

