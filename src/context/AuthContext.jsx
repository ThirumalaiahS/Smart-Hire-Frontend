import { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStoredAuth = () => {
    const storedToken = localStorage.getItem("sh_token");
    if (storedToken) {
      const decoded = parseJwt(storedToken);
      // Check expiry
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(storedToken);

        // ASP.NET Identity roles are typically mapped under schemas/claims/role keys
        const roleKey =
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" ||
          "role";
        const role = decoded[roleKey] || decoded.role || "Candidate";

        setUser({
          id: decoded.nameid || decoded.sub,
          email: decoded.email || decoded.unique_name,
          role: Array.isArray(role) ? role[0] : role,
          name:
            decoded.given_name ||
            decoded.name ||
            (decoded.email ? decoded.email.split("@")[0] : "User"),
        });
      } else {
        // Expired
        localStorage.removeItem("sh_token");
      }
    } else {
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStoredAuth();

    // Listen for cross-tab auth sync or API client 401 events
    const handleAuthChange = () => {
      loadStoredAuth();
    };
    window.addEventListener("auth_change", handleAuthChange);
    return () => window.removeEventListener("auth_change", handleAuthChange);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await client.post("/api/auth/login", {
        email,
        password,
      });
      // The API contract returns ApiResponse<T> where response.data contains { token, ... }
      const data = response.data;
      const jwtToken = data?.token || data;

      if (jwtToken) {
        localStorage.setItem("sh_token", jwtToken);
        const decoded = parseJwt(jwtToken);
        const roleKey =
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" ||
          "role";
        const role = decoded ? decoded[roleKey] || decoded.role : "Candidate";

        const userData = {
          id: decoded?.nameid || decoded?.sub,
          email: decoded?.email || email,
          role: Array.isArray(role) ? role[0] : role,
          name: decoded?.given_name || decoded?.name || email.split("@")[0],
        };

        setToken(jwtToken);
        setUser(userData);
        return { success: true, user: userData };
      }
      throw new Error("No token returned from server");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, role = "1") => {
    try {
      const response = await client.post("/api/auth/register", {
        email,
        password,
        role,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("sh_token");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  const forgotPassword = async (email) => {
    return await client.post("/api/auth/forgot-password", { email });
  };

  const resetPassword = async (token, email, newPassword) => {
    return await client.post("/api/auth/reset-password", {
      token,
      email,
      newPassword,
    });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
