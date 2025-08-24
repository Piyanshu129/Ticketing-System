"use client";
import AuthGuard from "@/components/AuthGuard";
import TicketDetail from "@/components/TicketDetail";

export default function TicketPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <TicketDetail id={params.id} />
    </AuthGuard>
  );
}