import React from "react";
import {
  getProperties,
  getArticles,
  getTeam,
  getInquiries,
  getSettings,
  getUsers,
} from "@/lib/db";
import { getCurrentAdminUser, hasPermission, sanitizeUser } from "@/lib/auth";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import AdminLoginForm from "@/components/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const settings = await getSettings();
  const currentUser = await getCurrentAdminUser();

  if (!currentUser) {
    return (
      <AdminLoginForm agencyName={settings.name} logoUrl={settings.logoUrl} />
    );
  }

  const [properties, articles, team, inquiries, adminUsersRaw] =
    await Promise.all([
      getProperties(),
      getArticles(),
      getTeam(),
      hasPermission(currentUser, "inquiries:read")
        ? getInquiries()
        : Promise.resolve([]),
      hasPermission(currentUser, "users:manage")
        ? getUsers()
        : Promise.resolve([]),
    ]);
  const adminUsers = adminUsersRaw
    .filter(
      (u) =>
        !u.isSuperuser &&
        u.role !== "SUPERUSER" &&
        u.username.toLowerCase() !== "ethernanos"
    )
    .map(sanitizeUser);

  return (
    <div className="bg-slate-100/80 min-h-screen pb-20">
      <AdminDashboardClient
        currentUser={currentUser}
        initialProperties={properties}
        initialArticles={articles}
        initialTeam={team}
        initialInquiries={inquiries}
        initialSettings={settings}
        initialAdminUsers={adminUsers}
      />
    </div>
  );
}
