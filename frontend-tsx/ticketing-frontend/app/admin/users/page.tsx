"use client";
import RoleGuard from "@/components/RoleGuard";
import AdminUsers from "@/components/admin/AdminUsers";

export default function AdminUsersPage() {
  return (
    <RoleGuard roles={["ROLE_ADMIN"]}>
      <AdminUsers />
    </RoleGuard>
  );
}