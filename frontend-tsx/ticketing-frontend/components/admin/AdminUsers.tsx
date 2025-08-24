"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";
import { toast } from "react-hot-toast";

type User = {
  id: number;
  email: string;
  role: string;
};

export default function AdminUsers() {
  const { data: users, refetch } = useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: async () => (await api.get("/admin/users")).data,
  });

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  const addUser = useMutation({
    mutationFn: async () => {
      await api.post("/admin/users", { email, role });
    },
    onSuccess: () => {
      toast.success("User added");
      refetch();
    },
    onError: () => toast.error("Failed to add user"),
  });

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      toast.success("User deleted");
      refetch();
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      await api.patch(`/admin/users/${id}/role`, { role });
    },
    onSuccess: () => {
      toast.success("Role updated");
      refetch();
    },
    onError: () => toast.error("Failed to update role"),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">User Management</h2>

      {/* Add user */}
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="User email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="AGENT">Support Agent</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => addUser.mutate()}
        >
          Add User
        </button>
      </div>

      {/* User list */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select
                  value={u.role}
                  onChange={(e) =>
                    updateRole.mutate({ id: u.id, role: e.target.value })
                  }
                  className="border p-1"
                >
                  <option value="USER">User</option>
                  <option value="AGENT">Support Agent</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={() => deleteUser.mutate(u.id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
