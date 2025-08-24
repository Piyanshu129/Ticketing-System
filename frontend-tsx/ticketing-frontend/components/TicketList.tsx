"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function TicketList({ scope }: { scope: "my" | "all" }) {
  const params = useSearchParams();
  const qs = params.toString();

  const { data, isLoading } = useQuery({
    queryKey: ["tickets", scope, qs],
    queryFn: async () => {
      const base = scope === "my" ? "/api/tickets/my-tickets" : "/api/admin/tickets";
      const res = await api.get(`${base}${qs ? `?${qs}` : ""}`);
      return res.data as any[];
    },
  });

  if (isLoading) return <p>Loading tickets...</p>;
  if (!data || data.length === 0) return <p>No tickets found.</p>;

  return (
    <div className="grid gap-3">
      {data.map((t: any) => (
        <Link key={t.id} href={`/tickets/${t.id}`} className="card hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm text-neutral-500 line-clamp-1">{t.description}</p>
            </div>
            <div className="text-right space-y-1">
              <span className="badge">{t.status}</span>
              <div className="text-xs">Priority: {t.priority}</div>
            </div>
          </div>
          {/* Comments Section */}
          {/* <div className="mt-2">
            <h4 className="font-medium text-sm">Comments:</h4>
            {t.content && t.content.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-neutral-600">
                {t.content.map((c: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-semibold">{c.authorName || "Unknown"}: </span>
                    {c.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-400">No comments yet.</p>
            )}
          </div> */}
        </Link>
      ))}
    </div>
  );
}