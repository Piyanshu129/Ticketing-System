// "use client";
// import AuthGuard from "@/components/AuthGuard";
// import TicketFilters from "@/components/TicketFilters";
// import TicketList from "@/components/TicketList";
// import NewTicketButton from "@/components/NewTicketButton";
// import { useState, useEffect } from "react";


// export default function Dashboard() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null; // avoid server/client mismatch

//   return (
//     <AuthGuard>
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-semibold">My Tickets</h1>
//         <NewTicketButton />
//       </div>
//       <TicketFilters scope="my" />
//       <TicketList scope="my" />
//     </AuthGuard>
//   );
// }
"use client";
import AuthGuard from "@/components/AuthGuard";
import TicketFilters from "@/components/TicketFilters";
import TicketList from "@/components/TicketList";
import NewTicketButton from "@/components/NewTicketButton";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authStore"; // assuming you have a hook for auth
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // avoid server/client mismatch

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <AuthGuard>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Tickets</h1>
        <div className="flex gap-2">
          <NewTicketButton />
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      <TicketFilters scope="my" />
      <TicketList scope="my" />
    </AuthGuard>
  );
}
