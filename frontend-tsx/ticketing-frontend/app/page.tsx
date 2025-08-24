"use client";
import { useAuth } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { token } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (token) router.replace("/dashboard");
  }, [token, router]);

  return (
    <div className="container grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Ticketing System</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          Raise, track and resolve your IT issues with role-based controls.
        </p>
        <div className="flex gap-3">
          <Link className="btn" href="/auth/login">Login</Link>
          <Link className="btn" href="/auth/register">Register</Link>
        </div>
      </div>
      <div className="card">
        <ul className="grid gap-2 text-sm">
          <li>🎟️ Create & comment on tickets</li>
          <li>👩‍💻 Agent workflow: status updates</li>
          <li>🛡️ Admin: users & ticket oversight</li>
          <li>📎 Attachments, 🔎 filters, ⭐ ratings</li>
        </ul>
      </div>
    </div>
  );
}
