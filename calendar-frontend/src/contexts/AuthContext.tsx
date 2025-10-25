import { createContext, type ReactNode } from "react";
import useCurrentUserQuery from "../features/auth/queries/useCurrentUserQuery";
import type { User } from "../api/clients/authApiClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useCurrentUserQuery();

  const value: AuthContextType = {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
