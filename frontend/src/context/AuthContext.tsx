import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';

export type UserRole = 'student' | 'teacher' | 'admin';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-login (if token exists)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        // use getProfile() which exists on api.auth; adapt to return shape
        const res = await api.auth.getProfile();
        const userData = (res && (res as any).user) ? (res as any).user : res;
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // LOGIN
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login({ email, password });
      const { token, user: userData } = response;

      localStorage.setItem('token', token);
      setUser(userData);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const response = await api.auth.register({ name, email, password, role });
      const { token, user: userData } = response;

      localStorage.setItem('token', token);
      setUser(userData);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Registration error:', error);
      throw new ApiError(500, 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
