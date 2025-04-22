import { GET } from '@/app/api/cron/establishment-status/route';
import { checkEstablishmentStatus } from '@/app/api/functions/check-establishment-status';
import { NextResponse } from 'next/server';

// Mock da função checkEstablishmentStatus
jest.mock('@/app/api/functions/check-establishment-status', () => ({
  checkEstablishmentStatus: jest.fn()
}));

describe('API Endpoint - Cron Job de Status do Estabelecimento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Remover qualquer token de ambiente para os testes padrão
    delete process.env.CRON_SECRET_TOKEN;
  });
  
  it('deve retornar sucesso quando o processamento é bem-sucedido', async () => {
    // Configurar o mock para retornar sucesso
    (checkEstablishmentStatus as jest.Mock).mockResolvedValue({
      success: true,
      timestamp: '2023-08-12T15:30:00Z'
    });
    
    // Simular uma requisição
    const request = new Request('http://localhost:3000/api/cron/establishment-status');
    
    // Chamar o endpoint
    const response = await GET(request);
    
    // Verificar se o endpoint chamou a função correta
    expect(checkEstablishmentStatus).toHaveBeenCalled();
    
    // Verificar se a resposta é a esperada
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Status dos estabelecimentos atualizado com sucesso',
      timestamp: '2023-08-12T15:30:00Z'
    });
  });
  
  it('deve retornar erro quando o processamento falha', async () => {
    // Configurar o mock para retornar erro
    (checkEstablishmentStatus as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Erro ao processar'
    });
    
    // Simular uma requisição
    const request = new Request('http://localhost:3000/api/cron/establishment-status');
    
    // Chamar o endpoint
    const response = await GET(request);
    
    // Verificar se o endpoint chamou a função correta
    expect(checkEstablishmentStatus).toHaveBeenCalled();
    
    // Verificar se a resposta é a esperada
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Erro ao atualizar status dos estabelecimentos',
        error: 'Erro ao processar'
      },
      { status: 500 }
    );
  });
  
  it('deve verificar o token de autorização quando CRON_SECRET_TOKEN está definido', async () => {
    // Definir um token para o teste
    process.env.CRON_SECRET_TOKEN = 'test-token-123';
    
    // Requisição sem token
    const requestWithoutToken = new Request('http://localhost:3000/api/cron/establishment-status');
    await GET(requestWithoutToken);
    
    // Verificar resposta de não autorizado
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Não autorizado' }, { status: 401 });
    
    // Limpar o mock
    jest.clearAllMocks();
    
    // Requisição com token correto
    const requestWithToken = new Request('http://localhost:3000/api/cron/establishment-status', {
      headers: {
        authorization: 'Bearer test-token-123'
      }
    });
    
    // Configurar o mock para retornar sucesso
    (checkEstablishmentStatus as jest.Mock).mockResolvedValue({
      success: true,
      timestamp: '2023-08-12T15:30:00Z'
    });
    
    await GET(requestWithToken);
    
    // Verificar que a função foi chamada (passou na autenticação)
    expect(checkEstablishmentStatus).toHaveBeenCalled();
    
    // Limpar o ambiente para não afetar outros testes
    delete process.env.CRON_SECRET_TOKEN;
  });
  
  it('deve capturar e tratar exceções internas', async () => {
    // Remover qualquer token de ambiente para este teste
    delete process.env.CRON_SECRET_TOKEN;
    
    // Mock para lançar um erro
    (checkEstablishmentStatus as jest.Mock).mockRejectedValue(new Error('Erro interno'));
    
    // Simular uma requisição
    const request = new Request('http://localhost:3000/api/cron/establishment-status');
    
    // Chamar o endpoint
    await GET(request);
    
    // Verificar se a resposta de erro é a esperada
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Erro interno no servidor',
        error: 'Erro interno'
      },
      { status: 500 }
    );
  });
}); 