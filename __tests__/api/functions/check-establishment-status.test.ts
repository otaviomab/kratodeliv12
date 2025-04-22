import { checkEstablishmentStatus } from '@/app/api/functions/check-establishment-status';
import { databases } from '@/lib/appwrite';

// Mock do módulo appwrite
jest.mock('@/lib/appwrite', () => ({
  databases: {
    listDocuments: jest.fn(),
    updateDocument: jest.fn(),
    getDocument: jest.fn()
  }
}));

describe('checkEstablishmentStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock da data/hora atual para ter controle nos testes
    const mockDate = new Date('2023-08-12T15:30:00Z'); // Sábado (6), 15:30
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    Date.prototype.toISOString = jest.fn(() => '2023-08-12T15:30:00.000Z');
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it('deve atualizar o status de estabelecimentos dentro do horário para aberto', async () => {
    // Configurar mock para retornar estabelecimentos
    (databases.listDocuments as jest.Mock).mockResolvedValue({
      documents: [
        {
          $id: 'est1',
          name: 'Restaurante Teste',
          isOpen: false, // Atualmente fechado
          manualStatusOverride: false,
          businessHours: [
            {
              dayOfWeek: 6, // Sábado
              openTime: '10:00',
              closeTime: '18:00',
              isOpen: true
            }
          ]
        }
      ]
    });
    
    (databases.updateDocument as jest.Mock).mockResolvedValue({
      $id: 'est1',
      isOpen: true,
      lastAutoStatusUpdate: '2023-08-12T15:30:00.000Z'
    });
    
    const result = await checkEstablishmentStatus();
    
    // Verificar se a função foi bem-sucedida
    expect(result.success).toBe(true);
    
    // Verificar se updateDocument foi chamado corretamente
    expect(databases.updateDocument).toHaveBeenCalledWith(
      'kratodeliv_db',
      'establishments',
      'est1',
      expect.objectContaining({
        isOpen: true,
        lastAutoStatusUpdate: '2023-08-12T15:30:00.000Z'
      })
    );
  });
  
  it('deve atualizar o status de estabelecimentos fora do horário para fechado', async () => {
    // Usar uma abordagem diferente para mock da data sem recursão
    const mockLaterDate = {
      getDay: () => 6, // Sábado
      getHours: () => 19,
      getMinutes: () => 30,
      toISOString: () => '2023-08-12T19:30:00.000Z'
    } as any;
    
    jest.spyOn(global, 'Date').mockImplementation(() => mockLaterDate);
    
    // Configurar o string de horário para comparação
    const currentHour = '19';
    const currentMinute = '30';
    const currentTime = `${currentHour}:${currentMinute}`;
    
    (databases.listDocuments as jest.Mock).mockResolvedValue({
      documents: [
        {
          $id: 'est1',
          name: 'Restaurante Teste',
          isOpen: true, // Atualmente aberto
          manualStatusOverride: false,
          businessHours: [
            {
              dayOfWeek: 6, // Sábado
              openTime: '10:00',
              closeTime: '18:00',
              isOpen: true
            }
          ]
        }
      ]
    });
    
    (databases.updateDocument as jest.Mock).mockResolvedValue({
      $id: 'est1',
      isOpen: false,
      lastAutoStatusUpdate: '2023-08-12T19:30:00.000Z'
    });
    
    const result = await checkEstablishmentStatus();
    
    // Verificar se a função foi bem-sucedida
    expect(result.success).toBe(true);
    
    // Verificar se updateDocument foi chamado corretamente
    expect(databases.updateDocument).toHaveBeenCalledWith(
      'kratodeliv_db',
      'establishments',
      'est1',
      expect.objectContaining({
        isOpen: false,
        lastAutoStatusUpdate: '2023-08-12T19:30:00.000Z'
      })
    );
  });
  
  it('não deve atualizar estabelecimentos com override manual', async () => {
    (databases.listDocuments as jest.Mock).mockResolvedValue({
      documents: [
        {
          $id: 'est1',
          name: 'Restaurante Teste',
          isOpen: false, // Atualmente fechado apesar de estar no horário
          manualStatusOverride: true, // Marcado manualmente
          businessHours: [
            {
              dayOfWeek: 6, // Sábado
              openTime: '10:00',
              closeTime: '18:00',
              isOpen: true
            }
          ]
        }
      ]
    });
    
    const result = await checkEstablishmentStatus();
    
    // Verificar se a função foi bem-sucedida
    expect(result.success).toBe(true);
    
    // Verificar que updateDocument não foi chamado (não deve alterar o status)
    expect(databases.updateDocument).not.toHaveBeenCalled();
  });
  
  it('deve ignorar estabelecimentos sem horários configurados', async () => {
    (databases.listDocuments as jest.Mock).mockResolvedValue({
      documents: [
        {
          $id: 'est1',
          name: 'Restaurante Sem Horário',
          isOpen: true,
          businessHours: [] // Sem horários configurados
        }
      ]
    });
    
    const result = await checkEstablishmentStatus();
    
    // Verificar se a função foi bem-sucedida
    expect(result.success).toBe(true);
    
    // Verificar que updateDocument não foi chamado
    expect(databases.updateDocument).not.toHaveBeenCalled();
  });
  
  it('deve retornar erro em caso de falha na API', async () => {
    (databases.listDocuments as jest.Mock).mockRejectedValue(new Error('Erro de API'));
    
    const result = await checkEstablishmentStatus();
    
    // Verificar que falhou
    expect(result.success).toBe(false);
    expect(result.error).toBe('Erro de API');
  });
}); 