import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_DATA } from '../lib/mockData';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('auracast_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auracast_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const userData = MOCK_DATA.users[email as keyof typeof MOCK_DATA.users];
    
    if (userData && userData.password === password) {
      const user: User = {
        name: userData.name,
        email,
        role: userData.role
      };
      setUser(user);
      localStorage.setItem('auracast_user', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    // In a real app, this would make an API call
    // For demo purposes, we'll just add to our mock data and log in
    if (MOCK_DATA.users[email as keyof typeof MOCK_DATA.users]) {
      return false; // User already exists
    }

    // Add to mock data (this would be an API call in real implementation)
    (MOCK_DATA.users as any)[email] = {
      name,
      password,
      role: 'user'
    };

    const user: User = {
      name,
      email,
      role: 'user'
    };
    
    setUser(user);
    localStorage.setItem('auracast_user', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auracast_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};