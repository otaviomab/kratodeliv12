'use client';

import { createContext, useContext } from 'react';
import type { Models } from 'appwrite';

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const defaultContext: AuthContextType = {
  user: null,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export function useAuth() {
  return useContext(AuthContext);
} 