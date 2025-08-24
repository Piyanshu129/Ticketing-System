"use client";
import { useAuth } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!token) router.replace("/auth/login");
  }, [token, router]);
  if (!token) return null;
  return <>{children}</>;
}
