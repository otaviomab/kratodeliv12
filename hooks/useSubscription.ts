import { useState, useEffect } from 'react';
import { BillingCycle, SubscriptionPlan, EstablishmentSubscription } from '@/lib/subscriptionService';
import { useAuthStore } from '@/stores/authStore';

interface UseSubscriptionReturn {
  plans: SubscriptionPlan[];
  subscription: EstablishmentSubscription | null;
  isLoading: boolean;
  error: string | null;
  updateSubscription: (planId: string, billingCycle: BillingCycle) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  checkFeatureAccess: (featureName: string) => Promise<boolean>;
  getProductLimit: () => Promise<{
    maxProducts: number;
    currentProductCount: number;
    remainingProducts: number;
    canAddMore: boolean;
  }>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<EstablishmentSubscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { establishmentId } = useAuthStore();
  
  // Carregar planos disponíveis
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/subscription/plans');
        
        if (!response.ok) {
          throw new Error('Erro ao buscar planos de assinatura');
        }
        
        const data = await response.json();
        setPlans(data.plans);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar planos:', err);
        setError('Não foi possível carregar os planos de assinatura');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlans();
  }, []);
  
  // Carregar assinatura atual
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!establishmentId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/establishment/${establishmentId}/subscription`);
        
        if (response.status === 404) {
          // Não tem assinatura, isso é normal
          setSubscription(null);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Erro ao buscar assinatura');
        }
        
        const data = await response.json();
        setSubscription(data.subscription);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar assinatura:', err);
        setError('Não foi possível carregar sua assinatura atual');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscription();
  }, [establishmentId]);
  
  // Atualizar assinatura
  const updateSubscription = async (planId: string, billingCycle: BillingCycle) => {
    if (!establishmentId) {
      setError('Usuário não autenticado');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/establishment/${establishmentId}/subscription/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, billingCycle }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar assinatura');
      }
      
      const data = await response.json();
      setSubscription(data.subscription);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao atualizar assinatura:', err);
      setError(err.message || 'Erro ao atualizar sua assinatura');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancelar assinatura
  const cancelSubscription = async () => {
    if (!establishmentId) {
      setError('Usuário não autenticado');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/establishment/${establishmentId}/subscription/cancel`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cancelar assinatura');
      }
      
      const data = await response.json();
      setSubscription(data.subscription);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao cancelar assinatura:', err);
      setError(err.message || 'Erro ao cancelar sua assinatura');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verificar acesso a um recurso
  const checkFeatureAccess = async (featureName: string): Promise<boolean> => {
    if (!establishmentId) {
      return false;
    }
    
    try {
      const response = await fetch(`/api/establishment/${establishmentId}/check-feature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featureName }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao verificar acesso ao recurso');
      }
      
      const data = await response.json();
      return data.hasAccess;
    } catch (err) {
      console.error(`Erro ao verificar acesso ao recurso ${featureName}:`, err);
      return false;
    }
  };
  
  // Obter limite de produtos
  const getProductLimit = async () => {
    if (!establishmentId) {
      return {
        maxProducts: 0,
        currentProductCount: 0,
        remainingProducts: 0,
        canAddMore: false,
      };
    }
    
    try {
      const response = await fetch(`/api/establishment/${establishmentId}/product-limit`);
      
      if (!response.ok) {
        throw new Error('Erro ao verificar limite de produtos');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Erro ao verificar limite de produtos:', err);
      return {
        maxProducts: 0,
        currentProductCount: 0,
        remainingProducts: 0,
        canAddMore: false,
      };
    }
  };
  
  return {
    plans,
    subscription,
    isLoading,
    error,
    updateSubscription,
    cancelSubscription,
    checkFeatureAccess,
    getProductLimit,
  };
} 