'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  verified: boolean;
  rank?: {
    tier: string;
    division: number;
    points: number;
    pointsToNextRank: number;
    season: string;
  };
  totalPoints: number;
  tournamentsWon: number;
  gamesPlayed: number;
  gamingAccounts?: Array<{
    id: string;
    platform: string;
    username: string;
    verified: boolean;
  }>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gameId?: string;
  gameUsername?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Validate the token with the server
          try {
            const response = await apiClient.user.getProfile();
            if (response.success && response.data) {
              setUser(response.data as User);
            } else {
              throw new Error('Invalid token');
            }
          } catch (error) {
            // Token is invalid, clear data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            document.cookie =
              'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          }
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          document.cookie =
            'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login({ email, password });

      if (response.success && response.data) {
        const authData = response.data as any;
        setUser(authData.user);
        localStorage.setItem('user', JSON.stringify(authData.user));
        localStorage.setItem('auth_token', authData.token);

        // Set cookie for middleware
        document.cookie = `auth_token=${authData.token}; path=/; max-age=${
          7 * 24 * 60 * 60
        }`; // 7 days

        toast.success('Welcome back!');
        return true;
      } else {
        toast.error(response.error || 'Login failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // Extract only the fields the backend expects
      const registrationPayload = {
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      };

      const response = await apiClient.register(registrationPayload);

      if (response.success && response.data) {
        const authData = response.data as any;
        setUser(authData.user);
        localStorage.setItem('user', JSON.stringify(authData.user));
        localStorage.setItem('auth_token', authData.token);

        // Set cookie for middleware
        document.cookie = `auth_token=${authData.token}; path=/; max-age=${
          7 * 24 * 60 * 60
        }`; // 7 days

        toast.success('Account created successfully!');
        return true;
      } else {
        const errorMsg = response.error || 'Registration failed';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      
      // Don't show toast for user exists errors - let the form handle it
      if (!errorMessage.toLowerCase().includes('already exists') && 
          !errorMessage.toLowerCase().includes('already registered')) {
        toast.error(errorMessage);
      }
      
      throw error; // Re-throw so the form can handle it
    }
  };

  const logout = () => {
    try {
      apiClient.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    }

    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    // Clear cookie
    document.cookie =
      'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    toast.success('Logged out successfully');
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
