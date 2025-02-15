import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define AuthContext type
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ access?: string; refresh?: string; detail?: string }>;
  signup: (email: string, password: string, confirmPassword: string, name: string, username: string) => Promise<{ access?: string; refresh?: string; detail?: string }>;
  logout: () => void;
}

// Create context with default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define Props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) verifyToken(token);
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const res = await fetch("http://192.168.1.40:8000/users/verify/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        await refreshToken();
      }
    } catch {
      await refreshToken();
    }
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) return logout();

    try {
      const res = await fetch("http://192.168.1.40:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      const data = await res.json();
      if (res.ok && data.access) {
        localStorage.setItem("accessToken", data.access);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://192.168.1.40:8000/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
        mode: "cors",
      });
      console.log(response)
      const data = await response.json();
      if (data.access && data.refresh) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        setIsAuthenticated(true);
      }
      return data;
    } catch (error) {
      console.error("Login error:", error);
      return { detail: "Login failed. Please try again." };
    }
  };

  const signup = async (email: string, password: string,confirmPassword: string, name: string, username: string) => {
    try {
      const response = await fetch("http://192.168.1.40:8000/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include",
        body: JSON.stringify({ email, password, confirmPassword, name, username }),
      });
      const data = await response.json();
      console.log(response)
      if (data.access && data.refresh) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        setIsAuthenticated(true);
      }
      return data;
    } catch (error) {
      console.error("Signup error:", error);
      return { detail: "Signup failed. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};