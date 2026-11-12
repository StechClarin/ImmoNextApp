"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactFormClient({
  defaultType = "CONTACT",
}: {
  defaultType?: "CONTACT" | "ESTIMATION";
}) {
  const [type, setType] = useState<"CONTACT" | "ESTIMATION">(defaultType);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
          type,
          fullName,
          phone,
          email,
          message,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setFullName("");
        setPhone("");
        setEmail("");
        setMessage("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-brand-950">
          Votre message a bien été envoyé !
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Notre équipe à Brazzaville / Pointe-Noire a bien reçu votre demande et
          vous recontactera dans les plus brefs délais.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="px-4 py-2 rounded-xl bg-brand-900 text-white text-xs font-semibold"
        >
          Envoyer un nouveau message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5"
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setType("CONTACT")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            type === "CONTACT"
              ? "bg-brand-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Demande d&apos;information générale
        </button>
        <button
          type="button"
          onClick={() => setType("ESTIMATION")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            type === "ESTIMATION"
              ? "bg-fusion-gradient text-brand-950"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Confier un bien (Vente / Mise en location)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nom & Prénom *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Votre nom complet"
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
            placeholder="+242 06 600 00 00"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>
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
          Votre projet ou message *
        </label>
        <textarea
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            type === "ESTIMATION"
              ? "Décrivez le bien que vous souhaitez vendre ou mettre en location (quartier, surface, nombre de chambres, prix souhaité en FCFA)..."
              : "Précisez votre recherche immobilière ou votre question..."
          }
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-sm shadow-lg shadow-fusion-500/20 hover:brightness-110 transition disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>{submitting ? "Envoi..." : "Envoyer ma demande"}</span>
      </button>
    </form>
  );
}

