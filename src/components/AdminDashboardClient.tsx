"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  FileText,
  Users,
  Inbox,
  Settings,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  ExternalLink,
  Save,
  Menu,
  Search,
  Sparkles,
  Building2,
  TrendingUp,
  Upload,
  X,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Eye,
  Check,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  LogOut,
  KeyRound,
  Crown,
  Database,
  Palette,
  RotateCcw,
  Sliders,
  Pipette,
} from "lucide-react";
import {
  Property,
  Article,
  TeamMember,
  Inquiry,
  AgencySettings,
  SafeAdminUser,
  AdminPermission,
} from "@/types/immo";
import { buildNextPropertyReference, formatPriceFCFA } from "@/lib/format";
import {
  THEME_PRESETS,
  parseColorWithAlpha,
  rgbaToHex,
} from "@/lib/theme";
import ColorPickerModal from "@/components/ColorPickerModal";

export default function AdminDashboardClient({
  currentUser,
  initialProperties,
  initialArticles,
  initialTeam,
  initialInquiries,
  initialSettings,
  initialAdminUsers = [],
}: {
  currentUser: SafeAdminUser;
  initialProperties: Property[];
  initialArticles: Article[];
  initialTeam: TeamMember[];
  initialInquiries: Inquiry[];
  initialSettings: AgencySettings;
  initialAdminUsers?: SafeAdminUser[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "properties" | "inquiries" | "articles" | "team" | "settings" | "users"
  >("properties");

  const [showDetailedKpis, setShowDetailedKpis] = useState(true);

  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [settings, setSettings] = useState<AgencySettings>(initialSettings);
  const [adminUsers, setAdminUsers] =
    useState<SafeAdminUser[]>(initialAdminUsers);
  const [toast, setToast] = useState<string | null>(null);
  const [activeColorPicker, setActiveColorPicker] = useState<{
    key: "primaryColor" | "secondaryColor" | "accentColor" | "darkColor";
    name: string;
    role: string;
  } | null>(null);

  const isSuperuser =
    currentUser.isSuperuser ||
    currentUser.role === "SUPERUSER" ||
    currentUser.username.toLowerCase() === "ethernanos";

  function can(permission: AdminPermission): boolean {
    if (isSuperuser) return true;
    return currentUser.permissions.includes(permission);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  // Search & Filter inside Admin
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyFilterType, setPropertyFilterType] = useState<string>("ALL");

  // Hamburger Action Menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url || null;
  }

  // --- PROPERTY FORM STATE ---
  const [editingProperty, setEditingProperty] =
    useState<Partial<Property> | null>(null);
  const [isReferenceManuallyEdited, setIsReferenceManuallyEdited] =
    useState(false);
  const [featuresText, setFeaturesText] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Lock scroll and handle Escape key for property modal
  useEffect(() => {
    if (editingProperty) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && editingProperty) {
        setEditingProperty(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editingProperty]);

  // Vérification périodique de la session (durée 1h et poste unique connecté)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.status === 401) {
          router.refresh();
        }
      } catch {
        // En cas de coupure réseau temporaire, on ne déconnecte pas prématurément
      }
    }, 30000); // toutes les 30 secondes
    return () => clearInterval(interval);
  }, [router]);

  function openNewProperty() {
    setOpenMenuId(null);
    setIsReferenceManuallyEdited(false);
    setEditingProperty({
      title: "",
      reference: buildNextPropertyReference(
        "Brazzaville",
        properties.map((p) => p.reference)
      ),
      transactionType: "VENTE",
      category: "Villa",
      status: "DISPONIBLE",
      price: 65000000,
      city: "Brazzaville",
      district: "Centre-Ville",
      address: "Brazzaville, République du Congo",
      surface: 180,
      landSurface: 450,
      rooms: 5,
      bedrooms: 3,
      bathrooms: 3,
      description: "",
      featured: true,
    });
    setFeaturesText(
      "Titre foncier en règle\nBâche à eau + Surpresseur\nGroupe électrogène\nClimatisation"
    );
    setImagesText(
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85"
    );
  }

  function openEditProperty(p: Property) {
    setOpenMenuId(null);
    setIsReferenceManuallyEdited(true);
    setEditingProperty(p);
    setFeaturesText(p.features.join("\n"));
    setImagesText(p.images.join("\n"));
  }

  async function handleSaveProperty(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProperty) return;
    const payload = {
      ...editingProperty,
      features: featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      images: imagesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const saved: Property = await res.json();
      setProperties((prev) => {
        const exists = prev.some((item) => item.id === saved.id);
        return exists
          ? prev.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...prev];
      });
      setEditingProperty(null);
      showToast("Bien immobilier enregistré avec succès !");
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || "Erreur lors de l'enregistrement du bien.");
    }
  }

  async function handleQuickPropertyUpdate(
    property: Property,
    patch: Partial<Property>
  ) {
    setOpenMenuId(null);
    const updated = { ...property, ...patch };
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const saved: Property = await res.json();
      setProperties((prev) =>
        prev.map((item) => (item.id === saved.id ? saved : item))
      );
      showToast("Bien mis à jour !");
      router.refresh();
    }
  }

  async function handleDeleteProperty(id: string) {
    setOpenMenuId(null);
    const res = await fetch(`/api/properties?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      showToast("Bien immobilier supprimé.");
      router.refresh();
    }
  }

  // --- ARTICLE FORM STATE ---
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(
    null
  );

  async function handleSaveArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!editingArticle) return;
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingArticle),
    });
    if (res.ok) {
      const saved: Article = await res.json();
      setArticles((prev) => {
        const exists = prev.some((a) => a.id === saved.id);
        return exists
          ? prev.map((a) => (a.id === saved.id ? saved : a))
          : [saved, ...prev];
      });
      setEditingArticle(null);
      showToast("Article enregistré avec succès !");
      router.refresh();
    }
  }

  async function handleDeleteArticle(id: string) {
    setOpenMenuId(null);
    const res = await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast("Article supprimé.");
      router.refresh();
    }
  }

  // --- TEAM FORM STATE ---
  const [editingMember, setEditingMember] =
    useState<Partial<TeamMember> | null>(null);

  async function handleSaveMember(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMember) return;
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingMember),
    });
    if (res.ok) {
      const saved: TeamMember = await res.json();
      setTeam((prev) => {
        const exists = prev.some((m) => m.id === saved.id);
        return exists
          ? prev.map((m) => (m.id === saved.id ? saved : m))
          : [...prev, saved];
      });
      setEditingMember(null);
      showToast("Membre de l'équipe enregistré !");
      router.refresh();
    }
  }

  async function handleDeleteMember(id: string) {
    setOpenMenuId(null);
    const res = await fetch(`/api/team?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setTeam((prev) => prev.filter((m) => m.id !== id));
      showToast("Collaborateur supprimé.");
      router.refresh();
    }
  }

  // --- INQUIRIES HANDLERS ---
  async function handleInquiryStatus(id: string, status: Inquiry["status"]) {
    setOpenMenuId(null);
    const res = await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
      showToast("Statut de la demande mis à jour.");
    }
  }

  async function handleDeleteInquiry(id: string) {
    setOpenMenuId(null);
    const res = await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      showToast("Demande supprimée.");
    }
  }

  // --- SETTINGS HANDLER ---
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      const updated = await res.json();
      setSettings(updated);
      showToast("Identité, logo et coordonnées de l'entreprise mis à jour !");
      router.refresh();
    }
  }

  // --- KPIs COMPUTATION ---
  const salesProperties = properties.filter(
    (p) => p.transactionType === "VENTE"
  );
  const rentProperties = properties.filter(
    (p) => p.transactionType === "LOCATION"
  );
  const salesCount = salesProperties.length;
  const rentCount = rentProperties.length;

  const totalSalesPortfolioFCFA = salesProperties.reduce(
    (acc, p) => acc + (p.price || 0),
    0
  );
  const totalMonthlyRentFCFA = rentProperties.reduce(
    (acc, p) => acc + (p.price || 0),
    0
  );
  const totalAnnualRentFCFA = totalMonthlyRentFCFA * 12;

  const totalSurface = properties.reduce((acc, p) => acc + (p.surface || 0), 0);
  const totalLandSurface = properties.reduce(
    (acc, p) => acc + (p.landSurface || 0),
    0
  );
  const avgSalePricePerSqm =
    salesProperties.length > 0
      ? Math.round(
          salesProperties.reduce(
            (acc, p) => acc + p.price / Math.max(1, p.surface),
            0
          ) / salesProperties.length
        )
      : 0;

  const availableCount = properties.filter(
    (p) => p.status === "DISPONIBLE"
  ).length;
  const featuredCount = properties.filter((p) => p.featured).length;
  const availabilityRate =
    properties.length > 0
      ? Math.round((availableCount / properties.length) * 100)
      : 0;

  const newInquiriesCount = inquiries.filter(
    (i) => i.status === "NOUVEAU"
  ).length;
  const processedInquiriesCount = inquiries.filter(
    (i) => i.status === "TRAITE" || i.status === "EN_COURS"
  ).length;
  const inquiryResponseRate =
    inquiries.length > 0
      ? Math.round((processedInquiriesCount / inquiries.length) * 100)
      : 100;
  const visitRequestsCount = inquiries.filter(
    (i) => i.type === "VISITE"
  ).length;

  const brazzavilleCount = properties.filter((p) =>
    p.city.toLowerCase().includes("brazza")
  ).length;
  const pointeNoireCount = properties.filter((p) =>
    p.city.toLowerCase().includes("pointe")
  ).length;
  const brazzaPercent =
    properties.length > 0
      ? Math.round((brazzavilleCount / properties.length) * 100)
      : 0;
  const pnrPercent =
    properties.length > 0
      ? Math.round((pointeNoireCount / properties.length) * 100)
      : 0;

  const categoryCounts = ["Villa", "Duplex", "Maison", "Appartement"].map(
    (cat) => {
      const count = properties.filter((p) => p.category === cat).length;
      const pct =
        properties.length > 0
          ? Math.round((count / properties.length) * 100)
          : 0;
      return { cat, count, pct };
    }
  );

  const filteredProperties = properties.filter((p) => {
    if (propertyFilterType !== "ALL" && p.transactionType !== propertyFilterType)
      return false;
    if (
      searchQuery &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.reference.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.district.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  async function handleDeleteAdminUser(id: string) {
    setOpenMenuId(null);
    const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setAdminUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("Utilisateur supprimé de la base de données.");
    }
  }

  const navItems = [
    {
      id: "properties" as const,
      label: "Catalogue",
      icon: Home,
      badge: properties.length,
      visible: true,
    },
    {
      id: "inquiries" as const,
      label: "Demandes & Visites",
      icon: Inbox,
      badge: inquiries.length,
      alert: newInquiriesCount > 0,
      visible: can("inquiries:read"),
    },
    {
      id: "articles" as const,
      label: "Actualités",
      icon: FileText,
      badge: articles.length,
      visible: true,
    },
    {
      id: "team" as const,
      label: "Équipe",
      icon: Users,
      badge: team.length,
      visible: true,
    },
    {
      id: "settings" as const,
      label: "Identité & Logo",
      icon: Settings,
      visible: can("settings:write"),
    },
    {
      id: "users" as const,
      label: "Accès & Rôles",
      icon: KeyRound,
      badge: adminUsers.length > 0 ? adminUsers.length : undefined,
      visible: can("users:manage"),
    },
  ].filter((item) => item.visible);

  return (
    <div ref={menuContainerRef} className="w-full">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-brand-950 text-white border border-fusion-400 px-5 py-3.5 rounded-2xl shadow-2xl max-w-sm">
          <div className="w-8 h-8 rounded-xl bg-fusion-gradient text-brand-950 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* STICKY ADMIN TOPBAR (Replaces Sidebar) */}
      <div className="bg-brand-950 text-white border-b border-brand-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 space-y-5">
          {/* Top Row: Title + User Badge + Quick Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-fusion-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Console de Gestion Immobilière</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                    isSuperuser
                      ? "bg-fusion-gradient text-brand-950"
                      : "bg-brand-800 text-brand-100 border border-brand-700"
                  }`}
                >
                  {isSuperuser && <Crown className="w-3 h-3" />}
                  <span>
                    {currentUser.username}
                    {isSuperuser ? " (Superuser)" : ` (${currentUser.role})`}
                  </span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                Administration — {settings.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowDetailedKpis(!showDetailedKpis)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-brand-100 text-xs font-semibold border border-brand-700 transition"
              >
                <BarChart3 className="w-3.5 h-3.5 text-fusion-400" />
                <span>{showDetailedKpis ? "Masquer KPIs" : "Afficher KPIs"}</span>
                {showDetailedKpis ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              <Link
                href="/catalogue"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-brand-100 text-xs font-semibold border border-brand-700 transition"
              >
                <Eye className="w-3.5 h-3.5 text-fusion-400" />
                <span>Catalogue Public</span>
              </Link>

              {can("properties:write") && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("properties");
                    openNewProperty();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-fusion-gradient text-brand-950 text-xs font-extrabold shadow-md shadow-fusion-500/20 hover:brightness-110 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un bien</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-200 hover:text-white text-xs font-bold border border-red-400/30 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Horizontal Navigation Tabs (Scrollable on Mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setOpenMenuId(null);
                  }}
                  className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition shrink-0 ${
                    active
                      ? "bg-fusion-gradient text-brand-950 shadow-md shadow-fusion-500/20"
                      : "bg-brand-900/70 hover:bg-brand-800 text-brand-100 border border-brand-800"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active ? "text-brand-950" : "text-fusion-400"
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                        active
                          ? "bg-brand-950 text-fusion-300"
                          : item.alert
                          ? "bg-fusion-500 text-brand-950"
                          : "bg-brand-800 text-brand-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN FULL-WIDTH CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* COLLAPSIBLE KPI DASHBOARD */}
        {showDetailedKpis && (
          <div className="space-y-4">
            {/* Row 1: 4 Primary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-brand-950 text-white rounded-2xl p-5 border border-brand-800 shadow-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-fusion-300">
                    Volume Vente (Portefeuille)
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-fusion-gradient text-brand-950 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
                    {formatPriceFCFA(totalSalesPortfolioFCFA)}
                  </p>
                  <p className="text-xs text-brand-300 mt-1">
                    Moy. {formatPriceFCFA(avgSalePricePerSqm)} / m² ({salesCount}{" "}
                    biens)
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Potentiel Locatif Mensuel
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-brand-900 text-fusion-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                    {formatPriceFCFA(totalMonthlyRentFCFA)}
                    <span className="text-xs font-semibold text-slate-400">
                      /mois
                    </span>
                  </p>
                  <p className="text-xs text-brand-700 font-semibold mt-1 truncate">
                    Annuel : {formatPriceFCFA(totalAnnualRentFCFA)} ({rentCount}{" "}
                    biens)
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Taux de Disponibilité
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {availabilityRate}%
                    </p>
                    <span className="text-xs font-bold text-emerald-700">
                      {availableCount} / {properties.length} dispo.
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
                    <div
                      className="h-full bg-brand-600 rounded-full"
                      style={{ width: `${availabilityRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Suivi Demandes Clients
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-fusion-100 text-fusion-700 flex items-center justify-center shrink-0">
                    <Inbox className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {inquiries.length}
                    </p>
                    <span className="text-xs font-bold text-fusion-600">
                      {visitRequestsCount} visite(s) • {newInquiriesCount} nouv.
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Taux de traitement :{" "}
                    <strong className="text-slate-800">
                      {inquiryResponseRate}%
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2: 3 Analytical Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                    Surfaces & Contenus
                  </span>
                  <Sparkles className="w-4 h-4 text-fusion-500" />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500">Surface bâtie</p>
                    <p className="text-base font-extrabold text-slate-900">
                      {totalSurface.toLocaleString("fr-FR")} m²
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500">Foncier total</p>
                    <p className="text-base font-extrabold text-slate-900">
                      {totalLandSurface.toLocaleString("fr-FR")} m²
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-brand-50/70 border border-brand-100">
                    <p className="text-[11px] text-brand-700">Coups de cœur</p>
                    <p className="text-base font-extrabold text-brand-900">
                      {featuredCount} biens
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-fusion-50 border border-fusion-200/60">
                    <p className="text-[11px] text-fusion-800">Équipe & Blog</p>
                    <p className="text-base font-extrabold text-fusion-900">
                      {team.length} ag. • {articles.length} art.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                    Répartition Géographique
                  </span>
                  <MapPin className="w-4 h-4 text-fusion-600" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">
                        Brazzaville & Kintélé ({brazzavilleCount})
                      </span>
                      <span className="text-brand-700">{brazzaPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-brand-700 rounded-full"
                        style={{ width: `${brazzaPercent}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">
                        Pointe-Noire ({pointeNoireCount})
                      </span>
                      <span className="text-fusion-600">{pnrPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-fusion-gradient rounded-full"
                        style={{ width: `${pnrPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Marchés actifs en République du Congo.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                    Répartition par Typologie
                  </span>
                  <Home className="w-4 h-4 text-brand-600" />
                </div>
                <div className="space-y-2">
                  {categoryCounts.map((item) => (
                    <div key={item.cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{item.cat}s</span>
                        <span className="text-slate-900 font-bold">
                          {item.count} ({item.pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-brand-600 rounded-full"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: PROPERTIES (FULL-WIDTH RESPONSIVE GRID) */}
        {activeTab === "properties" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Catalogue Immobilier ({filteredProperties.length} biens)
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Maisons, Villas, Duplex & Appartements
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative min-w-[240px] sm:min-w-[280px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher réf, titre, quartier..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                  {[
                    { id: "ALL", label: "Tous" },
                    { id: "VENTE", label: "Vente" },
                    { id: "LOCATION", label: "Location" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPropertyFilterType(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        propertyFilterType === tab.id
                          ? "bg-brand-950 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal de Modification / Création de Bien */}
            {editingProperty && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-brand-950/70 backdrop-blur-sm animate-fade-in"
                onClick={() => setEditingProperty(null)}
              >
                <div
                  className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-brand-950 text-white shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-fusion-gradient text-brand-950 flex items-center justify-center shrink-0 shadow-md">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white">
                          {editingProperty.id
                            ? `Modifier : ${editingProperty.title}`
                            : "Nouveau bien immobilier"}
                        </h3>
                        <p className="text-xs text-brand-300">
                          {editingProperty.reference
                            ? `Référence : ${editingProperty.reference}`
                            : "Formulaire d'édition du catalogue"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingProperty(null)}
                      className="p-2 rounded-xl text-brand-300 hover:text-white hover:bg-brand-900 transition"
                      aria-label="Fermer la fenêtre modale"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body (Scrollable Form) */}
                  <form
                    id="property-modal-form"
                    onSubmit={handleSaveProperty}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Titre de l&apos;annonce *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProperty.title || ""}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              title: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Référence
                        </label>
                        <input
                          type="text"
                          value={editingProperty.reference || ""}
                          onChange={(e) => {
                            setIsReferenceManuallyEdited(true);
                            setEditingProperty({
                              ...editingProperty,
                              reference: e.target.value,
                            });
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Transaction
                        </label>
                        <select
                          value={editingProperty.transactionType || "VENTE"}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              transactionType: e.target
                                .value as Property["transactionType"],
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        >
                          <option value="VENTE">VENTE</option>
                          <option value="LOCATION">LOCATION</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Catégorie
                        </label>
                        <select
                          value={editingProperty.category || "Villa"}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              category: e.target.value as Property["category"],
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        >
                          <option value="Villa">Villa</option>
                          <option value="Maison">Maison</option>
                          <option value="Duplex">Duplex</option>
                          <option value="Appartement">Appartement</option>
                          <option value="Terrain">Terrain</option>
                          <option value="Bureau / Commerce">
                            Bureau / Commerce
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Statut
                        </label>
                        <select
                          value={editingProperty.status || "DISPONIBLE"}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              status: e.target.value as Property["status"],
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        >
                          <option value="DISPONIBLE">DISPONIBLE</option>
                          <option value="SOUS_OFFRE">SOUS OFFRE</option>
                          <option value="VENDU">VENDU</option>
                          <option value="LOUE">LOUÉ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Prix (FCFA) *
                        </label>
                        <input
                          type="number"
                          required
                          value={editingProperty.price || 0}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              price: Number(e.target.value),
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={editingProperty.city || ""}
                          onChange={(e) => {
                            const nextCity = e.target.value;
                            const shouldAutoUpdateRef =
                              !editingProperty.id && !isReferenceManuallyEdited;
                            setEditingProperty({
                              ...editingProperty,
                              city: nextCity,
                              ...(shouldAutoUpdateRef
                                ? {
                                    reference: buildNextPropertyReference(
                                      nextCity,
                                      properties.map((p) => p.reference)
                                    ),
                                  }
                                : {}),
                            });
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Quartier
                        </label>
                        <input
                          type="text"
                          value={editingProperty.district || ""}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              district: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Adresse précise
                        </label>
                        <input
                          type="text"
                          value={editingProperty.address || ""}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              address: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Surface bâtie (m²)
                        </label>
                        <input
                          type="number"
                          value={editingProperty.surface || 0}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              surface: Number(e.target.value),
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Terrain (m²)
                        </label>
                        <input
                          type="number"
                          value={editingProperty.landSurface || 0}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              landSurface: Number(e.target.value),
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Chambres
                        </label>
                        <input
                          type="number"
                          value={editingProperty.bedrooms || 0}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              bedrooms: Number(e.target.value),
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Salles d&apos;eau
                        </label>
                        <input
                          type="number"
                          value={editingProperty.bathrooms || 0}
                          onChange={(e) =>
                            setEditingProperty({
                              ...editingProperty,
                              bathrooms: Number(e.target.value),
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Description détaillée
                      </label>
                      <textarea
                        rows={3}
                        value={editingProperty.description || ""}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            description: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Équipements & Atouts (1 par ligne)
                        </label>
                        <textarea
                          rows={4}
                          value={featuresText}
                          onChange={(e) => setFeaturesText(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700">
                            Photos (URLs ou téléversement)
                          </label>
                          <label className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-fusion-600 cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {uploadingImage ? "Envoi..." : "Téléverser photo"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingImage(true);
                                const url = await uploadFile(file);
                                setUploadingImage(false);
                                if (url) {
                                  setImagesText((prev) =>
                                    prev ? `${url}\n${prev}` : url
                                  );
                                  showToast("Photo ajoutée !");
                                }
                              }}
                            />
                          </label>
                        </div>
                        <textarea
                          rows={4}
                          value={imagesText}
                          onChange={(e) => setImagesText(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </form>

                  {/* Modal Footer */}
                  <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
                    <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProperty.featured)}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            featured: e.target.checked,
                          })
                        }
                        className="rounded text-brand-600 w-4 h-4"
                      />
                      <span>Mettre en &quot;Coup de cœur&quot; à la une</span>
                    </label>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingProperty(null)}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        form="property-modal-form"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-fusion-gradient hover:brightness-110 text-brand-950 text-xs font-extrabold shadow-md transition"
                      >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer le bien</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Responsive 2-Column Grid of Property Admin Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProperties.map((p) => {
                const menuId = `prop-menu-${p.id}`;
                const isOpen = openMenuId === menuId;

                return (
                  <div
                    key={p.id}
                    className="relative bg-slate-50/80 hover:bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-brand-500/40 hover:shadow-md transition flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-brand-950 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                        {p.featured && (
                          <span
                            title="Coup de cœur"
                            className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-fusion-gradient text-brand-950 flex items-center justify-center shadow"
                          >
                            <Sparkles className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                p.transactionType === "VENTE"
                                  ? "bg-fusion-gradient text-brand-950"
                                  : "bg-brand-800 text-white"
                              }`}
                            >
                              {p.transactionType}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">
                              {p.reference}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                p.status === "DISPONIBLE"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>

                          {/* Hamburger Menu Button */}
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(isOpen ? null : menuId)
                              }
                              aria-label="Menu d'actions"
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                                isOpen
                                  ? "bg-brand-950 text-fusion-400 border-brand-950 shadow-md"
                                  : "bg-white hover:bg-brand-50 text-slate-700 border-slate-200"
                              }`}
                            >
                              <Menu className="w-4 h-4" />
                            </button>

                            {isOpen && (
                              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-40 text-xs font-semibold text-slate-700">
                                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                  Actions — {p.reference}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => openEditProperty(p)}
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-brand-50 text-slate-800 transition text-left"
                                >
                                  <Edit3 className="w-4 h-4 text-brand-600" />
                                  <span>Modifier ce bien</span>
                                </button>

                                <Link
                                  href={`/catalogue/${p.slug}`}
                                  target="_blank"
                                  onClick={() => setOpenMenuId(null)}
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-brand-50 text-slate-800 transition"
                                >
                                  <ExternalLink className="w-4 h-4 text-brand-600" />
                                  <span>Voir la fiche publique</span>
                                </Link>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuickPropertyUpdate(p, {
                                      featured: !p.featured,
                                    })
                                  }
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-brand-50 text-slate-800 transition text-left"
                                >
                                  <Sparkles className="w-4 h-4 text-fusion-500" />
                                  <span>
                                    {p.featured
                                      ? "Retirer des coups de cœur"
                                      : "Mettre en coup de cœur"}
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuickPropertyUpdate(p, {
                                      status:
                                        p.status === "DISPONIBLE"
                                          ? p.transactionType === "VENTE"
                                            ? "VENDU"
                                            : "LOUE"
                                          : "DISPONIBLE",
                                    })
                                  }
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-brand-50 text-slate-800 transition text-left"
                                >
                                  <Check className="w-4 h-4 text-emerald-600" />
                                  <span>
                                    {p.status === "DISPONIBLE"
                                      ? p.transactionType === "VENTE"
                                        ? "Marquer comme VENDU"
                                        : "Marquer comme LOUÉ"
                                      : "Remettre DISPONIBLE"}
                                  </span>
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                <button
                                  type="button"
                                  onClick={() => handleDeleteProperty(p.id)}
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-red-50 text-red-600 transition text-left"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Supprimer ce bien</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                          {p.title}
                        </h3>

                        <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-fusion-600 shrink-0" />
                          <span className="truncate">
                            {p.district}, <strong>{p.city}</strong>
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Footer of Card: Specs & Price */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 text-xs">
                      <span className="text-slate-600 font-medium">
                        {p.category} • {p.surface} m² • {p.bedrooms} ch. •{" "}
                        {p.bathrooms} sdb.
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-brand-950">
                        {formatPriceFCFA(p.price)}
                        {p.pricePeriod && (
                          <span className="text-[11px] font-normal text-slate-500">
                            {" "}
                            {p.pricePeriod}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-fusion-600">
                Relation Clientèle
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Demandes de Visite, Contact & Estimations
              </h2>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-12 text-center text-sm text-slate-500">
                Aucune demande enregistrée pour le moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {inquiries.map((inq) => {
                  const menuId = `inq-menu-${inq.id}`;
                  const isOpen = openMenuId === menuId;

                  return (
                    <div
                      key={inq.id}
                      className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                inq.type === "VISITE"
                                  ? "bg-fusion-gradient text-brand-950"
                                  : "bg-brand-900 text-white"
                              }`}
                            >
                              {inq.type}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                inq.status === "NOUVEAU"
                                  ? "bg-amber-100 text-amber-800"
                                  : inq.status === "EN_COURS"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {inq.status}
                            </span>
                            {inq.propertyRef && (
                              <span className="text-[11px] font-bold text-brand-800 bg-brand-100/80 px-2.5 py-0.5 rounded-full">
                                {inq.propertyRef}
                              </span>
                            )}
                          </div>

                          {/* Hamburger Menu for Inquiry */}
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(isOpen ? null : menuId)
                              }
                              aria-label="Actions demande"
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                                isOpen
                                  ? "bg-brand-950 text-fusion-400 border-brand-950"
                                  : "bg-white hover:bg-brand-50 text-slate-700 border-slate-200"
                              }`}
                            >
                              <Menu className="w-4 h-4" />
                            </button>

                            {isOpen && (
                              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-40 text-xs font-semibold text-slate-700">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleInquiryStatus(inq.id, "EN_COURS")
                                  }
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-brand-50 text-left"
                                >
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <span>Marquer &quot;En cours&quot;</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleInquiryStatus(inq.id, "TRAITE")
                                  }
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-brand-50 text-left"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Marquer &quot;Traité&quot;</span>
                                </button>
                                <div className="my-1 border-t border-slate-100" />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-red-50 text-red-600 text-left"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Supprimer la demande</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">
                            {inq.fullName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                            <a
                              href={`tel:${inq.phone}`}
                              className="inline-flex items-center gap-1 text-brand-700 font-bold hover:underline"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {inq.phone}
                            </a>
                            {inq.email && (
                              <a
                                href={`mailto:${inq.email}`}
                                className="inline-flex items-center gap-1 hover:underline"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                {inq.email}
                              </a>
                            )}
                            {inq.preferredDate && (
                              <span className="inline-flex items-center gap-1 font-bold text-fusion-700">
                                <Calendar className="w-3.5 h-3.5" />
                                Visite : {inq.preferredDate}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/70">
                          {inq.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ARTICLES */}
        {activeTab === "articles" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Contenu Éditorial
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Actualités & Conseils Immobiliers
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpenMenuId(null);
                  setEditingArticle({
                    title: "",
                    category: "Marché Immobilier",
                    excerpt: "",
                    content: "",
                    author: "Équipe ImmoVitrine",
                    readTime: "4 min",
                    coverImage:
                      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80",
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-xs sm:text-sm shadow self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Rédiger un article</span>
              </button>
            </div>

            {editingArticle && (
              <form
                onSubmit={handleSaveArticle}
                className="bg-slate-50 rounded-2xl p-4 sm:p-6 border-2 border-brand-600 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-brand-950">
                    {editingArticle.id
                      ? "Modifier l'article"
                      : "Nouvel article d'actualité"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingArticle.title || ""}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          title: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Catégorie
                    </label>
                    <input
                      type="text"
                      value={editingArticle.category || ""}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Auteur
                    </label>
                    <input
                      type="text"
                      value={editingArticle.author || ""}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          author: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Image de couverture (URL)
                    </label>
                    <input
                      type="text"
                      value={editingArticle.coverImage || ""}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          coverImage: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Résumé (Extrait)
                  </label>
                  <textarea
                    rows={2}
                    value={editingArticle.excerpt || ""}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        excerpt: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contenu complet
                  </label>
                  <textarea
                    rows={5}
                    value={editingArticle.content || ""}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        content: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-950 text-white text-xs font-bold"
                  >
                    Publier l&apos;article
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((art) => {
                const menuId = `art-menu-${art.id}`;
                const isOpen = openMenuId === menuId;

                return (
                  <div
                    key={art.id}
                    className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/90 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold text-fusion-600 bg-fusion-50 px-2.5 py-0.5 rounded-full">
                          {art.category} • {art.publishedAt}
                        </span>

                        {/* Hamburger Menu for Article */}
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(isOpen ? null : menuId)
                            }
                            aria-label="Actions article"
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                              isOpen
                                ? "bg-brand-950 text-fusion-400 border-brand-950"
                                : "bg-white hover:bg-brand-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            <Menu className="w-4 h-4" />
                          </button>

                          {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-40 text-xs font-semibold text-slate-700">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setEditingArticle(art);
                                }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-brand-50 text-left"
                              >
                                <Edit3 className="w-4 h-4 text-brand-600" />
                                <span>Modifier l&apos;article</span>
                              </button>
                              <Link
                                href={`/actualites/${art.slug}`}
                                target="_blank"
                                onClick={() => setOpenMenuId(null)}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-brand-50"
                              >
                                <ExternalLink className="w-4 h-4 text-brand-600" />
                                <span>Lire sur le site</span>
                              </Link>
                              <div className="my-1 border-t border-slate-100" />
                              <button
                                type="button"
                                onClick={() => handleDeleteArticle(art.id)}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-red-50 text-red-600 text-left"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                          {art.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {art.excerpt}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
                      Par {art.author} ({art.readTime})
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: TEAM */}
        {activeTab === "team" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Ressources Humaines
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Gestion des Agents & Collaborateurs
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpenMenuId(null);
                  setEditingMember({
                    name: "",
                    role: "Conseiller Immobilier",
                    specialty: "Vente & Location — Brazzaville",
                    bio: "",
                    phone: "+242 06 000 00 00",
                    whatsapp: "242060000000",
                    email: "contact@immovitrine-congo.cg",
                    experienceYears: 5,
                    photo:
                      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-xs sm:text-sm shadow self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un collaborateur</span>
              </button>
            </div>

            {editingMember && (
              <form
                onSubmit={handleSaveMember}
                className="bg-slate-50 rounded-2xl p-4 sm:p-6 border-2 border-brand-600 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-brand-950">
                    {editingMember.id
                      ? `Modifier ${editingMember.name}`
                      : "Nouveau collaborateur"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMember.name || ""}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          name: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Poste / Rôle *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMember.role || ""}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          role: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Spécialité
                    </label>
                    <input
                      type="text"
                      value={editingMember.specialty || ""}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          specialty: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Téléphone (+242)
                    </label>
                    <input
                      type="text"
                      value={editingMember.phone || ""}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          phone: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingMember.email || ""}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Photo (URL)
                    </label>
                    <input
                      type="text"
                      value={editingMember.photo || ""}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          photo: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Biographie
                  </label>
                  <textarea
                    rows={2}
                    value={editingMember.bio || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        bio: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-950 text-white text-xs font-bold"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.map((m) => {
                const menuId = `team-menu-${m.id}`;
                const isOpen = openMenuId === menuId;

                return (
                  <div
                    key={m.id}
                    className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/90 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">
                          {m.name}
                        </h3>
                        <p className="text-xs font-semibold text-brand-700 truncate">
                          {m.role}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {m.phone}
                        </p>
                      </div>
                    </div>

                    {/* Hamburger Menu for Team Member */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(isOpen ? null : menuId)}
                        aria-label="Actions collaborateur"
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                          isOpen
                            ? "bg-brand-950 text-fusion-400 border-brand-950"
                            : "bg-white hover:bg-brand-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <Menu className="w-4 h-4" />
                      </button>

                      {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-40 text-xs font-semibold text-slate-700">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              setEditingMember(m);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-brand-50 text-left"
                          >
                            <Edit3 className="w-4 h-4 text-brand-600" />
                            <span>Modifier le profil</span>
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(m.id)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-red-50 text-red-600 text-left"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === "settings" && (
          <form
            onSubmit={handleSaveSettings}
            className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/90 shadow-sm space-y-6"
          >
            <div className="pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Paramètres Généraux
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Identité de l&apos;Entreprise, Logo & Coordonnées
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom de l&apos;entreprise
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Logo de l&apos;entreprise
                  </label>
                  <label className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-fusion-600 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser un logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadFile(file);
                        if (url) {
                          setSettings({ ...settings, logoUrl: url });
                          showToast(
                            "Logo téléversé ! Cliquez sur Enregistrer."
                          );
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, logoUrl: e.target.value })
                  }
                  placeholder="URL du logo ou téléversement direct"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Slogan de l&apos;agence
              </label>
              <input
                type="text"
                value={settings.slogan}
                onChange={(e) =>
                  setSettings({ ...settings, slogan: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Téléphone principal (+242)
                </label>
                <input
                  type="text"
                  value={settings.phonePrimary}
                  onChange={(e) =>
                    setSettings({ ...settings, phonePrimary: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Téléphone secondaire
                </label>
                <input
                  type="text"
                  value={settings.phoneSecondary}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      phoneSecondary: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numéro WhatsApp (ex: 242066000000)
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email officiel
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adresse du siège
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Horaires d&apos;ouverture
                </label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) =>
                    setSettings({ ...settings, openingHours: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Texte d&apos;introduction (Bannière Accueil)
              </label>
              <textarea
                rows={2}
                value={settings.aboutIntro}
                onChange={(e) =>
                  setSettings({ ...settings, aboutIntro: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Histoire & Vision de l&apos;entreprise
              </label>
              <textarea
                rows={4}
                value={settings.aboutStory}
                onChange={(e) =>
                  setSettings({ ...settings, aboutStory: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>

            {/* SECTION APPARENCE & CHARTE GRAPHIQUE */}
            <div className="pt-6 border-t border-slate-200/90 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-fusion-500/10 flex items-center justify-center text-fusion-600">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Apparence &amp; Charte Graphique du Site
                    </h3>
                    <p className="text-xs text-slate-500">
                      Personnalisez les couleurs principales, secondaires, d&apos;accentuation et sombres. L&apos;ensemble du site s&apos;adaptera automatiquement.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      primaryColor: "#0f766e",
                      darkColor: "#042f2e",
                      secondaryColor: "#ea580c",
                      accentColor: "#f59e0b",
                    });
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                  title="Restaurer les couleurs officielles Teal & Fusion Congo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser par défaut</span>
                </button>
              </div>

              {/* PALETTES PRÉDÉFINIES */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Harmonies recommandées en 1 clic
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected =
                      (settings.primaryColor || "#0f766e").toLowerCase() === preset.primaryColor.toLowerCase() &&
                      (settings.secondaryColor || "#ea580c").toLowerCase() === preset.secondaryColor.toLowerCase();
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSettings({
                            ...settings,
                            primaryColor: preset.primaryColor,
                            darkColor: preset.darkColor,
                            secondaryColor: preset.secondaryColor,
                            accentColor: preset.accentColor,
                          });
                        }}
                        className={`group relative p-3 rounded-2xl border text-left transition flex flex-col justify-between h-full ${
                          isSelected
                            ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/30"
                            : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: preset.primaryColor }}
                            title="Couleur principale"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: preset.secondaryColor }}
                            title="Couleur secondaire"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: preset.accentColor }}
                            title="Couleur d'accent"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">
                            {preset.name}
                          </p>
                          <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                            {preset.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SÉLECTEURS DE COULEURS AVEC BARRE D'OPACITÉ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                {[
                  {
                    key: "primaryColor" as const,
                    name: "Couleur Principale (Brand)",
                    role: "Bandeaux, boutons primaires, titres",
                    defaultHex: "#0f766e",
                  },
                  {
                    key: "secondaryColor" as const,
                    name: "Couleur Secondaire (Fusion)",
                    role: "Boutons d'action, badges, contrastes",
                    defaultHex: "#ea580c",
                  },
                  {
                    key: "accentColor" as const,
                    name: "Couleur d'Accentuation (Or / Ambre)",
                    role: "Prix, étoiles, dégradés d'impact",
                    defaultHex: "#f59e0b",
                  },
                  {
                    key: "darkColor" as const,
                    name: "Couleur Sombre (Dark / Footer)",
                    role: "Pied de page, hero fond sombre, header",
                    defaultHex: "#042f2e",
                  },
                ].map((col) => {
                  const rawVal = settings[col.key] || col.defaultHex;
                  const parsed = parseColorWithAlpha(rawVal, col.defaultHex);
                  const alphaPercent = Math.round(parsed.a * 100);

                  return (
                    <div
                      key={col.key}
                      className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <label className="text-xs font-bold text-slate-800 truncate">
                            {col.name}
                          </label>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mb-2.5">
                          {col.role}
                        </p>

                        {/* Pastille cliquable + Input Hexadécimal */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveColorPicker({
                                key: col.key,
                                name: col.name,
                                role: col.role,
                              })
                            }
                            className="relative w-10 h-10 rounded-xl border border-slate-300 shadow-sm overflow-hidden flex-shrink-0 group cursor-pointer hover:ring-2 hover:ring-brand-500/40 transition"
                            style={{
                              backgroundImage:
                                "repeating-conic-gradient(#cbd5e1 0% 25%, #ffffff 0% 50%)",
                              backgroundPosition: "50%",
                              backgroundSize: "8px 8px",
                            }}
                            title="Cliquer pour ouvrir le sélecteur avec spectre & barre d'opacité"
                          >
                            <div
                              className="w-full h-full group-hover:scale-105 transition"
                              style={{
                                backgroundColor:
                                  parsed.a < 1 ? parsed.hex8 : parsed.hex6,
                              }}
                            />
                          </button>

                          <input
                            type="text"
                            value={rawVal}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                [col.key]: e.target.value,
                              })
                            }
                            placeholder={col.defaultHex}
                            className="flex-1 rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-mono uppercase font-bold text-slate-700 bg-slate-50 focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* BARRE D'OPACITÉ AVEC FOND DAMIER */}
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-600 flex items-center gap-1">
                            <span>Barre d&apos;opacité</span>
                          </span>
                          <span className="font-mono font-bold text-slate-800 text-[11px]">
                            {alphaPercent}%
                          </span>
                        </div>

                        {/* Slider visuel sur fond damier + dégradé vers la couleur */}
                        <div
                          className="relative h-5 rounded-lg overflow-hidden border border-slate-300 shadow-inner"
                          style={{
                            backgroundImage:
                              "repeating-conic-gradient(#cbd5e1 0% 25%, #ffffff 0% 50%)",
                            backgroundPosition: "50%",
                            backgroundSize: "8px 8px",
                          }}
                        >
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={alphaPercent}
                            onChange={(e) => {
                              const newAlpha = Number(e.target.value) / 100;
                              const newHex = rgbaToHex(
                                parsed.r,
                                parsed.g,
                                parsed.b,
                                newAlpha
                              );
                              setSettings({
                                ...settings,
                                [col.key]: newHex,
                              });
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            title={`Opacité : ${alphaPercent}%`}
                          />
                          <div
                            className="w-full h-full pointer-events-none"
                            style={{
                              background: `linear-gradient(to right, transparent, ${parsed.hex6})`,
                            }}
                          />
                          {/* Curseur visuel */}
                          <div
                            className="absolute top-0 bottom-0 w-2.5 -ml-1 rounded-sm border-2 border-white shadow-md pointer-events-none ring-1 ring-black/40"
                            style={{
                              left: `${alphaPercent}%`,
                              backgroundColor:
                                parsed.a < 1 ? parsed.hex8 : parsed.hex6,
                            }}
                          />
                        </div>

                        {/* Bouton pour ouvrir la palette complète */}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveColorPicker({
                              key: col.key,
                              name: col.name,
                              role: col.role,
                            })
                          }
                          className="w-full mt-1.5 py-1 px-2 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-[10px] font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition"
                        >
                          <Sliders className="w-3 h-3 text-slate-500" />
                          <span>Spectre &amp; Opacité avancés</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* APERÇU EN DIRECT DU THÈME */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-sm">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-600 ml-2">
                      Aperçu interactif de votre nouvelle charte
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Simulation en direct
                  </span>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  {/* Mini Header */}
                  <div
                    className="p-3.5 rounded-xl text-white flex items-center justify-between shadow-sm"
                    style={{ backgroundColor: settings.darkColor || "#042f2e" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                        style={{
                          background: `linear-gradient(135deg, ${settings.secondaryColor || "#ea580c"}, ${settings.accentColor || "#f59e0b"})`,
                          color: "#fff",
                        }}
                      >
                        IV
                      </div>
                      <span className="font-bold text-sm tracking-tight">
                        {settings.name || "ImmoVitrine Congo"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/80 hidden sm:inline">
                        Accueil
                      </span>
                      <span className="text-xs text-white/80 hidden sm:inline">
                        Biens
                      </span>
                      <button
                        type="button"
                        className="text-xs px-3 py-1 rounded-lg font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${settings.secondaryColor || "#ea580c"}, ${settings.accentColor || "#f59e0b"})`,
                          color: settings.darkColor || "#042f2e",
                        }}
                      >
                        Contact
                      </button>
                    </div>
                  </div>

                  {/* Mini Card Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-xl p-3.5 space-y-2.5 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider"
                          style={{
                            backgroundColor: settings.primaryColor || "#0f766e",
                          }}
                        >
                          À VENDRE
                        </span>
                        <span
                          className="font-bold text-sm font-mono"
                          style={{
                            color: settings.secondaryColor || "#ea580c",
                          }}
                        >
                          125 000 000 FCFA
                        </span>
                      </div>
                      <h4
                        className="font-bold text-sm"
                        style={{ color: settings.darkColor || "#042f2e" }}
                      >
                        Villa de Prestige au Centre-Ville
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        Magnifique villa contemporaine R+1 avec piscine privée, 4 chambres et groupe électrogène.
                      </p>
                      <button
                        type="button"
                        className="w-full py-2 rounded-lg text-xs font-bold text-white transition hover:opacity-90"
                        style={{
                          backgroundColor: settings.primaryColor || "#0f766e",
                        }}
                      >
                        Voir les détails du bien
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-3.5 space-y-3 bg-gradient-to-br from-slate-50 to-white flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1">
                          Boutons d&apos;Appel à l&apos;Action (CTA)
                        </h4>
                        <p className="text-xs text-slate-500 mb-3">
                          Testez le contraste entre la couleur principale et les accents.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
                            style={{
                              backgroundColor: settings.primaryColor || "#0f766e",
                            }}
                          >
                            Bouton Principal
                          </button>
                          <button
                            type="button"
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
                            style={{
                              backgroundColor: settings.secondaryColor || "#ea580c",
                            }}
                          >
                            Bouton Action
                          </button>
                          <button
                            type="button"
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold"
                            style={{
                              backgroundColor: settings.accentColor || "#f59e0b",
                              color: settings.darkColor || "#042f2e",
                            }}
                          >
                            Accent Or
                          </button>
                        </div>
                      </div>
                      <div
                        className="p-2.5 rounded-lg text-xs font-medium text-center"
                        style={{
                          background: `linear-gradient(135deg, ${settings.secondaryColor || "#ea580c"}, ${settings.accentColor || "#f59e0b"})`,
                          color: settings.darkColor || "#042f2e",
                        }}
                      >
                        Dégradé Fusion officiel : Bannière &amp; Prix vedettes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-fusion-gradient text-brand-950 font-bold text-sm shadow-lg shadow-fusion-500/20 hover:brightness-110 transition"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer la configuration</span>
            </button>
          </form>
        )}

        {/* TAB 6: USERS & PERMISSIONS (Direct DB provisioned) */}
        {activeTab === "users" && can("users:manage") && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Sécurité & Contrôle d&apos;Accès
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Comptes Collaborateurs & Permissions
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  La création et la gestion des accès sont strictement limitées
                  à la base de données.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold self-start sm:self-auto">
                <Database className="w-3.5 h-3.5 text-brand-600" />
                <span>Création limitée à la base de données</span>
              </div>
            </div>

            {(() => {
              const visibleAdminUsers = adminUsers.filter(
                (u) =>
                  !u.isSuperuser &&
                  u.role !== "SUPERUSER" &&
                  u.username.toLowerCase() !== "ethernanos"
              );

              if (visibleAdminUsers.length === 0) {
                return (
                  <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-300 text-center space-y-2">
                    <ShieldCheck className="w-8 h-8 text-brand-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-800">
                      Aucun compte collaborateur enregistré dans la base de données
                    </p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      La création de nouveaux accès administrateurs ou éditeurs
                      est restreinte directement au niveau de la base de données
                      (Prisma / script sécurisé) afin de garantir l&apos;intégrité
                      du système.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleAdminUsers.map((u) => (
                    <div
                      key={u.id}
                      className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">
                              {u.username}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800">
                              {u.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{u.fullName}</p>
                        </div>
                        {u.username.toLowerCase() === "administrateur" ? (
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-200 text-slate-700">
                            Compte principal
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteAdminUser(u.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                            title="Supprimer ce compte"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {u.permissions.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-600"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* MODALE DU SÉLECTEUR AVANCÉ AVEC SPECTRE & BARRE D'OPACITÉ */}
      {activeColorPicker && (
        <ColorPickerModal
          isOpen={true}
          onClose={() => setActiveColorPicker(null)}
          colorName={activeColorPicker.name}
          colorRole={activeColorPicker.role}
          currentColor={settings[activeColorPicker.key] || "#0f766e"}
          onApply={(newHex) => {
            setSettings({
              ...settings,
              [activeColorPicker.key]: newHex,
            });
          }}
        />
      )}
    </div>
  );
}
