"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { useAuth } from "@/lib/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { setToken, setUser } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await api.post("/api/auth/login", data);
      const { token, user } = res.data;
  
      setToken(token);
      setUser(user);
      toast.success("Logged in");
  
      // Hardcoded admin check
      if (data.email === "admin@example.com" && data.password === "Admin@123") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard"); // normal users
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Login failed");
    }
  };
  

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" {...register("password")} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <button className="btn w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
