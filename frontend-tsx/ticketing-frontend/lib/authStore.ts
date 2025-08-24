"use client";
import { create } from "zustand";

export type User = { id: number; name: string; email: string; role: "ROLE_USER" | "ROLE_SUPPORT_AGENT" | "ROLE_ADMIN" } | null;

type State = {
  token: string | null;
  user: User;
  setToken: (t: string | null) => void;
  setUser: (u: User) => void;
  logout: () => void;
};

export const useAuth = create<State>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: typeof window !== "undefined" && localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
  setToken: (t) => { set({ token: t }); if (typeof window !== "undefined") { if (t) localStorage.setItem("token", t); else localStorage.removeItem("token"); } },
  setUser: (u) => { set({ user: u }); if (typeof window !== "undefined") { if (u) localStorage.setItem("user", JSON.stringify(u)); else localStorage.removeItem("user"); } },
  logout: () => { set({ token: null, user: null }); if (typeof window !== "undefined") { localStorage.removeItem("token"); localStorage.removeItem("user"); } },
}));
