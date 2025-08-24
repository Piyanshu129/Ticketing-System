"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/lib/authStore";
import { toast } from "sonner";

export default function TicketDetail({ id }: { id: string }) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => (await api.get(`/api/tickets/${id}`)).data,
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      // POST to the correct endpoint with body { content: "..." }
      return (await api.post(`http://localhost:8080/api/tickets/${id}/comments`, { content })).data;
    },
    onSuccess: () => {
      toast.success("Comment added");
      qc.invalidateQueries({ queryKey: ["ticket", id] });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add comment");
    },
  });
  

  const updateStatus = useMutation({
    mutationFn: async (status: string) => (await api.put(`/api/tickets/${id}/status`, { status })).data,
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["ticket", id] }); },
  });

  const uploadAttachment = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return (await api.post(`/api/tickets/${id}/attachments`, form, { headers: { "Content-Type": "multipart/form-data" } })).data;
    },
    onSuccess: () => { toast.success("Attachment uploaded"); qc.invalidateQueries({ queryKey: ["ticket", id] }); },
  });

  const rate = useMutation({
    mutationFn: async (stars: number) => (await api.post(`/api/tickets/${id}/rate`, { stars })).data,
    onSuccess: () => { toast.success("Thanks for rating"); qc.invalidateQueries({ queryKey: ["ticket", id] }); },
  });

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>Not found</p>;

  const canAgent = user?.role === "ROLE_SUPPORT_AGENT" || user?.role === "ROLE_ADMIN";
  const isOwner = user?.id === data.owner?.id;

  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{data.title}</h1>
            <p className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{data.description}</p>
          </div>
          <div className="text-right">
            <div className="badge">{data.status}</div>
            <div className="text-xs mt-1">Priority: {data.priority}</div>
          </div>
        </div>
        <div className="mt-3 text-sm text-neutral-500">Owner: {data.owner?.name} • Assignee: {data.assignee?.name || "—"}</div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">Comments</h2>
        <div className="grid gap-3">
          {data.comments?.map((c: any) => (
            <div key={c.id} className="rounded-xl2 border border-neutral-200 dark:border-neutral-800 p-3">
              <div className="text-sm text-neutral-500 mb-1">{c.author?.name} • {new Date(c.createdAt).toLocaleString()}</div>
              <div className="whitespace-pre-wrap">{c.content}</div>
            </div>
          ))}
        </div>
        <form
  className="mt-3 flex gap-2"
  onSubmit={(e) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("c") as HTMLInputElement;
    if (input.value) {
      addComment.mutate(input.value); // body: { content: input.value }
      input.value = "";
    }
  }}
>
  <input name="c" className="input" placeholder="Write a comment..." />
  <button className="btn" type="submit" disabled={addComment.isPending}>
    Comment
  </button>
</form>

      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold mb-2">Attachments</h2>
          <ul className="list-disc ml-5 text-sm">
            {data.attachments?.map((a: any) => (
              <li key={a.fileName}><a className="link" href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/attachments/${a.fileName}`} target="_blank" rel="noreferrer">{a.originalName}</a></li>
            ))}
          </ul>
          <form className="mt-3 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); const f = (e.currentTarget.elements.namedItem("file") as HTMLInputElement); if (f.files?.[0]) uploadAttachment.mutate(f.files[0]); }}>
            <input className="input" name="file" type="file" />
            <button className="btn" disabled={uploadAttachment.isPending}>Upload</button>
          </form>
        </div>

        <div className="card space-y-3">
          <h2 className="font-semibold">Actions</h2>
          {canAgent && (
            <div className="flex gap-2 flex-wrap">
              {(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const).map(s => (
                <button key={s} className="btn" onClick={() => updateStatus.mutate(s)} disabled={updateStatus.isPending}>{s}</button>
              ))}
            </div>
          )}
          {isOwner && data.status === "RESOLVED" && (
            <div>
              <label className="label">Rate resolution</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star} className="btn" onClick={() => rate.mutate(star)} disabled={rate.isPending}>{star}★</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
