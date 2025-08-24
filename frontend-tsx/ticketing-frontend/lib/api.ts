import axios from "axios";
import { useAuth } from "./authStore";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL });

// attach token
api.interceptors.request.use((config) => {
  try {
    const store = useAuth.getState();
    if (store.token) {
      config.headers = config.headers || {};
      (config.headers as any)["Authorization"] = `Bearer ${store.token}`;
    }
  } catch {}
  return config;
});

export default api;