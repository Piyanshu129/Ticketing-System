"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function TicketFilters({ scope }: { scope: "my" | "all" }) {
  const params = useSearchParams();
  const router = useRouter();

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.replace(`${scope === "all" ? "/admin/tickets" : "/dashboard"}?${p.toString()}`);
  };

  return (
    <div className="card mb-4 grid md:grid-cols-4 gap-3">
      <div>
        <label className="label">Status</label>
        <select className="select" defaultValue={params.get("status") || ""} onChange={(e) => setParam("status", e.target.value)}>
          <option value="">All</option>
          <option>OPEN</option>
          <option>IN_PROGRESS</option>
          <option>RESOLVED</option>
          <option>CLOSED</option>
        </select>
      </div>
      <div>
        <label className="label">Priority</label>
        <select className="select" defaultValue={params.get("priority") || ""} onChange={(e) => setParam("priority", e.target.value)}>
          <option value="">All</option>
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
          <option>URGENT</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="label">Search</label>
        <input className="input" placeholder="subject / description / user" defaultValue={params.get("search") || ""} onBlur={(e) => setParam("search", e.target.value)} />
      </div>
    </div>
  );
}