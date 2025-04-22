import { Query } from 'appwrite';
import { databases } from '@/lib/appwrite';

/**
 * Função para verificar e atualizar automaticamente o status de abertura/fechamento
 * dos estabelecimentos com base no horário de funcionamento configurado
 */
export async function checkEstablishmentStatus() {
  try {
    // Buscar todos os estabelecimentos
    const establishments = await databases.listDocuments(
      'kratodeliv_db',
      'establishments',
      []
    );

    // Obter data e hora atual
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    
    // Extrair a hora atual (HH:MM)
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;
    
    // Processar cada estabelecimento
    for (const establishment of establishments.documents) {
      // Ignorar estabelecimentos sem horários configurados
      if (!establishment.businessHours || establishment.businessHours.length === 0) {
        continue;
      }
      
      // Verificar se o estabelecimento está marcado como fechado manualmente
      if (establishment.manualStatusOverride === true) {
        continue; // Pular este estabelecimento, pois o status foi definido manualmente
      }
      
      // Buscar as configurações do dia atual
      const todayConfig = establishment.businessHours.find(
        (config: any) => config.dayOfWeek === currentDay
      );
      
      // Verificar se o estabelecimento deve estar aberto hoje
      let shouldBeOpen = false;
      
      if (todayConfig && todayConfig.isOpen) {
        // Verificar se o horário atual está dentro do horário de funcionamento
        shouldBeOpen = currentTime >= todayConfig.openTime && currentTime <= todayConfig.closeTime;
      }
      
      // Atualizar o status apenas se for diferente do atual
      if (establishment.isOpen !== shouldBeOpen) {
        console.log(`Atualizando status do estabelecimento ${establishment.name} para ${shouldBeOpen ? 'aberto' : 'fechado'}`);
        
        await databases.updateDocument(
          'kratodeliv_db',
          'establishments',
          establishment.$id,
          { 
            isOpen: shouldBeOpen,
            // Registrar a última vez que o status foi atualizado automaticamente
            lastAutoStatusUpdate: new Date().toISOString() 
          }
        );
      }
    }
    
    console.log(`Verificação de status dos estabelecimentos concluída em ${new Date().toISOString()}`);
    return { success: true, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error("Erro ao verificar status dos estabelecimentos:", error);
    return { success: false, error: (error as Error).message };
  }
} 