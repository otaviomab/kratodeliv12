'use client';

import { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { ID, AppwriteException } from 'appwrite';
import { AuthContext } from './useAuth';
import type { Models } from 'appwrite';

// Tipo para validação de senha
type PasswordValidation = {
  isValid: boolean;
  errors: string[];
};

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const session = await account.get();
      setUser(session);
      setError(null);
    } catch (_) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  // Função para validar senha
  function validatePassword(password: string): PasswordValidation {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async function login(email: string, password: string) {
    try {
      setIsLoading(true);
      // Usar método específico para login com email e senha
      await account.createEmailPasswordSession(email, password);
      await checkUser();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(email: string, password: string, name: string, phone: string) {
    try {
      const validation = validatePassword(password);
      if (!validation.isValid) {
        const errorMessages = validation.errors.join('\n');
        setError(errorMessages);
        throw new Error(errorMessages);
      }
      
      setIsLoading(true);
      setError(null);
      const userId = ID.unique();
      
      await account.create(userId, email, password, name);
      
      await login(email, password);
      
      try {
        await account.updatePrefs({ phone });
      } catch (prefsError) {
        console.error("Erro ao atualizar preferências (telefone):", prefsError);
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar conta';
      if (error instanceof AppwriteException && error.code === 409) {
        setError('Este e-mail já está cadastrado.');
      } else {
        setError(message);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      setIsLoading(true);
      setError(null);
      await account.deleteSession('current');
      setUser(null);
      router.push('/admin/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao sair';
      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
} 