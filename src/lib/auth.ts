import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUsers } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { AdminPermission, AdminUser, SafeAdminUser } from "@/types/immo";

export const ADMIN_SESSION_COOKIE = "immovitrine_admin_session";
export const SESSION_DURATION_SECONDS = 60 * 60; // 1 heure (3600 secondes)

const AUTH_SECRET =
  process.env.AUTH_SECRET || "immovitrine-congo-ethernanos-zircon-secret-2026";

export const ALL_PERMISSIONS: AdminPermission[] = [
  "properties:write",
  "properties:delete",
  "inquiries:read",
  "inquiries:write",
  "inquiries:delete",
  "articles:write",
  "articles:delete",
  "team:write",
  "team:delete",
  "settings:write",
  "users:manage",
];

const BUILTIN_SUPERUSER: SafeAdminUser = {
  id: "user-superuser-ethernanos",
  username: "ethernanos",
  fullName: "ethernanos-SC@Zircon (Superuser)",
  role: "SUPERUSER",
  isSuperuser: true,
  permissions: ALL_PERMISSIONS,
  createdAt: "2026-01-01T00:00:00Z",
};

const SUPERUSER_USERNAME = "ethernanos";
const SUPERUSER_PASSWORD = process.env.SUPERUSER_PASSWORD || "admin@1234";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, keyHex] = storedHash.split(":");
  if (!salt || !keyHex) return false;
  const keyBuffer = Buffer.from(keyHex, "hex");
  const derivedBuffer = crypto.scryptSync(password, salt, 64);
  if (keyBuffer.length !== derivedBuffer.length) return false;
  return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
}

export function sanitizeUser(user: AdminUser): SafeAdminUser {
  const { passwordHash: _passwordHash, ...safe } = user;
  void _passwordHash;
  return safe;
}

export function hasPermission(
  user: SafeAdminUser | null | undefined,
  permission: AdminPermission
): boolean {
  if (!user) return false;
  // Le superuser ethernanos contourne toutes les vérifications de permissions
  if (
    user.isSuperuser ||
    user.role === "SUPERUSER" ||
    user.username.toLowerCase() === SUPERUSER_USERNAME
  ) {
    return true;
  }
  return user.permissions.includes(permission);
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<SafeAdminUser | null> {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || !password) return null;

  // Vérification prioritaire du Superuser ethernanos
  if (cleanUsername === SUPERUSER_USERNAME) {
    const expectedBuf = Buffer.from(SUPERUSER_PASSWORD, "utf-8");
    const actualBuf = Buffer.from(password, "utf-8");
    if (
      expectedBuf.length === actualBuf.length &&
      crypto.timingSafeEqual(expectedBuf, actualBuf)
    ) {
      return BUILTIN_SUPERUSER;
    }
    return null;
  }

  // Recherche parmi les autres comptes enregistrés en base Prisma/SQLite
  const users = await getUsers();
  const found = users.find(
    (u) => u.username.toLowerCase() === cleanUsername
  );
  if (!found) return null;
  if (!verifyPassword(password, found.passwordHash)) return null;

  return sanitizeUser(found);
}

interface SessionPayload {
  sessionId: string;
  userId: string;
  username: string;
  exp: number;
}

function signPayload(encodedPayload: string): string {
  return crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(encodedPayload)
    .digest("base64url");
}

export function createSessionToken(
  user: SafeAdminUser,
  sessionId: string
): string {
  const payload: SessionPayload = {
    sessionId,
    userId: user.id,
    username: user.username,
    exp: Date.now() + SESSION_DURATION_SECONDS * 1000, // 1 heure
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf-8").toString(
    "base64url"
  );
  const sig = signPayload(encoded);
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expectedSig = signPayload(encoded);
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (
      sigBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return null;
    }
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf-8")
    ) as SessionPayload;
    if (
      !payload.sessionId ||
      !payload.username ||
      !payload.exp ||
      Date.now() > payload.exp
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Enregistre une nouvelle session active pour l'utilisateur dans la base de données.
 * En raison de la contrainte unique sur `username` dans `admin_sessions`,
 * toute session précédente (sur un autre poste ou navigateur) est automatiquement
 * révoquée. La session expire après 1 heure.
 */
export async function registerActiveSession(
  user: SafeAdminUser
): Promise<{ token: string; maxAge: number }> {
  const cleanUsername = user.username.trim().toLowerCase();
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  // Nettoyage proactif des sessions expirées
  try {
    await prisma.adminSession.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  } catch {
    // Tolérance d'erreur sur le nettoyage d'anciennes sessions
  }

  // Écrase toute session existante pour cet utilisateur (politique 1 seul poste connecté à la fois)
  await prisma.adminSession.upsert({
    where: { username: cleanUsername },
    update: {
      id: sessionId,
      expiresAt,
    },
    create: {
      id: sessionId,
      username: cleanUsername,
      expiresAt,
    },
  });

  const token = createSessionToken(user, sessionId);
  return { token, maxAge: SESSION_DURATION_SECONDS };
}

/**
 * Révoque la session active en base de données lors de la déconnexion
 */
export async function revokeActiveSession(token?: string): Promise<void> {
  if (!token) return;
  const payload = verifySessionToken(token);
  if (!payload) return;
  try {
    await prisma.adminSession.deleteMany({
      where: {
        OR: [
          { id: payload.sessionId },
          { username: payload.username.trim().toLowerCase() },
        ],
      },
    });
  } catch {
    // Tolérance d'erreur
  }
}

export async function getUserByUsername(
  username: string
): Promise<SafeAdminUser | null> {
  if (username.toLowerCase() === SUPERUSER_USERNAME) {
    return BUILTIN_SUPERUSER;
  }
  const users = await getUsers();
  const found = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  return found ? sanitizeUser(found) : null;
}

export async function getCurrentAdminUser(): Promise<SafeAdminUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;

  // Vérification de la session unique en base de données SQLite
  try {
    const active = await prisma.adminSession.findUnique({
      where: { username: payload.username.trim().toLowerCase() },
    });
    // Si la session n'existe pas, a expiré (> 1h) ou si un autre poste s'est connecté
    // (le sessionId en base a changé), la session courante est invalidée immédiatement.
    if (!active || active.id !== payload.sessionId) {
      return null;
    }
    if (new Date(active.expiresAt).getTime() < Date.now()) {
      return null;
    }
  } catch {
    return null;
  }

  return await getUserByUsername(payload.username);
}

export async function requireAdminAuth(permission?: AdminPermission): Promise<{
  user: SafeAdminUser | null;
  errorResponse: NextResponse | null;
}> {
  const user = await getCurrentAdminUser();
  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      ),
    };
  }
  if (permission && !hasPermission(user, permission)) {
    return {
      user,
      errorResponse: NextResponse.json(
        { error: "Permission insuffisante" },
        { status: 403 }
      ),
    };
  }
  return { user, errorResponse: null };
}

