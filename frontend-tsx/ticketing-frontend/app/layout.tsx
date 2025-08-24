// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "@/components/Providers"; // 👈 new wrapper

export const metadata: Metadata = {
  title: "Ticketing System",
  description: "IT support ticketing frontend",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
