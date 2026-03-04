import axios from "axios";

// single axios instance used throughout the app
// base URL is drawn from env so it can change between dev/staging/prod
const baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically if present
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
