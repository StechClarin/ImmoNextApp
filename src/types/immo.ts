export type TransactionType = "VENTE" | "LOCATION";

export type PropertyCategory =
  | "Villa"
  | "Maison"
  | "Appartement"
  | "Duplex"
  | "Terrain"
  | "Bureau / Commerce";

export type PropertyStatus = "DISPONIBLE" | "SOUS_OFFRE" | "VENDU" | "LOUE";

export interface Property {
  id: string;
  slug: string;
  reference: string;
  title: string;
  transactionType: TransactionType;
  category: PropertyCategory;
  status: PropertyStatus;
  price: number; // en FCFA
  pricePeriod?: string; // ex: "/ mois" pour location
  city: string; // ex: Brazzaville, Pointe-Noire, Kintélé...
  district: string; // ex: Centre-Ville, Plateau des 15 ans, Mpila...
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  surface: number; // m²
  landSurface?: number; // m² terrain
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[]; // ex: ["Groupe électrogène", "Forage / Bâche à eau", "Piscine", "Gardiennage 24/7", "Climatisation"]
  images: string[];
  featured: boolean;
  agentId?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  phone: string;
  email: string;
  whatsapp?: string;
  photo: string;
  experienceYears: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  readTime: string;
}

export interface Inquiry {
  id: string;
  type: "VISITE" | "CONTACT" | "ESTIMATION";
  propertyId?: string;
  propertyTitle?: string;
  propertyRef?: string;
  fullName: string;
  phone: string;
  email: string;
  preferredDate?: string;
  message: string;
  status: "NOUVEAU" | "EN_COURS" | "TRAITE";
  createdAt: string;
}

export interface AgencySettings {
  name: string;
  slogan: string;
  logoUrl: string; // Vide = logo vectoriel par défaut (Teal & Fusion)
  currency: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  openingHours: string;
  aboutIntro: string;
  aboutStory: string;
  stats: {
    propertiesSoldOrRented: string;
    satisfiedClients: string;
    yearsExperience: string;
    citiesCovered: string;
  };
}

export type AdminPermission =
  | "properties:write"
  | "properties:delete"
  | "inquiries:read"
  | "inquiries:write"
  | "inquiries:delete"
  | "articles:write"
  | "articles:delete"
  | "team:write"
  | "team:delete"
  | "settings:write"
  | "users:manage";

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  role: "SUPERUSER" | "ADMIN" | "EDITOR";
  isSuperuser: boolean;
  permissions: AdminPermission[];
  passwordHash: string;
  createdAt: string;
}

export type SafeAdminUser = Omit<AdminUser, "passwordHash">;

export interface DatabaseSchema {
  settings: AgencySettings;
  properties: Property[];
  team: TeamMember[];
  articles: Article[];
  inquiries: Inquiry[];
  users?: AdminUser[];
}

