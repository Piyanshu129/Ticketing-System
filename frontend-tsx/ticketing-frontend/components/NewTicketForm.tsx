"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

type FormValues = z.infer<typeof schema>;

export default function NewTicketForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const submit = async (data: FormValues) => {
    try {
      await api.post("/api/tickets", data);
      toast.success("Ticket created");
      qc.invalidateQueries({ queryKey: ["tickets", "my"] });
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to create ticket");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">New Ticket</h2>
          <button onClick={onClose} className="link">Close</button>
        </div>
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <div>
            <label className="label">Title</label>
            <input className="input" {...register("title")} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[120px]" {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="select" {...register("priority")}>
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
              <option>URGENT</option>
            </select>
          </div>
          <button className="btn w-full" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Ticket"}</button>
        </form>
      </div>
    </div>
  );
}
