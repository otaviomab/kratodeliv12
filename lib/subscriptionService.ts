import { ID, Query, Permission, Role } from 'appwrite';
import { databases } from './appwrite';

// Constantes
const DATABASE_ID = 'kratodeliv_db';
const PLANS_COLLECTION_ID = 'subscription_plans';
const SUBSCRIPTIONS_COLLECTION_ID = 'establishment_subscriptions';

// Tipos
export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  order: number;
  isActive: boolean;
  isFeatured: boolean;
}

export interface EstablishmentSubscription {
  id: string;
  establishmentId: string;
  planId: string;
  plan?: SubscriptionPlan;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
}

// Formatador de resposta
const formatPlanResponse = (planDoc: any): SubscriptionPlan => {
  return {
    id: planDoc.$id,
    name: planDoc.name,
    description: planDoc.description,
    priceMonthly: planDoc.price_monthly,
    priceYearly: planDoc.price_yearly,
    features: planDoc.features || [],
    order: planDoc.order,
    isActive: planDoc.is_active,
    isFeatured: planDoc.is_featured,
  };
};

const formatSubscriptionResponse = (subscriptionDoc: any): EstablishmentSubscription => {
  return {
    id: subscriptionDoc.$id,
    establishmentId: subscriptionDoc.establishment?.$id || '',
    planId: subscriptionDoc.plan?.$id || '',
    startDate: subscriptionDoc.start_date,
    endDate: subscriptionDoc.end_date,
    status: subscriptionDoc.status as SubscriptionStatus,
    billingCycle: subscriptionDoc.billing_cycle as BillingCycle,
    plan: subscriptionDoc.plan ? formatPlanResponse(subscriptionDoc.plan) : undefined,
  };
};

export class SubscriptionService {
  /**
   * Obtém todos os planos de assinatura disponíveis
   */
  static async listAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PLANS_COLLECTION_ID,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order'),
        ]
      );

      return response.documents.map(formatPlanResponse);
    } catch (error) {
      console.error('Erro ao listar planos disponíveis:', error);
      throw error;
    }
  }

  /**
   * Obtém detalhes de um plano específico
   */
  static async getPlanById(planId: string): Promise<SubscriptionPlan> {
    try {
      const plan = await databases.getDocument(
        DATABASE_ID,
        PLANS_COLLECTION_ID,
        planId
      );

      return formatPlanResponse(plan);
    } catch (error) {
      console.error(`Erro ao obter plano ${planId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém a assinatura atual de um estabelecimento
   */
  static async getEstablishmentSubscription(establishmentId: string): Promise<EstablishmentSubscription | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SUBSCRIPTIONS_COLLECTION_ID,
        [
          Query.equal('establishment.$id', establishmentId),
          Query.orderDesc('$createdAt'),
          Query.limit(1)
        ]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return formatSubscriptionResponse(response.documents[0]);
    } catch (error) {
      console.error(`Erro ao obter assinatura do estabelecimento ${establishmentId}:`, error);
      throw error;
    }
  }

  /**
   * Cria ou atualiza uma assinatura para um estabelecimento
   */
  static async updateEstablishmentSubscription(
    establishmentId: string, 
    planId: string, 
    billingCycle: BillingCycle
  ): Promise<EstablishmentSubscription> {
    try {
      // Verificar se o plano existe
      const plan = await this.getPlanById(planId);
      
      // Definir período da assinatura
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      if (billingCycle === BillingCycle.MONTHLY) {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Buscar assinatura atual
      const currentSubscription = await this.getEstablishmentSubscription(establishmentId);
      
      // Definir dados da assinatura
      const subscriptionData = {
        establishment: establishmentId,
        plan: planId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: SubscriptionStatus.ACTIVE,
        billing_cycle: billingCycle,
      };

      // Definir permissões
      const permissions = [
        Permission.read(Role.user(establishmentId)),
        Permission.update(Role.user(establishmentId)),
      ];

      let subscription;
      
      if (currentSubscription) {
        // Atualizar assinatura existente
        subscription = await databases.updateDocument(
          DATABASE_ID,
          SUBSCRIPTIONS_COLLECTION_ID,
          currentSubscription.id,
          subscriptionData
        );
      } else {
        // Criar nova assinatura
        subscription = await databases.createDocument(
          DATABASE_ID,
          SUBSCRIPTIONS_COLLECTION_ID,
          ID.unique(),
          subscriptionData,
          permissions
        );
      }

      // Buscar a assinatura completa com os detalhes do plano
      return this.getEstablishmentSubscription(establishmentId) as Promise<EstablishmentSubscription>;
    } catch (error) {
      console.error(`Erro ao atualizar assinatura do estabelecimento ${establishmentId}:`, error);
      throw error;
    }
  }

  /**
   * Cancela a assinatura de um estabelecimento
   */
  static async cancelSubscription(establishmentId: string): Promise<EstablishmentSubscription | null> {
    try {
      const currentSubscription = await this.getEstablishmentSubscription(establishmentId);
      
      if (!currentSubscription) {
        return null;
      }

      // Atualizar status para cancelado
      const subscription = await databases.updateDocument(
        DATABASE_ID,
        SUBSCRIPTIONS_COLLECTION_ID,
        currentSubscription.id,
        {
          status: SubscriptionStatus.CANCELED
        }
      );

      return formatSubscriptionResponse(subscription);
    } catch (error) {
      console.error(`Erro ao cancelar assinatura do estabelecimento ${establishmentId}:`, error);
      throw error;
    }
  }

  /**
   * Verifica se um estabelecimento tem acesso a um determinado recurso
   * baseado em seu plano atual
   */
  static async hasFeatureAccess(establishmentId: string, featureName: string): Promise<boolean> {
    try {
      const subscription = await this.getEstablishmentSubscription(establishmentId);
      
      if (!subscription || 
          subscription.status !== SubscriptionStatus.ACTIVE && 
          subscription.status !== SubscriptionStatus.TRIAL) {
        return false;
      }
      
      // Se não conseguimos obter o plano na assinatura, vamos buscá-lo
      let plan = subscription.plan;
      if (!plan) {
        plan = await this.getPlanById(subscription.planId);
      }
      
      // Verificar se o recurso existe no plano
      if (plan.features.includes(featureName)) {
        return true;
      }
      
      // Recurso básico que todos os planos devem ter
      if (featureName === 'Cardápio digital personalizado') {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Erro ao verificar acesso a recurso ${featureName}:`, error);
      return false; // Em caso de erro, não conceder acesso
    }
  }

  /**
   * Obtém o número máximo permitido de produtos para o plano atual
   */
  static async getMaxProductCount(establishmentId: string): Promise<number> {
    try {
      const subscription = await this.getEstablishmentSubscription(establishmentId);
      
      if (!subscription || 
          subscription.status !== SubscriptionStatus.ACTIVE && 
          subscription.status !== SubscriptionStatus.TRIAL) {
        return 10; // Limite muito baixo para planos expirados ou cancelados
      }
      
      // Se não conseguimos obter o plano na assinatura, vamos buscá-lo
      let plan = subscription.plan;
      if (!plan) {
        plan = await this.getPlanById(subscription.planId);
      }
      
      // Com base no nome do plano, determinar o limite
      switch (plan.id) {
        case 'basic_plan':
          return 50;
        case 'professional_plan':
          return 150;
        case 'premium_plan':
          return 9999; // Praticamente ilimitado
        default:
          return 50; // Padrão
      }
    } catch (error) {
      console.error(`Erro ao obter limite de produtos:`, error);
      return 10; // Em caso de erro, definir um limite baixo
    }
  }
} 