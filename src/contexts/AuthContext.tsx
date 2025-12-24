import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  name: string;
  type: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('portal_token');
    if (!token) {
      setLoading(false);
      return;
    }

    const { data, error } = await api.getMe();
    if (error || !data?.user) {
      localStorage.removeItem('portal_token');
      setUser(null);
    } else {
      setUser({
        id: data.user.contactId,
        email: data.user.email,
        name: data.user.name,
        type: data.user.type,
      });
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await api.login(email, password);

    if (error || !data) {
      return { success: false, error: error || 'Error al iniciar sesión' };
    }

    localStorage.setItem('portal_token', data.token);
    setUser({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      type: data.user.type || 'cliente',
    });

    return { success: true };
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    const { data, error } = await api.register(email, password, name, phone);

    if (error || !data) {
      return { success: false, error: error || 'Error al registrar' };
    }

    localStorage.setItem('portal_token', data.token);
    setUser({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      type: data.user.type || 'cliente',
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('portal_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
