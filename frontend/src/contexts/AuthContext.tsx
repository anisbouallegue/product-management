import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, refreshToken, getProfile } from '../api/auth';

interface AuthContextType {
  user: any;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<string | null>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshTokenValue(storedRefreshToken);
      loadUser(storedAccessToken);
    }
  }, []);

  const loadUser = async (token: string) => {
    try {
      const response = await getProfile(token);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user', error);
      await handleLogout();
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      const { accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setAccessToken(accessToken);
      setRefreshTokenValue(refreshToken);
      
      await loadUser(accessToken);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      await apiRegister(email, password, name);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleLogout = async () => {
    if (accessToken) {
      try {
        await apiLogout(accessToken);
      } catch (error) {
        console.error('Logout error', error);
      }
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    setAccessToken(null);
    setRefreshTokenValue(null);
    setUser(null);
  };

  const handleRefresh = async () => {
    if (!refreshTokenValue) {
      await handleLogout();
      return null;
    }
    
    try {
      const response = await refreshToken(refreshTokenValue);
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      setAccessToken(accessToken);
      setRefreshTokenValue(newRefreshToken);
      
      return accessToken;
    } catch (error) {
      console.error('Refresh token failed', error);
      await handleLogout();
      return null;
    }
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshAuth: handleRefresh,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};