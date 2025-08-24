// "use client";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/lib/api";
// import { toast } from "sonner";
// import TicketFilters from "@/components/TicketFilters";

// export default function AdminTickets() {
//   const qc = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ["admin-tickets"],
//     queryFn: async () => (await api.get("/api/admin/tickets")).data,
//   });

//   const { data: agents } = useQuery({
//     queryKey: ["support-agents"],
//     queryFn: async () => (await api.get("/api/admin/agents")).data,
//   });

//   const updateStatus = useMutation({
//     mutationFn: async ({ id, status }: { id: number; status: string }) =>
//       (await api.put(`/api/admin/tickets/${id}/status`, { status })).data,
//     onSuccess: () => {
//       toast.success("Status updated");
//       qc.invalidateQueries({ queryKey: ["admin-tickets"] });
//     },
//   });

//   const reassign = useMutation({
//     mutationFn: async ({ id, assigneeId }: { id: number; assigneeId: number }) =>
//       (await api.put(`/api/admin/tickets/${id}/assign`, { assigneeId })).data,
//     onSuccess: () => {
//       toast.success("Ticket reassigned");
//       qc.invalidateQueries({ queryKey: ["admin-tickets"] });
//     },
//   });

//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <div className="grid gap-4">
//       <h1 className="text-2xl font-semibold">All Tickets</h1>
//       <TicketFilters scope="all" />
//       <table className="w-full text-sm">
//         <thead>
//           <tr className="border-b border-neutral-200 dark:border-neutral-800">
//             <th className="py-2">ID</th>
//             <th>Title</th>
//             <th>Status</th>
//             <th>Owner</th>
//             <th>Assignee</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.map((t: any) => (
//             <tr key={t.id} className="border-b border-neutral-200 dark:border-neutral-800">
//               <td className="py-2">{t.id}</td>
//               <td>{t.title}</td>
//               <td>{t.status}</td>
//               <td>{t.owner?.name}</td>
//               <td>{t.assignee?.name || "—"}</td>
//               <td className="flex gap-2">
//                 {["OPEN","IN_PROGRESS","RESOLVED","CLOSED"].map(s => (
//                   <button
//                     key={s}
//                     className="btn"
//                     onClick={() => updateStatus.mutate({ id: t.id, status: s })}
//                   >
//                     {s}
//                   </button>
//                 ))}

//                 {agents && (
//                   <select
//                     className="input"
//                     defaultValue=""
//                     onChange={(e) => {
//                       const assigneeId = parseInt(e.target.value);
//                       if (!isNaN(assigneeId)) {
//                         reassign.mutate({ id: t.id, assigneeId });
//                       }
//                     }}
//                   >
//                     <option value="">Reassign to…</option>
//                     {agents.map((a: any) => (
//                       <option key={a.id} value={a.id}>
//                         {a.name || a.email}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminTickets() {
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<number | "">("");

  // Fetch tickets
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["adminTickets"],
    queryFn: async () => {
      const res = await api.get("/api/admin/tickets");
      return res.data;
    },
  });

  // Fetch support agents
  const { data: agents } = useQuery({
    queryKey: ["supportAgents"],
    queryFn: async () => {
      const res = await api.get("/api/admin/users"); // your API for users
      return res.data.filter((u: any) => u.role === "ROLE_SUPPORT_AGENT");
    },
  });

  // Mutation for reassign
  const reassignMutation = useMutation({
    mutationFn: async ({ ticketId, agentId }: { ticketId: number; agentId: number }) => {
      const res = await api.post(`/api/admin/tickets/${ticketId}/assign`, { agentId });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Ticket reassigned to ${data.assignedTo?.name}`);
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
      setSelectedTicket(null);
      setSelectedAgent("");
    },
    onError: () => {
      toast.error("Failed to reassign ticket");
    },
  });

  if (isLoading) return <p>Loading tickets...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin - Manage Tickets</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Assigned To</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets?.map((ticket: any) => (
            <tr key={ticket.id} className="border">
              <td className="p-2 border">{ticket.id}</td>
              <td className="p-2 border">{ticket.title}</td>
              <td className="p-2 border">{ticket.status}</td>
              <td className="p-2 border">
                {ticket.assignedTo ? ticket.assignedTo.name : "Unassigned"}
              </td>
              <td className="p-2 border">
                {selectedTicket === ticket.id ? (
                  <div className="flex gap-2">
                    <select
                      className="border rounded px-2"
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(Number(e.target.value))}
                    >
                      <option value="">Select Agent</option>
                      {agents?.map((agent: any) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      onClick={() =>
                        reassignMutation.mutate({ ticketId: ticket.id, agentId: Number(selectedAgent) })
                      }
                      disabled={!selectedAgent}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                      onClick={() => setSelectedTicket(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    Reassign
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
