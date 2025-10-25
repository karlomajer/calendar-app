import { createContext, useContext, type ReactNode } from "react";
import useUserQuery from "../queries/useUserQuery";
import type { User } from "../api/clients/authApiClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useUserQuery();

  const value: AuthContextType = {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
