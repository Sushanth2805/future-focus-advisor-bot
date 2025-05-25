
import React, { createContext } from 'react';
import { useAuthProvider, AuthContextType } from '@/hooks/useAuth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
