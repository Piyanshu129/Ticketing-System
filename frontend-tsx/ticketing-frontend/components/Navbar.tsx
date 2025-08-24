"use client";
import Link from "next/link";
import { useAuth } from "@/lib/authStore";
import { useRouter } from "next/navigation";


export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/auth/login"); // redirect to login after logout
  };
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="font-semibold">Ticketing</Link>
        <nav className="flex items-center gap-4">
          {user && (
            <>
              <Link className="link" href="/dashboard">Dashboard</Link>
              {user.role === "ROLE_ADMIN" && (
                <>
                  <Link className="link" href="/admin/users">Admin Users</Link>
                  <Link className="link" href="/admin/tickets">Admin Tickets</Link>
                </>
              )}
            </>
          )}
        </nav>
        <div>
        {user ? (
            <button 
              onClick={handleLogout} 
              className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          ) : (
            <Link 
              href="/auth/login" 
              className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}