import { createContext, ReactNode } from "react";
import { useAuthFunctions } from "./authFunctions";
import { GetUserQuery, SignInInput, SignUpInput } from "@/graphql/generated/types";

interface AuthContextType {
  user: GetUserQuery["getMe"] | null;
  isLoading: boolean;
  handleSignin: (input: SignInInput) => Promise<void>;
  handleSignup: (input: SignUpInput) => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  handleSignin: () => Promise.resolve(),
  handleSignup: () => Promise.resolve(),
  handleLogout: () => Promise.resolve(),
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const authFunctions = useAuthFunctions();

  return (
    <AuthContext.Provider
      value={{
        user: authFunctions.user,
        isLoading: authFunctions.isLoading,
        handleSignin: authFunctions.handleSignin,
        handleSignup: authFunctions.handleSignup,
        handleLogout: authFunctions.handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
