export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  establishmentId: string;
  role: 'admin' | 'staff';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  resetError: () => void;
};

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  establishmentType: string;
  establishmentName: string;
} 