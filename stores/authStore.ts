import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Establishment {
  id: string;
  name: string;
  slug: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
  } | null;
  establishment: Establishment | null;
  setAuthenticated: (
    authenticated: boolean,
    userData?: {
      id: string;
      email: string;
    } | null
  ) => void;
  setEstablishment: (establishment: Establishment | null) => void;
  logout: () => void;
}

// Dados de estabelecimento para teste (remover em produção)
const mockEstablishment: Establishment = {
  id: '6452b95ad871983070ac',
  name: 'Restaurante Teste',
  slug: 'restaurante-teste'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: true, // Para teste, assumimos que está autenticado (substituir em produção)
      user: {
        id: 'user-test-id',
        email: 'user@test.com'
      },
      establishment: mockEstablishment, // Para teste, use o estabelecimento mock
      setAuthenticated: (authenticated, userData = null) => 
        set(() => ({ 
          isAuthenticated: authenticated,
          user: userData 
        })),
      setEstablishment: (establishment) => 
        set(() => ({ establishment })),
      logout: () => 
        set(() => ({ 
          isAuthenticated: false, 
          user: null,
          establishment: null 
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
); 