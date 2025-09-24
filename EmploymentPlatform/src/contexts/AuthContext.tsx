
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { api, setAuthToken } from "@/lib/api";

// Define types
type UserRole = 'jobseeker' | 'employer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string; 
  title?: string; 
  skills?: string[]; 
  about?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    (async () => {
      try {
        if (!token) return;
        await api('/auth/me');
        const me = await api<User>('/users/me');
        setUser(me);
      } catch (_) {
        setAuthToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token } = await api<{ token: string; user: User }>(`/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setAuthToken(token);
      const me = await api<User>('/users/me');
      setUser(me);
      toast({ title: "Welcome back!", description: `You're logged in as ${me.name}` });
    } catch (error) {
      toast({ title: "Login failed", description: error instanceof Error ? error.message : "An error occurred", variant: "destructive" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true);
    try {
      const { token, user: created } = await api<{ token: string; user: User }>(`/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      setAuthToken(token);
      setUser(created);
      toast({ title: "Registration successful", description: "Your account has been created" });
    } catch (error) {
      toast({ title: "Registration failed", description: error instanceof Error ? error.message : "An error occurred", variant: "destructive" });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    toast({ title: "Logged out", description: "You've been successfully logged out" });
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await api<User>('/users/me', { method: 'PATCH', body: JSON.stringify(updatedData) });
      setUser(updated);
      toast({ title: "Profile updated", description: "Your profile has been successfully updated" });
    } catch (error) {
      toast({ title: "Update failed", description: error instanceof Error ? error.message : "An error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
