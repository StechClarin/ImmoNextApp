"use client";

import React, { useState } from "react";
import { Calculator, ShieldCheck } from "lucide-react";
import { TransactionType } from "@/types/immo";
import { formatPriceFCFA } from "@/lib/format";

export default function CongoCostSimulator({
  price,
  transactionType,
}: {
  price: number;
  transactionType: TransactionType;
}) {
  const isSale = transactionType === "VENTE";

  // Pour la Vente : apport initial (%) et durée d'échelonnement (mois)
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [months, setMonths] = useState(24);

  // Pour la Location : nombre de mois de caution et mois d'avance (pratique courante au Congo)
  const [depositMonths, setDepositMonths] = useState(2);
  const [advanceMonths, setAdvanceMonths] = useState(1);

  if (isSale) {
    const notaryFees = Math.round(price * 0.08); // ~8% frais notariés & enregistrement foncier indicatifs
    const totalAcquisition = price + notaryFees;
    const downPayment = Math.round((price * downPaymentPercent) / 100);
    const remaining = Math.max(0, price - downPayment);
    const monthlyInstallment =
      months > 0 ? Math.round(remaining / months) : remaining;

    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-950 text-fusion-400 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Simulateur de Budget d&apos;Acquisition (FCFA)
            </h2>
            <p className="text-xs text-slate-500">
              Estimation indicative avec frais notariés et échéancier de
              paiement
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Apport initial ({downPaymentPercent}%)</span>
                <span className="text-brand-800">
                  {formatPriceFCFA(downPayment)}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-brand-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Durée d&apos;échelonnement</span>
                <span className="text-brand-800">{months} mois</span>
              </div>
              <input
                type="range"
                min={6}
                max={60}
                step={6}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-brand-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-brand-950 text-white rounded-2xl p-5 space-y-3 border border-brand-800">
            <div className="flex justify-between text-xs text-brand-200">
              <span>Prix du bien :</span>
              <span className="font-bold text-white">
                {formatPriceFCFA(price)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-brand-200">
              <span>Frais notaire & mutation (~8%) :</span>
              <span className="font-bold text-fusion-300">
                {formatPriceFCFA(notaryFees)}
              </span>
            </div>
            <div className="border-t border-brand-800 pt-2.5 flex justify-between items-baseline">
              <span className="text-xs text-brand-300">
                Mensualité indicative ({months} mois) :
              </span>
              <span className="text-lg font-extrabold bg-fusion-gradient bg-clip-text text-transparent">
                {formatPriceFCFA(monthlyInstallment)} / mois
              </span>
            </div>
            <p className="text-[11px] text-brand-300 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-fusion-400 shrink-0" />
              Coût total estimé : {formatPriceFCFA(totalAcquisition)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Simulateur pour LOCATION
  const depositTotal = price * depositMonths;
  const advanceTotal = price * advanceMonths;
  const agencyFee = price; // 1 mois d'honoraires
  const totalMoveIn = depositTotal + advanceTotal + agencyFee;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-950 text-fusion-400 flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Calculateur de Budget d&apos;Entrée en Location
          </h2>
          <p className="text-xs text-slate-500">
            Estimez votre budget initial (caution, avance et frais d&apos;agence)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Caution / Garantie locative ({depositMonths} mois)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDepositMonths(m)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    depositMonths === m
                      ? "bg-brand-900 text-white border-brand-900"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {m} mois
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Loyers d&apos;avance ({advanceMonths} mois)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 6].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAdvanceMonths(m)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    advanceMonths === m
                      ? "bg-fusion-gradient text-brand-950 border-fusion-400"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {m} mois
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-brand-950 text-white rounded-2xl p-5 space-y-2.5 border border-brand-800">
          <div className="flex justify-between text-xs text-brand-200">
            <span>Caution ({depositMonths} mois) :</span>
            <span className="font-bold text-white">
              {formatPriceFCFA(depositTotal)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-brand-200">
            <span>Loyers d&apos;avance ({advanceMonths} mois) :</span>
            <span className="font-bold text-white">
              {formatPriceFCFA(advanceTotal)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-brand-200">
            <span>Honoraires d&apos;agence (1 mois) :</span>
            <span className="font-bold text-fusion-300">
              {formatPriceFCFA(agencyFee)}
            </span>
          </div>
          <div className="border-t border-brand-800 pt-2.5 flex justify-between items-baseline">
            <span className="text-xs text-brand-300">Total à prévoir :</span>
            <span className="text-lg font-extrabold bg-fusion-gradient bg-clip-text text-transparent">
              {formatPriceFCFA(totalMoveIn)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

