"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const safeImages =
    images && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
        ];
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative h-[340px] sm:h-[460px] rounded-2xl overflow-hidden bg-brand-950 border border-slate-200 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={safeImages[activeIndex]}
          alt={`${title} - Photo ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Counter badge */}
        <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-950/85 text-white text-xs font-semibold backdrop-blur-sm">
          <Camera className="w-3.5 h-3.5 text-fusion-400" />
          <span>
            {activeIndex + 1} / {safeImages.length} photos
          </span>
        </div>

        {/* Navigation Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-950/80 hover:bg-brand-900 text-white flex items-center justify-center transition shadow"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-950/80 hover:bg-brand-900 text-white flex items-center justify-center transition shadow"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 rounded-xl overflow-hidden border-2 transition ${
                idx === activeIndex
                  ? "border-fusion-500 ring-2 ring-fusion-400/40"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Miniature ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

