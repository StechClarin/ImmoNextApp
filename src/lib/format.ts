export function formatPriceFCFA(price: number, currency = "FCFA"): string {
  return (
    new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 0,
    }).format(price) +
    " " +
    currency
  );
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CITY_CODE_MAP: Record<string, string> = {
  brazzaville: "BZV",
  bzv: "BZV",
  "pointe-noire": "PNR",
  "pointe noire": "PNR",
  pnr: "PNR",
  kintele: "KTL",
  dolisie: "DLS",
  nkayi: "NKY",
  ouesso: "OUE",
  owando: "OWO",
  madingou: "MDG",
  sibiti: "SBT",
  impfondo: "IMP",
  loango: "LNG",
  mossendjo: "MSJ",
  gamboma: "GMB",
  oyo: "OYO",
};

export function getCityCode(city: string): string {
  const normalized = (city || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (CITY_CODE_MAP[normalized]) {
    return CITY_CODE_MAP[normalized];
  }

  const letters = normalized.replace(/[^a-z0-9]/g, "").toUpperCase();
  if (letters.length >= 3) {
    return letters.slice(0, 3);
  }
  return letters || "CG";
}

export function buildNextPropertyReference(
  city: string,
  existingReferences: string[]
): string {
  const cityCode = getCityCode(city);
  const existingSet = new Set(
    existingReferences.map((r) => r.trim().toUpperCase()).filter(Boolean)
  );

  let maxSeq = 0;
  for (const ref of existingReferences) {
    const match = ref.trim().match(/(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxSeq) maxSeq = num;
    }
  }

  let nextSeq = maxSeq + 1;
  let candidate = `${cityCode}-IMO${String(nextSeq).padStart(3, "0")}`;
  while (existingSet.has(candidate.toUpperCase())) {
    nextSeq += 1;
    candidate = `${cityCode}-IMO${String(nextSeq).padStart(3, "0")}`;
  }
  return candidate;
}

