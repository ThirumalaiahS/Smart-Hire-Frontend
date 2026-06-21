import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:44328";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Auth Token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sh_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle Global Errors (like 401)
client.interceptors.response.use(
  (response) => response.data, // Automatically unwrap ApiResponse<T>
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Auto-logout on 401 Unauthorized
      if (status === 401) {
        localStorage.removeItem("sh_token");
        localStorage.removeItem("sh_user");
        // Dispatch custom event to trigger React state updates
        window.dispatchEvent(new Event("auth_change"));
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login?session_expired=true";
        }
      }

      return Promise.reject({
        status,
        message: error.response.data?.message || "An error occurred",
        errors: error.response.data?.errors || null,
      });
    }

    return Promise.reject({
      status: 500,
      message: "Network error or server unreachable. Please try again later.",
      errors: null,
    });
  },
);

export default client;
