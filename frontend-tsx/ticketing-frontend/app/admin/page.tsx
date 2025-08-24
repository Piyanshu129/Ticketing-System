// // "use client";

// // import { useEffect, useState } from "react";
// // import api from "@/lib/api";
// // import { toast } from "sonner";

// // type Ticket = {
// //   id: number;
// //   title: string;
// //   description: string;
// //   status: string;
// //   priority: string;
// //   createdBy: { id: number; name: string; email: string };
// //   assignedTo?: { id: number; name: string; email: string } | null;
// // };

// // type User = {
// //   id: number;
// //   name: string;
// //   email: string;
// //   role: string;
// // };

// // export default function AdminPage() {
// //   const [tickets, setTickets] = useState<Ticket[]>([]);
// //   const [users, setUsers] = useState<User[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   const fetchData = async () => {
// //     try {
// //       const [ticketRes, userRes] = await Promise.all([
// //         api.get("/api/admin/tickets"),
// //         api.get("/api/admin/users"),
// //       ]);
// //       setTickets(ticketRes.data);
// //       setUsers(userRes.data);
// //     } catch (err) {
// //       console.error(err);
// //       toast.error("Failed to fetch admin data");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const handleResolve = async (ticketId: number) => {
// //     try {
// //       await api.put(`/api/admin/tickets/${ticketId}/resolve`);
// //       toast.success("Ticket resolved");
// //       fetchData();
// //     } catch {
// //       toast.error("Failed to resolve ticket");
// //     }
// //   };

// //   const handleClose = async (ticketId: number) => {
// //     try {
// //       await api.put(`/api/admin/tickets/${ticketId}/close`);
// //       toast.success("Ticket closed");
// //       fetchData();
// //     } catch {
// //       toast.error("Failed to close ticket");
// //     }
// //   };

// //   const handleReassign = async (ticketId: number, userId: number) => {
// //     try {
// //       await api.put(
// //         `/api/admin/tickets/${ticketId}/assign`,
// //         { userId },
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       toast.success("Ticket reassigned");
// //       fetchData();
// //     } catch (err: any) {
// //       console.error(err);
// //       toast.error(err?.response?.data?.message || "Failed to reassign ticket");
// //     }
// //   };

// //   if (loading) return <p className="p-4">Loading admin dashboard...</p>;

// //   return (
// //     <div className="p-6 space-y-10">
// //       <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

// //       {/* TICKETS SECTION */}
// //       <section>
// //         <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
// //         <table className="w-full border border-gray-300">
// //           <thead className="bg-gray-100">
// //             <tr>
// //               <th className="border px-3 py-2">ID</th>
// //               <th className="border px-3 py-2">Title</th>
// //               <th className="border px-3 py-2">Status</th>
// //               <th className="border px-3 py-2">Priority</th>
// //               <th className="border px-3 py-2">Created By</th>
// //               <th className="border px-3 py-2">Assigned To</th>
// //               <th className="border px-3 py-2">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {tickets.map((t) => (
// //               <tr key={t.id}>
// //                 <td className="border px-3 py-2">{t.id}</td>
// //                 <td className="border px-3 py-2">{t.title}</td>
// //                 <td className="border px-3 py-2">{t.status}</td>
// //                 <td className="border px-3 py-2">{t.priority}</td>
// //                 <td className="border px-3 py-2">
// //                   {t.createdBy?.name} ({t.createdBy?.email})
// //                 </td>
// //                 <td className="border px-3 py-2">
// //                   {t.assignedTo
// //                     ? `${t.assignedTo.name} (${t.assignedTo.email})`
// //                     : "Unassigned"}
// //                 </td>
// //                 <td className="border px-3 py-2 space-x-2">
// //                   <button
// //                     onClick={() => handleResolve(t.id)}
// //                     className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
// //                   >
// //                     Resolve
// //                   </button>
// //                   <button
// //                     onClick={() => handleClose(t.id)}
// //                     className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
// //                   >
// //                     Close
// //                   </button>

// //                   {/* Dropdown for reassign */}
// //                   <select
// //                     defaultValue=""
// //                     onChange={(e) => {
// //                       const userId = Number(e.target.value);
// //                       if (userId) handleReassign(t.id, userId);
// //                     }}
// //                     className="border rounded px-2 py-1"
// //                   >
// //                     <option value="">Reassign...</option>
// //                     {users
// //                       .filter((u) => u.role === "ROLE_SUPPORT_AGENT")
// //                       .map((u) => (
// //                         <option key={u.id} value={u.id}>
// //                           {u.name} ({u.email})
// //                         </option>
// //                       ))}
// //                   </select>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </section>

// //       {/* USERS SECTION */}
// //       <section>
// //         <h2 className="text-xl font-semibold mb-2">Users</h2>
// //         <table className="w-full border border-gray-300">
// //           <thead className="bg-gray-100">
// //             <tr>
// //               <th className="border px-3 py-2">ID</th>
// //               <th className="border px-3 py-2">Name</th>
// //               <th className="border px-3 py-2">Email</th>
// //               <th className="border px-3 py-2">Role</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {users.map((u) => (
// //               <tr key={u.id}>
// //                 <td className="border px-3 py-2">{u.id}</td>
// //                 <td className="border px-3 py-2">{u.name}</td>
// //                 <td className="border px-3 py-2">{u.email}</td>
// //                 <td className="border px-3 py-2">{u.role}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </section>
// //     </div>
// //   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/api";
// import { toast } from "sonner";

// type Ticket = {
//   id: number;
//   title: string;
//   description: string;
//   status: string;
//   priority: string;
//   createdBy: { id: number; name: string; email: string };
//   assignedTo?: { id: number; name: string; email: string } | null;
// };

// type User = {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
// };

// export default function AdminPage() {
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Add User form state
//   const [showForm, setShowForm] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "ROLE_SUPPORT_AGENT",
//   });

//   const fetchData = async () => {
//     try {
//       const [ticketRes, userRes] = await Promise.all([
//         api.get("/api/admin/tickets"),
//         api.get("/api/admin/users"),
//       ]);
//       setTickets(ticketRes.data);
//       setUsers(userRes.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch admin data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleResolve = async (ticketId: number) => {
//     try {
//       await api.put(`/api/admin/tickets/${ticketId}/resolve`);
//       toast.success("Ticket resolved");
//       fetchData();
//     } catch {
//       toast.error("Failed to resolve ticket");
//     }
//   };

//   const handleClose = async (ticketId: number) => {
//     try {
//       await api.put(`/api/admin/tickets/${ticketId}/close`);
//       toast.success("Ticket closed");
//       fetchData();
//     } catch {
//       toast.error("Failed to close ticket");
//     }
//   };

//   const handleReassign = async (ticketId: number, userId: number) => {
//     try {
//       await api.put(
//         `/api/admin/tickets/${ticketId}/assign`,
//         { userId },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       toast.success("Ticket reassigned");
//       fetchData();
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Failed to reassign ticket");
//     }
//   };

//   const handleAddUser = async () => {
//     try {
//       await api.post("http://localhost:8080/api/auth/register", newUser, {
//         headers: { "Content-Type": "application/json" },
//       });
//       toast.success("User added successfully");
//       setShowForm(false);
//       setNewUser({ name: "", email: "", password: "", role: "ROLE_SUPPORT_AGENT" });
//       fetchData();
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Failed to add user");
//     }
//   };

//   if (loading) return <p className="p-4">Loading admin dashboard...</p>;

//   return (
//     <div className="p-6 space-y-10">
//       <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

//       {/* ADD USER BUTTON */}
//       <div className="mb-4">
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           {showForm ? "Cancel" : "Add User"}
//         </button>
//       </div>

//       {/* ADD USER FORM */}
//       {showForm && (
//         <div className="border p-4 rounded mb-6 space-y-4">
//           <div>
//             <label className="block mb-1">Name</label>
//             <input
//               type="text"
//               className="border rounded px-2 py-1 w-full"
//               value={newUser.name}
//               onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block mb-1">Email</label>
//             <input
//               type="email"
//               className="border rounded px-2 py-1 w-full"
//               value={newUser.email}
//               onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block mb-1">Password</label>
//             <input
//               type="password"
//               className="border rounded px-2 py-1 w-full"
//               value={newUser.password}
//               onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block mb-1">Role</label>
//             <select
//               className="border rounded px-2 py-1 w-full"
//               value={newUser.role}
//               onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
//             >
//               <option value="ROLE_SUPPORT_AGENT">Support Agent</option>
//               <option value="ROLE_ADMIN">Admin</option>
//               <option value="ROLE_USER">User</option>
//             </select>
//           </div>
//           <button
//             onClick={handleAddUser}
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//           >
//             Add User
//           </button>
//         </div>
//       )}

//       {/* TICKETS SECTION */}
//       <section>
//         <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
//         <table className="w-full border border-gray-300">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-3 py-2">ID</th>
//               <th className="border px-3 py-2">Title</th>
//               <th className="border px-3 py-2">Status</th>
//               <th className="border px-3 py-2">Priority</th>
//               <th className="border px-3 py-2">Created By</th>
//               <th className="border px-3 py-2">Assigned To</th>
//               <th className="border px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tickets.map((t) => (
//               <tr key={t.id}>
//                 <td className="border px-3 py-2">{t.id}</td>
//                 <td className="border px-3 py-2">{t.title}</td>
//                 <td className="border px-3 py-2">{t.status}</td>
//                 <td className="border px-3 py-2">{t.priority}</td>
//                 <td className="border px-3 py-2">
//                   {t.createdBy?.name} ({t.createdBy?.email})
//                 </td>
//                 <td className="border px-3 py-2">
//                   {t.assignedTo
//                     ? `${t.assignedTo.name} (${t.assignedTo.email})`
//                     : "Unassigned"}
//                 </td>
//                 <td className="border px-3 py-2 space-x-2">
//                   <button
//                     onClick={() => handleResolve(t.id)}
//                     className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//                   >
//                     Resolve
//                   </button>
//                   <button
//                     onClick={() => handleClose(t.id)}
//                     className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                   >
//                     Close
//                   </button>

//                   {/* Dropdown for reassign */}
//                   <select
//                     defaultValue=""
//                     onChange={(e) => {
//                       const userId = Number(e.target.value);
//                       if (userId) handleReassign(t.id, userId);
//                     }}
//                     className="border rounded px-2 py-1"
//                   >
//                     <option value="">Reassign...</option>
//                     {users
//                       .filter((u) => u.role === "ROLE_SUPPORT_AGENT")
//                       .map((u) => (
//                         <option key={u.id} value={u.id}>
//                           {u.name} ({u.email})
//                         </option>
//                       ))}
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* USERS SECTION */}
//       {/* USERS SECTION */}
// <section>
//   <h2 className="text-xl font-semibold mb-2">Users</h2>
//   <table className="w-full border border-gray-300">
//     <thead className="bg-gray-100">
//       <tr>
//         <th className="border px-3 py-2">ID</th>
//         <th className="border px-3 py-2">Name</th>
//         <th className="border px-3 py-2">Email</th>
//         <th className="border px-3 py-2">Role</th>
//         <th className="border px-3 py-2">Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       {users.map((u) => (
//         <tr key={u.id}>
//           <td className="border px-3 py-2">{u.id}</td>
//           <td className="border px-3 py-2">{u.name}</td>
//           <td className="border px-3 py-2">{u.email}</td>
//           <td className="border px-3 py-2">{u.role}</td>
//           <td className="border px-3 py-2 space-x-2">
//             {/* Delete User */}
//             <button
//               onClick={async () => {
//                 try {
//                   await api.delete(`http://localhost:8080/api/admin/users/${u.id}`);
//                   toast.success("User deleted successfully");
//                   fetchData();
//                 } catch (err: any) {
//                   console.error(err);
//                   toast.error(err?.response?.data?.message || "Failed to delete user");
//                 }
//               }}
//               className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//             >
//               Delete
//             </button>

//             {/* Edit Role */}
//             <select
//               defaultValue={u.role}
//               onChange={async (e) => {
//                 const newRole = e.target.value;
//                 try {
//                   await api.put(
//                     `http://localhost:8080/api/admin/users/${u.id}/role`,
//                     { role: newRole },
//                     { headers: { "Content-Type": "application/json" } }
//                   );
//                   toast.success("User role updated");
//                   fetchData();
//                 } catch (err: any) {
//                   console.error(err);
//                   toast.error(err?.response?.data?.message || "Failed to update role");
//                 }
//               }}
//               className="border rounded px-2 py-1"
//             >
//               <option value="ROLE_SUPPORT_AGENT">Support Agent</option>
//               <option value="ROLE_ADMIN">Admin</option>
//               <option value="ROLE_USER">User</option>
//             </select>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </section>

//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/lib/authStore"; // import auth hook
import { useRouter } from "next/navigation";

type Ticket = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdBy: { id: number; name: string; email: string };
  assignedTo?: { id: number; name: string; email: string } | null;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout } = useAuth(); // <-- make sure logout is returned by the hook


  // Add User form state
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_SUPPORT_AGENT",
  });

  const fetchData = async () => {
    try {
      const [ticketRes, userRes] = await Promise.all([
        api.get("/api/admin/tickets"),
        api.get("/api/admin/users"),
      ]);
      setTickets(ticketRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/"); // redirect to localhost:3000
  };
  // Ticket Actions
  const handleResolve = async (ticketId: number) => {
    try {
      await api.put(
        `http://localhost:8080/api/tickets/${ticketId}/status`,
        { status: "RESOLVED" },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Ticket resolved");
      fetchData(); // Refresh the table
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to resolve ticket");
    }
  };
  
  const handleClose = async (ticketId: number) => {
    try {
      await api.put(
        `http://localhost:8080/api/tickets/${ticketId}/status`,
        { status: "CLOSED" },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Ticket closed");
      fetchData(); // Refresh the table
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to close ticket");
    }
  };
  

  const handleReassign = async (ticketId: number, agentId: number) => {
    try {
      await api.put(
        `/api/admin/tickets/${ticketId}/assign`,
        { agentId },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Ticket reassigned");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to reassign ticket");
    }
  };

  // User Actions
  const handleAddUser = async () => {
    try {
      await api.post("http://localhost:8080/api/auth/register", newUser, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("User added successfully");
      setShowForm(false);
      setNewUser({ name: "", email: "", password: "", role: "ROLE_SUPPORT_AGENT" });
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add user");
    }
  };

  // Logout handler
  

  const handleDeleteUser = async (userId: number) => {
    try {
      await api.delete(`http://localhost:8080/api/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const handleEditRole = async (userId: number, role: string) => {
    try {
      await api.put(
        `http://localhost:8080/api/admin/users/${userId}/role`,
        { role },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("User role updated");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update role");
    }
  };

  if (loading) return <p className="p-4">Loading admin dashboard...</p>;

  return (
    <div className="p-6 space-y-10">
      <div className="flex items-center justify-between mb-6">
  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
  <div className="flex gap-2">
    {/* Add User Button */}
    <button
      onClick={() => setShowForm(!showForm)}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {showForm ? "Cancel" : "Add User"}
    </button>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  </div>
</div>

      {/* ADD USER BUTTON */}
      {/* <div className="mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div> */}

      {/* ADD USER FORM */}
      {showForm && (
        <div className="border p-4 rounded mb-6 space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="border rounded px-2 py-1 w-full"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="border rounded px-2 py-1 w-full"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1">Role</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="ROLE_SUPPORT_AGENT">Support Agent</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_USER">User</option>
            </select>
          </div>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add User
          </button>
        </div>
      )}

      {/* TICKETS SECTION */}
      <section>
        <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
        <table className="w-full border border-gray-300">
        <thead className="bg-blue-600 text-white">
  <tr>
    <th className="border px-3 py-2">ID</th>
    <th className="border px-3 py-2">Title</th>
    <th className="border px-3 py-2">Status</th>
    <th className="border px-3 py-2">Priority</th>
    <th className="border px-3 py-2">Created By</th>
    <th className="border px-3 py-2">Assigned To</th>
    <th className="border px-3 py-2">Actions</th>
  </tr>
</thead>

          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td className="border px-3 py-2">{t.id}</td>
                <td className="border px-3 py-2">{t.title}</td>
                <td className="border px-3 py-2">{t.status}</td>
                <td className="border px-3 py-2">{t.priority}</td>
                <td className="border px-3 py-2">
                  {t.createdBy?.name} ({t.createdBy?.email})
                </td>
                <td className="border px-3 py-2">
                  {t.assignedTo
                    ? `${t.assignedTo.name} (${t.assignedTo.email})`
                    : "Unassigned"}
                </td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() => handleResolve(t.id)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleClose(t.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Close
                  </button>

                  {/* Dropdown for reassign */}
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const agentId = Number(e.target.value);
                      if (agentId) handleReassign(t.id, agentId);
                    }}
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Reassign...</option>
                    {users
                      .filter((u) => u.role === "ROLE_SUPPORT_AGENT")
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* USERS SECTION */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <table className="w-full border border-gray-300">
        <thead className="bg-blue-600 text-white">
  <tr>
    <th className="border px-3 py-2">ID</th>
    <th className="border px-3 py-2">Name</th>
    <th className="border px-3 py-2">Email</th>
    <th className="border px-3 py-2">Role</th>
    <th className="border px-3 py-2">Actions</th>
  </tr>
</thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border px-3 py-2">{u.id}</td>
                <td className="border px-3 py-2">{u.name}</td>
                <td className="border px-3 py-2">{u.email}</td>
                <td className="border px-3 py-2">{u.role}</td>
                <td className="border px-3 py-2 space-x-2">
                  {/* Delete User */}
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                  {/* Edit Role */}
                  <select
                    defaultValue={u.role}
                    onChange={(e) => handleEditRole(u.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="ROLE_SUPPORT_AGENT">Support Agent</option>
                    <option value="ROLE_ADMIN">Admin</option>
                    <option value="ROLE_USER">User</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

