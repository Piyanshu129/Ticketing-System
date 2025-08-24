"use client";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/authStore";
import { useRouter } from "next/navigation";

export default function RoleGuard({ roles, children }: { roles: string[]; children: ReactNode }) {
  const { token, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!token) router.replace("/auth/login");
    if (user && !roles.includes(user.role)) router.replace("/dashboard");
  }, [token, user, roles, router]);
  if (!token || !user || !roles.includes(user.role)) return null;
  return <>{children}</>;
}