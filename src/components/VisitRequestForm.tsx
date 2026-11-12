"use client";

import React, { useState } from "react";
import { CalendarCheck, CheckCircle2, Send, Phone } from "lucide-react";

export default function VisitRequestForm({
  propertyId,
  propertyTitle,
  propertyRef,
  whatsappNumber,
}: {
  propertyId: string;
  propertyTitle: string;
  propertyRef: string;
  whatsappNumber: string;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState(
    `Bonjour, je suis intéressé(e) par le bien "${propertyTitle}" (Réf: ${propertyRef}) et je souhaiterais programmer une visite.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "VISITE",
          propertyId,
          propertyTitle,
          propertyRef,
          fullName,
          phone,
          email,
          preferredDate,
          message,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const whatsappText = encodeURIComponent(
    `Bonjour, je souhaite visiter le bien ${propertyTitle} (Réf: ${propertyRef}).`
  );

  if (submitted) {
    return (
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-brand-950">
          Demande de visite enregistrée !
        </h4>
        <p className="text-sm text-slate-600">
          Merci <strong>{fullName}</strong>. Notre conseiller en charge du bien{" "}
          <strong>{propertyRef}</strong> vous recontactera très rapidement au{" "}
          <strong>{phone}</strong>.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs font-semibold text-brand-700 underline"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-fusion-gradient text-brand-950 flex items-center justify-center shrink-0">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Demander une visite
          </h3>
          <p className="text-xs text-slate-500">
            Réponse rapide par téléphone ou WhatsApp
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Votre nom complet *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ex: Christelle Sassou / M. Nzoussi"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Téléphone / WhatsApp (+242) *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: +242 06 600 00 00"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Adresse email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Date de visite souhaitée
          </label>
          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Message ou questions
          </label>
          <textarea
            rows={3}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-sm shadow-md shadow-fusion-500/20 hover:brightness-110 transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>
            {submitting ? "Envoi en cours..." : "Programmer ma visite"}
          </span>
        </button>
      </form>

      <div className="pt-2 border-t border-slate-100">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs transition"
        >
          <Phone className="w-3.5 h-3.5 text-fusion-400" />
          <span>Discuter directement sur WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

