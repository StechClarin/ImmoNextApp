"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Check, Pipette, RotateCcw } from "lucide-react";
import {
  parseColorWithAlpha,
  rgbToHsv,
  hsvToRgb,
  rgbaToHex,
} from "@/lib/theme";

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorName: string;
  colorRole: string;
  currentColor: string;
  onApply: (colorHex: string) => void;
}

const CHECKERBOARD_STYLE: React.CSSProperties = {
  backgroundImage:
    "repeating-conic-gradient(#cbd5e1 0% 25%, #ffffff 0% 50%)",
  backgroundPosition: "50%",
  backgroundSize: "12px 12px",
};

export default function ColorPickerModal({
  isOpen,
  onClose,
  colorName,
  colorRole,
  currentColor,
  onApply,
}: ColorPickerModalProps) {
  const [h, setH] = useState(174);
  const [s, setS] = useState(87);
  const [v, setV] = useState(46);
  const [a, setA] = useState(1);
  const [hexInput, setHexInput] = useState("");
  const [hasEyeDropper, setHasEyeDropper] = useState(false);

  const satBoxRef = useRef<HTMLDivElement>(null);
  const isDraggingSat = useRef(false);

  // Initialize values when opening
  useEffect(() => {
    if (!isOpen) return;
    const parsed = parseColorWithAlpha(currentColor);
    const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
    setH(hsv.h);
    setS(hsv.s);
    setV(hsv.v);
    setA(parsed.a);
    setHexInput(parsed.a < 1 ? parsed.hex8 : parsed.hex6);

    if (typeof window !== "undefined" && "EyeDropper" in window) {
      setHasEyeDropper(true);
    }
  }, [isOpen, currentColor]);

  // Compute current RGB from HSV
  const currentRgb = hsvToRgb(h, s, v);
  const currentSolidHex = rgbaToHex(currentRgb.r, currentRgb.g, currentRgb.b, 1);
  const currentFullHex = rgbaToHex(
    currentRgb.r,
    currentRgb.g,
    currentRgb.b,
    a
  );
  const currentRgbaString = `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${a})`;

  // Handle 2D Saturation / Value drag
  const updateSatValFromPointer = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!satBoxRef.current) return;
      const rect = satBoxRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

      const newS = Math.round((x / rect.width) * 100);
      const newV = Math.round((1 - y / rect.height) * 100);
      setS(newS);
      setV(newV);

      const rgb = hsvToRgb(h, newS, newV);
      setHexInput(rgbaToHex(rgb.r, rgb.g, rgb.b, a));
    },
    [h, a]
  );

  const handleMouseDownSat = (e: React.MouseEvent) => {
    isDraggingSat.current = true;
    updateSatValFromPointer(e);
  };

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isDraggingSat.current) {
        updateSatValFromPointer(e);
      }
    }
    function handleMouseUp() {
      isDraggingSat.current = false;
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [updateSatValFromPointer]);

  // Handle Hue change
  const handleHueChange = (newHue: number) => {
    setH(newHue);
    const rgb = hsvToRgb(newHue, s, v);
    setHexInput(rgbaToHex(rgb.r, rgb.g, rgb.b, a));
  };

  // Handle Opacity change
  const handleAlphaChange = (newAlphaPercent: number) => {
    const alphaVal = Math.max(0, Math.min(100, newAlphaPercent)) / 100;
    setA(alphaVal);
    setHexInput(rgbaToHex(currentRgb.r, currentRgb.g, currentRgb.b, alphaVal));
  };

  // Handle manual Hex input
  const handleHexInputChange = (str: string) => {
    setHexInput(str);
    const trimmed = str.trim();
    if (
      /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
        trimmed
      )
    ) {
      const parsed = parseColorWithAlpha(trimmed);
      const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
      setH(hsv.h);
      setS(hsv.s);
      setV(hsv.v);
      setA(parsed.a);
    }
  };

  // Eyedropper API
  const handlePickEyeDropper = async () => {
    try {
      // @ts-ignore
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      if (result && result.sRGBHex) {
        handleHexInputChange(result.sRGBHex);
      }
    } catch {
      // User cancelled or not supported
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* EN-TÊTE MODALE */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Sélecteur Avancé &amp; Opacité</span>
            </h3>
            <p className="text-[11px] text-slate-500">{colorName} • {colorRole}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="p-5 space-y-4">
          {/* 1. ZONE 2D SATURATION & LUMINOSITÉ */}
          <div
            ref={satBoxRef}
            onMouseDown={handleMouseDownSat}
            className="relative w-full h-44 rounded-2xl cursor-crosshair overflow-hidden select-none shadow-inner border border-black/10"
            style={{
              backgroundColor: `hsl(${h}, 100%, 50%)`,
            }}
          >
            {/* Dégradé horizontal blanc -> transparent */}
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
            {/* Dégradé vertical transparent -> noir */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

            {/* Pointeur 2D */}
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none ring-1 ring-black/40"
              style={{
                left: `${s}%`,
                top: `${100 - v}%`,
                backgroundColor: currentSolidHex,
              }}
            />
          </div>

          {/* 2. BARRE DE TEINTE (HUE SLIDER) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>Teinte (Spectre chromatique)</span>
              <span className="font-mono text-slate-400">{h}°</span>
            </div>
            <div className="relative h-6 rounded-xl overflow-hidden shadow-inner border border-slate-200">
              <input
                type="range"
                min="0"
                max="360"
                value={h}
                onChange={(e) => handleHueChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                }}
              />
              {/* Curseur visuel */}
              <div
                className="absolute top-0 bottom-0 w-3 -ml-1.5 rounded-md border-2 border-white shadow-md pointer-events-none ring-1 ring-black/30"
                style={{
                  left: `${(h / 360) * 100}%`,
                  backgroundColor: `hsl(${h}, 100%, 50%)`,
                }}
              />
            </div>
          </div>

          {/* 3. BARRE D'OPACITÉ (ALPHA SLIDER) AVEC FOND DAMIER */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span>Barre d&apos;Opacité</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-brand-50 text-brand-700 font-bold border border-brand-200/60">
                  Transparence
                </span>
              </span>
              <span className="font-mono font-bold text-slate-800">
                {Math.round(a * 100)}%
              </span>
            </div>

            <div
              className="relative h-6 rounded-xl overflow-hidden shadow-inner border border-slate-200"
              style={CHECKERBOARD_STYLE}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(a * 100)}
                onChange={(e) => handleAlphaChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {/* Dégradé transparent -> couleur choisie */}
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(to right, transparent, ${currentSolidHex})`,
                }}
              />
              {/* Curseur visuel d'opacité */}
              <div
                className="absolute top-0 bottom-0 w-3 -ml-1.5 rounded-md border-2 border-white shadow-md pointer-events-none ring-1 ring-black/30"
                style={{
                  left: `${a * 100}%`,
                  backgroundColor: currentFullHex,
                }}
              />
            </div>
          </div>

          {/* 4. PRÉVISUALISATION COULEUR & PIPETTE */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            {/* Double pastille : Ancienne vs Nouvelle */}
            <div
              className="relative w-12 h-12 rounded-xl border border-slate-300 shadow-sm overflow-hidden flex-shrink-0"
              style={CHECKERBOARD_STYLE}
              title="Aperçu couleur avec transparence"
            >
              <div
                className="w-full h-full"
                style={{ backgroundColor: currentFullHex }}
              />
            </div>

            {/* Inputs Hexadécimal & RGBA */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 w-10">
                  HEX
                </span>
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  placeholder="#0f766e"
                  className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-mono font-bold text-slate-800 bg-white uppercase"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 w-10">
                  RGBA
                </span>
                <span className="flex-1 text-[11px] font-mono text-slate-600 bg-white/70 px-2.5 py-1 rounded-lg border border-slate-200/60 truncate">
                  {currentRgbaString}
                </span>
              </div>
            </div>

            {/* Bouton Pipette (EyeDropper) si supporté */}
            {hasEyeDropper && (
              <button
                type="button"
                onClick={handlePickEyeDropper}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-brand-600 transition shadow-sm"
                title="Prélever une couleur à l'écran (Pipette)"
              >
                <Pipette className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 5. NUANCES RAPIDES PRÉDÉFINIES */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Échantillons rapides
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                "#0f766e",
                "#042f2e",
                "#ea580c",
                "#f59e0b",
                "#1d4ed8",
                "#047857",
                "#881337",
                "#27272a",
                "#4338ca",
                "#ffffff",
              ].map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => handleHexInputChange(swatch)}
                  className="w-6 h-6 rounded-lg border border-slate-300 shadow-sm hover:scale-110 transition"
                  style={{ backgroundColor: swatch }}
                  title={swatch}
                />
              ))}
            </div>
          </div>
        </div>

        {/* PIED DE MODALE : ANNULER & VALIDER */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(currentFullHex);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-fusion-gradient text-brand-950 text-xs font-bold shadow-md hover:brightness-110 transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Appliquer cette couleur</span>
          </button>
        </div>
      </div>
    </div>
  );
}

