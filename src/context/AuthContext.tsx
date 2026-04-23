import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";

// Define our User Types based on your backend
export type Role = "PATIENT" | "DENTIST" | "OFFICE_MANAGER";

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  patientId?: string;
}
const normalizeRole = (role: unknown): Role => {
  const value = String(role ?? "").toUpperCase();
  if (
    value === "PATIENT" ||
    value === "DENTIST" ||
    value === "OFFICE_MANAGER"
  ) {
    return value;
  }
  return "PATIENT";
};

const normalizeUser = (raw: any): User => ({
  id: String(raw?.id ?? ""),
  email: String(raw?.email ?? ""),
  role: raw?.role,
  firstName: raw?.firstName,
  lastName: raw?.lastName,
  patientId:
    raw?.patientId ??
    raw?.patient?.id ??
    raw?.patientProfile?.id ??
    raw?.profile?.patientId ??
    undefined,
});

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create the Context with an empty default state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // When the app boots up, check if they are already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsed = JSON.parse(storedUser);
      const normalized = normalizeUser(parsed);
      setToken(storedToken);
      setUser(normalized);
      localStorage.setItem("user", JSON.stringify(normalized)); // keep storage clean
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, newToken: string) => {
    const normalized = normalizeUser(userData);
    setToken(newToken);
    setUser(normalized);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(normalized));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {!isLoading ? (
        children
      ) : (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner />
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
