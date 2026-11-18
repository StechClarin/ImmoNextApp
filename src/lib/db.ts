import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { buildNextPropertyReference } from "@/lib/format";
import {
  DatabaseSchema,
  Property,
  Article,
  TeamMember,
  Inquiry,
  AgencySettings,
  AdminUser,
  AdminPermission,
  TransactionType,
  PropertyCategory,
  PropertyStatus,
} from "@/types/immo";

const SEED_JSON_PATH = path.join(process.cwd(), "data", "db.json");

export class DuplicateReferenceError extends Error {
  constructor(reference: string) {
    super(`La référence "${reference}" existe déjà. Veuillez en choisir une autre.`);
    this.name = "DuplicateReferenceError";
  }
}

const globalForSeed = globalThis as unknown as {
  __immoSeedPromise?: Promise<void>;
  __immoSeedDone?: boolean;
};

async function runSeedIfEmpty(): Promise<void> {
  if (globalForSeed.__immoSeedDone) return;

  const count = await prisma.settings.count();
  if (count > 0) {
    globalForSeed.__immoSeedDone = true;
    return;
  }

  if (!fs.existsSync(SEED_JSON_PATH)) {
    globalForSeed.__immoSeedDone = true;
    return;
  }

  const raw = fs.readFileSync(SEED_JSON_PATH, "utf-8");
  const seed = JSON.parse(raw) as DatabaseSchema;

  await prisma.$transaction(async (tx) => {
    const existing = await tx.settings.count();
    if (existing > 0) return;

    const s = seed.settings;
    await tx.settings.create({
      data: {
        id: 1,
        name: s.name,
        slogan: s.slogan,
        logoUrl: s.logoUrl || "",
        currency: s.currency || "FCFA",
        phonePrimary: s.phonePrimary,
        phoneSecondary: s.phoneSecondary || "",
        whatsapp: s.whatsapp || "",
        email: s.email,
        address: s.address,
        city: s.city,
        country: s.country,
        openingHours: s.openingHours,
        aboutIntro: s.aboutIntro,
        aboutStory: s.aboutStory,
        statsJson: JSON.stringify(s.stats),
        primaryColor: s.primaryColor || "#0f766e",
        secondaryColor: s.secondaryColor || "#ea580c",
        accentColor: s.accentColor || "#f59e0b",
        darkColor: s.darkColor || "#042f2e",
      },
    });

    for (const m of seed.team || []) {
      await tx.teamMember.upsert({
        where: { id: m.id },
        update: {},
        create: {
          id: m.id,
          name: m.name,
          role: m.role,
          specialty: m.specialty,
          bio: m.bio,
          phone: m.phone,
          email: m.email,
          whatsapp: m.whatsapp || null,
          photo: m.photo,
          experienceYears: m.experienceYears || 0,
        },
      });
    }

    const validTeamIds = new Set((seed.team || []).map((m) => m.id));

    for (const p of seed.properties || []) {
      await tx.property.upsert({
        where: { id: p.id },
        update: {},
        create: {
          id: p.id,
          slug: p.slug,
          reference: p.reference,
          title: p.title,
          transactionType: p.transactionType,
          category: p.category,
          status: p.status,
          price: p.price,
          pricePeriod: p.pricePeriod || null,
          city: p.city,
          district: p.district,
          address: p.address,
          lat: p.coordinates?.lat ?? -4.2634,
          lng: p.coordinates?.lng ?? 15.2832,
          surface: p.surface,
          landSurface: p.landSurface ?? null,
          rooms: p.rooms,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          description: p.description,
          featuresJson: JSON.stringify(p.features || []),
          imagesJson: JSON.stringify(p.images || []),
          featured: Boolean(p.featured),
          agentId: p.agentId && validTeamIds.has(p.agentId) ? p.agentId : null,
          createdAt: p.createdAt,
        },
      });
    }

    for (const a of seed.articles || []) {
      await tx.article.upsert({
        where: { id: a.id },
        update: {},
        create: {
          id: a.id,
          slug: a.slug,
          title: a.title,
          category: a.category,
          excerpt: a.excerpt,
          content: a.content,
          coverImage: a.coverImage,
          author: a.author,
          publishedAt: a.publishedAt,
          readTime: a.readTime,
        },
      });
    }

    const validPropIds = new Set((seed.properties || []).map((p) => p.id));

    for (const i of seed.inquiries || []) {
      await tx.inquiry.upsert({
        where: { id: i.id },
        update: {},
        create: {
          id: i.id,
          type: i.type,
          propertyId:
            i.propertyId && validPropIds.has(i.propertyId)
              ? i.propertyId
              : null,
          propertyTitle: i.propertyTitle || null,
          propertyRef: i.propertyRef || null,
          fullName: i.fullName,
          phone: i.phone,
          email: i.email,
          preferredDate: i.preferredDate || null,
          message: i.message,
          status: i.status,
          createdAt: i.createdAt,
        },
      });
    }

    for (const u of seed.users || []) {
      await tx.adminUser.upsert({
        where: { id: u.id },
        update: {},
        create: {
          id: u.id,
          username: u.username,
          fullName: u.fullName,
          role: u.role,
          isSuperuser: Boolean(u.isSuperuser),
          permissionsJson: JSON.stringify(u.permissions || []),
          passwordHash: u.passwordHash,
          createdAt: u.createdAt,
        },
      });
    }
  });

  globalForSeed.__immoSeedDone = true;
}

async function ensureSeeded(): Promise<void> {
  if (globalForSeed.__immoSeedDone) return;
  if (!globalForSeed.__immoSeedPromise) {
    globalForSeed.__immoSeedPromise = runSeedIfEmpty().finally(() => {
      globalForSeed.__immoSeedPromise = undefined;
    });
  }
  await globalForSeed.__immoSeedPromise;
}

// --- MAPPERS ---

function mapSettings(row: {
  name: string;
  slogan: string;
  logoUrl: string;
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
  statsJson: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  darkColor?: string;
}): AgencySettings {
  return {
    name: row.name,
    slogan: row.slogan,
    logoUrl: row.logoUrl,
    currency: row.currency,
    phonePrimary: row.phonePrimary,
    phoneSecondary: row.phoneSecondary,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    city: row.city,
    country: row.country,
    openingHours: row.openingHours,
    aboutIntro: row.aboutIntro,
    aboutStory: row.aboutStory,
    stats: JSON.parse(row.statsJson) as AgencySettings["stats"],
    primaryColor: row.primaryColor || "#0f766e",
    secondaryColor: row.secondaryColor || "#ea580c",
    accentColor: row.accentColor || "#f59e0b",
    darkColor: row.darkColor || "#042f2e",
  };
}

function mapProperty(row: {
  id: string;
  slug: string;
  reference: string;
  title: string;
  transactionType: string;
  category: string;
  status: string;
  price: number;
  pricePeriod: string | null;
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  surface: number;
  landSurface: number | null;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  featuresJson: string;
  imagesJson: string;
  featured: boolean;
  agentId: string | null;
  createdAt: string;
}): Property {
  return {
    id: row.id,
    slug: row.slug,
    reference: row.reference,
    title: row.title,
    transactionType: row.transactionType as TransactionType,
    category: row.category as PropertyCategory,
    status: row.status as PropertyStatus,
    price: row.price,
    pricePeriod: row.pricePeriod ?? undefined,
    city: row.city,
    district: row.district,
    address: row.address,
    coordinates: {
      lat: row.lat,
      lng: row.lng,
    },
    surface: row.surface,
    landSurface: row.landSurface ?? undefined,
    rooms: row.rooms,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    description: row.description,
    features: JSON.parse(row.featuresJson) as string[],
    images: JSON.parse(row.imagesJson) as string[],
    featured: row.featured,
    agentId: row.agentId ?? undefined,
    createdAt: row.createdAt,
  };
}

function mapTeamMember(row: {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  phone: string;
  email: string;
  whatsapp: string | null;
  photo: string;
  experienceYears: number;
}): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    specialty: row.specialty,
    bio: row.bio,
    phone: row.phone,
    email: row.email,
    whatsapp: row.whatsapp ?? undefined,
    photo: row.photo,
    experienceYears: row.experienceYears,
  };
}

function mapArticle(row: {
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
}): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage,
    author: row.author,
    publishedAt: row.publishedAt,
    readTime: row.readTime,
  };
}

function mapInquiry(row: {
  id: string;
  type: string;
  propertyId: string | null;
  propertyTitle: string | null;
  propertyRef: string | null;
  fullName: string;
  phone: string;
  email: string;
  preferredDate: string | null;
  message: string;
  status: string;
  createdAt: string;
}): Inquiry {
  return {
    id: row.id,
    type: row.type as Inquiry["type"],
    propertyId: row.propertyId ?? undefined,
    propertyTitle: row.propertyTitle ?? undefined,
    propertyRef: row.propertyRef ?? undefined,
    fullName: row.fullName,
    phone: row.phone,
    email: row.email,
    preferredDate: row.preferredDate ?? undefined,
    message: row.message,
    status: row.status as Inquiry["status"],
    createdAt: row.createdAt,
  };
}

function mapAdminUser(row: {
  id: string;
  username: string;
  fullName: string;
  role: string;
  isSuperuser: boolean;
  permissionsJson: string;
  passwordHash: string;
  createdAt: string;
}): AdminUser {
  return {
    id: row.id,
    username: row.username,
    fullName: row.fullName,
    role: row.role as AdminUser["role"],
    isSuperuser: row.isSuperuser,
    permissions: JSON.parse(row.permissionsJson) as AdminPermission[],
    passwordHash: row.passwordHash,
    createdAt: row.createdAt,
  };
}

// --- DATA ACCESSORS ---

export async function getSettings(): Promise<AgencySettings> {
  await ensureSeeded();
  const row = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!row) {
    throw new Error("Settings row missing in Prisma SQLite database.");
  }
  return mapSettings(row);
}

export async function updateSettings(
  partial: Partial<AgencySettings>
): Promise<AgencySettings> {
  const current = await getSettings();
  const next: AgencySettings = {
    ...current,
    ...partial,
    stats: {
      ...current.stats,
      ...(partial.stats || {}),
    },
  };

  const updated = await prisma.settings.update({
    where: { id: 1 },
    data: {
      name: next.name,
      slogan: next.slogan,
      logoUrl: next.logoUrl,
      currency: next.currency,
      phonePrimary: next.phonePrimary,
      phoneSecondary: next.phoneSecondary,
      whatsapp: next.whatsapp,
      email: next.email,
      address: next.address,
      city: next.city,
      country: next.country,
      openingHours: next.openingHours,
      aboutIntro: next.aboutIntro,
      aboutStory: next.aboutStory,
      statsJson: JSON.stringify(next.stats),
      primaryColor: next.primaryColor || "#0f766e",
      secondaryColor: next.secondaryColor || "#ea580c",
      accentColor: next.accentColor || "#f59e0b",
      darkColor: next.darkColor || "#042f2e",
    },
  });

  return mapSettings(updated);
}

export async function getProperties(): Promise<Property[]> {
  await ensureSeeded();
  const rows = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProperty);
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | undefined> {
  await ensureSeeded();
  const row = await prisma.property.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
  });
  return row ? mapProperty(row) : undefined;
}

export async function getNextPropertyReference(city: string): Promise<string> {
  await ensureSeeded();
  const rows = await prisma.property.findMany({
    select: { reference: true },
  });
  return buildNextPropertyReference(
    city,
    rows.map((r) => r.reference)
  );
}

export async function saveProperty(property: Property): Promise<Property> {
  await ensureSeeded();
  const normalizedRef = property.reference.trim();
  const existingRefs = await prisma.property.findMany({
    where: { NOT: { id: property.id } },
    select: { reference: true },
  });
  if (
    existingRefs.some(
      (r) => r.reference.trim().toLowerCase() === normalizedRef.toLowerCase()
    )
  ) {
    throw new DuplicateReferenceError(normalizedRef);
  }

  let agentId: string | null = null;
  if (property.agentId) {
    const agent = await prisma.teamMember.findUnique({
      where: { id: property.agentId },
      select: { id: true },
    });
    agentId = agent ? agent.id : null;
  }

  const saved = await prisma.property.upsert({
    where: { id: property.id },
    update: {
      slug: property.slug,
      reference: normalizedRef,
      title: property.title,
      transactionType: property.transactionType,
      category: property.category,
      status: property.status,
      price: property.price,
      pricePeriod: property.pricePeriod ?? null,
      city: property.city,
      district: property.district,
      address: property.address,
      lat: property.coordinates?.lat ?? -4.2634,
      lng: property.coordinates?.lng ?? 15.2832,
      surface: property.surface,
      landSurface: property.landSurface ?? null,
      rooms: property.rooms,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      description: property.description,
      featuresJson: JSON.stringify(property.features || []),
      imagesJson: JSON.stringify(property.images || []),
      featured: property.featured,
      agentId,
    },
    create: {
      id: property.id,
      slug: property.slug,
      reference: normalizedRef,
      title: property.title,
      transactionType: property.transactionType,
      category: property.category,
      status: property.status,
      price: property.price,
      pricePeriod: property.pricePeriod ?? null,
      city: property.city,
      district: property.district,
      address: property.address,
      lat: property.coordinates?.lat ?? -4.2634,
      lng: property.coordinates?.lng ?? 15.2832,
      surface: property.surface,
      landSurface: property.landSurface ?? null,
      rooms: property.rooms,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      description: property.description,
      featuresJson: JSON.stringify(property.features || []),
      imagesJson: JSON.stringify(property.images || []),
      featured: property.featured,
      agentId,
      createdAt: property.createdAt,
    },
  });

  return mapProperty(saved);
}

export async function deleteProperty(id: string): Promise<boolean> {
  await ensureSeeded();
  try {
    const existing = await prisma.property.findUnique({
      where: { id },
    });
    if (!existing) return false;

    // Récupérer la liste des images de ce bien
    let propertyImages: string[] = [];
    try {
      propertyImages = JSON.parse(existing.imagesJson || "[]");
    } catch {
      propertyImages = [];
    }

    // Récupérer les images encore utilisées par d'autres biens
    const otherProps = await prisma.property.findMany({
      where: { id: { not: id } },
      select: { imagesJson: true },
    });
    const usedImages = new Set<string>();
    for (const op of otherProps) {
      try {
        const arr = JSON.parse(op.imagesJson || "[]");
        if (Array.isArray(arr)) {
          arr.forEach((img) => {
            if (typeof img === "string") usedImages.add(img.trim());
          });
        }
      } catch {}
    }

    // Récupérer les images utilisées par l'équipe, les articles et l'identité
    const [teamMembers, articles, settings] = await Promise.all([
      prisma.teamMember.findMany({ select: { photo: true } }),
      prisma.article.findMany({ select: { coverImage: true } }),
      prisma.settings.findFirst({ select: { logoUrl: true } }),
    ]);
    teamMembers.forEach((t) => t.photo && usedImages.add(t.photo.trim()));
    articles.forEach((a) => a.coverImage && usedImages.add(a.coverImage.trim()));
    if (settings?.logoUrl) usedImages.add(settings.logoUrl.trim());

    // Supprimer les fichiers physiques situés dans public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    for (const rawUrl of propertyImages) {
      if (typeof rawUrl === "string" && rawUrl.includes("/uploads/")) {
        const cleanUrl = rawUrl.split("?")[0].split("#")[0].trim();
        const fileName = path.basename(cleanUrl);

        // Protection : ne jamais supprimer un fichier vide ou .gitkeep
        if (!fileName || fileName === ".gitkeep") continue;

        // Vérifier si cette image exacte est encore utilisée ailleurs
        const isStillInUse = Array.from(usedImages).some((u) => {
          if (!u) return false;
          const uClean = u.split("?")[0].split("#")[0].trim();
          return path.basename(uClean) === fileName;
        });

        if (!isStillInUse) {
          const filePath = path.join(uploadDir, fileName);
          try {
            if (fs.existsSync(filePath)) {
              await fs.promises.unlink(filePath);
            }
          } catch (fileErr) {
            console.error(
              `Impossible de supprimer le fichier upload ${filePath}:`,
              fileErr
            );
          }
        }
      }
    }

    // Supprimer le bien de la base de données
    await prisma.property.delete({ where: { id } });
    return true;
  } catch (err) {
    console.error("Erreur deleteProperty:", err);
    return false;
  }
}

export async function getTeam(): Promise<TeamMember[]> {
  await ensureSeeded();
  const rows = await prisma.teamMember.findMany();
  return rows.map(mapTeamMember);
}

export async function saveTeamMember(
  member: TeamMember
): Promise<TeamMember> {
  await ensureSeeded();
  const saved = await prisma.teamMember.upsert({
    where: { id: member.id },
    update: {
      name: member.name,
      role: member.role,
      specialty: member.specialty,
      bio: member.bio,
      phone: member.phone,
      email: member.email,
      whatsapp: member.whatsapp ?? null,
      photo: member.photo,
      experienceYears: member.experienceYears || 0,
    },
    create: {
      id: member.id,
      name: member.name,
      role: member.role,
      specialty: member.specialty,
      bio: member.bio,
      phone: member.phone,
      email: member.email,
      whatsapp: member.whatsapp ?? null,
      photo: member.photo,
      experienceYears: member.experienceYears || 0,
    },
  });
  return mapTeamMember(saved);
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  await ensureSeeded();
  try {
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (existing && existing.photo && existing.photo.includes("/uploads/")) {
      const fileName = path.basename(
        existing.photo.split("?")[0].split("#")[0].trim()
      );
      if (fileName && fileName !== ".gitkeep") {
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);
        try {
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
          }
        } catch {}
      }
    }
    await prisma.teamMember.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getArticles(): Promise<Article[]> {
  await ensureSeeded();
  const rows = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapArticle);
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | undefined> {
  await ensureSeeded();
  const row = await prisma.article.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
  });
  return row ? mapArticle(row) : undefined;
}

export async function saveArticle(article: Article): Promise<Article> {
  await ensureSeeded();
  const saved = await prisma.article.upsert({
    where: { id: article.id },
    update: {
      slug: article.slug,
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      coverImage: article.coverImage,
      author: article.author,
      publishedAt: article.publishedAt,
      readTime: article.readTime,
    },
    create: {
      id: article.id,
      slug: article.slug,
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      coverImage: article.coverImage,
      author: article.author,
      publishedAt: article.publishedAt,
      readTime: article.readTime,
    },
  });
  return mapArticle(saved);
}

export async function deleteArticle(id: string): Promise<boolean> {
  await ensureSeeded();
  try {
    const existing = await prisma.article.findUnique({ where: { id } });
    if (
      existing &&
      existing.coverImage &&
      existing.coverImage.includes("/uploads/")
    ) {
      const fileName = path.basename(
        existing.coverImage.split("?")[0].split("#")[0].trim()
      );
      if (fileName && fileName !== ".gitkeep") {
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);
        try {
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
          }
        } catch {}
      }
    }
    await prisma.article.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  await ensureSeeded();
  const rows = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapInquiry);
}

export async function addInquiry(inquiry: Inquiry): Promise<Inquiry> {
  await ensureSeeded();
  let propertyId: string | null = null;
  if (inquiry.propertyId) {
    const prop = await prisma.property.findUnique({
      where: { id: inquiry.propertyId },
      select: { id: true },
    });
    propertyId = prop ? prop.id : null;
  }

  const created = await prisma.inquiry.create({
    data: {
      id: inquiry.id,
      type: inquiry.type,
      propertyId,
      propertyTitle: inquiry.propertyTitle ?? null,
      propertyRef: inquiry.propertyRef ?? null,
      fullName: inquiry.fullName,
      phone: inquiry.phone,
      email: inquiry.email,
      preferredDate: inquiry.preferredDate ?? null,
      message: inquiry.message,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
    },
  });
  return mapInquiry(created);
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry["status"]
): Promise<Inquiry | undefined> {
  await ensureSeeded();
  try {
    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });
    return mapInquiry(updated);
  } catch {
    return undefined;
  }
}

export async function deleteInquiry(id: string): Promise<boolean> {
  await ensureSeeded();
  try {
    await prisma.inquiry.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getUsers(): Promise<AdminUser[]> {
  await ensureSeeded();
  const rows = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
  });
  return rows.map(mapAdminUser);
}

export async function saveUser(user: AdminUser): Promise<AdminUser> {
  await ensureSeeded();
  const saved = await prisma.adminUser.upsert({
    where: { id: user.id },
    update: {
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isSuperuser: user.isSuperuser,
      permissionsJson: JSON.stringify(user.permissions || []),
      passwordHash: user.passwordHash,
    },
    create: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isSuperuser: user.isSuperuser,
      permissionsJson: JSON.stringify(user.permissions || []),
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    },
  });
  return mapAdminUser(saved);
}

export async function deleteUser(id: string): Promise<boolean> {
  await ensureSeeded();
  const target = await prisma.adminUser.findUnique({
    where: { id },
    select: { username: true },
  });
  if (
    !target ||
    target.username.toLowerCase() === "ethernanos" ||
    target.username.toLowerCase() === "administrateur"
  ) {
    return false;
  }
  try {
    await prisma.adminUser.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
