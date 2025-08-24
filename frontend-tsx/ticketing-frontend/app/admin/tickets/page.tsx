"use client";
import RoleGuard from "@/components/RoleGuard";
import AdminTickets from "@/components/admin/AdminTickets";

export default function AdminTicketsPage() {
  return (
    <RoleGuard roles={["ROLE_ADMIN"]}>
      <AdminTickets />
    </RoleGuard>
  );
}