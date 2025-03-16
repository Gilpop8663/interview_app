import React, { createContext, useContext, useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '@constants/storage';
import { deleteItemAsync, getItemAsync } from '@utils/storage';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getItemAsync(ACCESS_TOKEN);
      setToken(storedToken);
      setIsLoading(false);
    };

    loadToken();
  }, []);

  const logout = async () => {
    deleteItemAsync(ACCESS_TOKEN);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
