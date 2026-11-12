/**
 * Script CLI pour créer un compte administrateur ou éditeur directement dans la base de données SQLite via Prisma.
 *
 * Utilisation :
 *   npx tsx scripts/create-user.ts <identifiant> <mot_de_passe> <nom_complet> [role: ADMIN|EDITOR]
 *
 * Exemple :
 *   npx tsx scripts/create-user.ts agent.bzv Pass1234 "Agent Brazzaville" EDITOR
 */
import { prisma } from "../src/lib/prisma";
import { hashPassword, ALL_PERMISSIONS } from "../src/lib/auth";
import { AdminPermission } from "../src/types/immo";

async function main() {
  const args = process.argv.slice(2);
  const username = args[0]?.trim();
  const password = args[1]?.trim();
  const fullName = args[2]?.trim() || username;
  const roleInput = (args[3]?.trim() || "EDITOR").toUpperCase();
  const role = roleInput === "ADMIN" ? "ADMIN" : "EDITOR";

  if (!username || !password) {
    console.error("❌ Usage : npx tsx scripts/create-user.ts <identifiant> <mot_de_passe> <nom_complet> [ADMIN|EDITOR]");
    process.exit(1);
  }

  if (username.toLowerCase() === "ethernanos") {
    console.error("❌ Cet identifiant est réservé pour le superadmin développeur.");
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (existing) {
    console.error(`❌ L'utilisateur "${username}" existe déjà dans la base de données.`);
    process.exit(1);
  }

  const permissions: AdminPermission[] =
    role === "ADMIN"
      ? ALL_PERMISSIONS
      : ["properties:write", "articles:write", "inquiries:read", "inquiries:write"];

  const created = await prisma.adminUser.create({
    data: {
      id: `user-${Date.now()}`,
      username,
      fullName,
      role,
      isSuperuser: false,
      permissionsJson: JSON.stringify(permissions),
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    },
  });

  console.log(`✅ Utilisateur "${created.username}" (${created.role}) créé avec succès en base de données SQLite !`);
  console.log(`   ID : ${created.id}`);
  console.log(`   Permissions : ${permissions.join(", ")}`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

