import { PATCH } from '@/app/api/establishment/[identifier]/manual-status/route';
import { databases } from '@/lib/appwrite';
import { NextResponse } from 'next/server';

// Mock do módulo appwrite
jest.mock('@/lib/appwrite', () => ({
  databases: {
    getDocument: jest.fn(),
    updateDocument: jest.fn()
  }
}));

describe('API Endpoint - Atualização Manual de Status do Estabelecimento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock da data/hora atual para ter controle nos testes
    const mockDate = new Date('2023-08-12T15:30:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it('deve atualizar o status manual corretamente', async () => {
    // Mock do database.getDocument para retornar um estabelecimento
    (databases.getDocument as jest.Mock).mockResolvedValue({
      $id: 'est1',
      name: 'Restaurante Teste',
      isOpen: false
    });
    
    // Mock do database.updateDocument para retornar o estabelecimento atualizado
    (databases.updateDocument as jest.Mock).mockResolvedValue({
      $id: 'est1',
      isOpen: true,
      manualStatusOverride: true,
      lastManualStatusUpdate: '2023-08-12T15:30:00.000Z'
    });
    
    // Criar uma requisição mock
    const request = new Request('http://localhost:3000/api/establishment/est1/manual-status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isOpen: true
      })
    });
    
    // Chamar o endpoint
    await PATCH(request, { params: { identifier: 'est1' } });
    
    // Verificar se getDocument foi chamado para verificar a existência
    expect(databases.getDocument).toHaveBeenCalledWith(
      'kratodeliv_db',
      'establishments',
      'est1'
    );
    
    // Verificar se updateDocument foi chamado corretamente
    expect(databases.updateDocument).toHaveBeenCalledWith(
      'kratodeliv_db',
      'establishments',
      'est1',
      {
        isOpen: true,
        manualStatusOverride: true,
        lastManualStatusUpdate: '2023-08-12T15:30:00.000Z'
      }
    );
    
    // Verificar se a resposta é a esperada
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
      establishment: {
        id: 'est1',
        isOpen: true,
        manualStatusOverride: true,
        lastManualStatusUpdate: '2023-08-12T15:30:00.000Z'
      }
    });
  });
  
  it('deve permitir desativar o override', async () => {
    // Mock do database.getDocument para retornar um estabelecimento
    (databases.getDocument as jest.Mock).mockResolvedValue({
      $id: 'est1',
      name: 'Restaurante Teste',
      isOpen: true
    });
    
    // Mock do database.updateDocument para retornar o estabelecimento atualizado
    (databases.updateDocument as jest.Mock).mockResolvedValue({
      $id: 'est1',
      isOpen: false,
      manualStatusOverride: false,
      lastManualStatusUpdate: '2023-08-12T15:30:00.000Z'
    });
    
    // Criar uma requisição mock com override = false
    const request = new Request('http://localhost:3000/api/establishment/est1/manual-status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isOpen: false,
        override: false
      })
    });
    
    // Chamar o endpoint
    await PATCH(request, { params: { identifier: 'est1' } });
    
    // Verificar se updateDocument foi chamado corretamente
    expect(databases.updateDocument).toHaveBeenCalledWith(
      'kratodeliv_db',
      'establishments',
      'est1',
      {
        isOpen: false,
        manualStatusOverride: false,
        lastManualStatusUpdate: '2023-08-12T15:30:00.000Z'
      }
    );
  });
  
  it('deve retornar erro quando o ID não é fornecido', async () => {
    const request = new Request('http://localhost:3000/api/establishment/manual-status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isOpen: true
      })
    });
    
    // Chamar o endpoint com ID vazio
    await PATCH(request, { params: { identifier: '' } });
    
    // Verificar resposta de erro
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "ID do estabelecimento não fornecido" },
      { status: 400 }
    );
  });
  
  it('deve retornar erro quando isOpen não é fornecido', async () => {
    const request = new Request('http://localhost:3000/api/establishment/est1/manual-status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // Sem o campo isOpen
    });
    
    // Chamar o endpoint
    await PATCH(request, { params: { identifier: 'est1' } });
    
    // Verificar resposta de erro
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Status (isOpen) não fornecido" },
      { status: 400 }
    );
  });
  
  it('deve retornar erro quando o estabelecimento não existe', async () => {
    // Mock para simular estabelecimento não encontrado
    (databases.getDocument as jest.Mock).mockRejectedValue(new Error('Document not found'));
    
    const request = new Request('http://localhost:3000/api/establishment/est999/manual-status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isOpen: true
      })
    });
    
    // Chamar o endpoint
    await PATCH(request, { params: { identifier: 'est999' } });
    
    // Verificar resposta de erro
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Estabelecimento não encontrado" },
      { status: 404 }
    );
  });
  
  it('deve tratar erros internos corretamente', async () => {
    // Mock para passar na verificação de existência
    (databases.getDocument as jest.Mock).mockResolvedValue({
      $id: 'est1',
      name: 'Restaurante Teste'
    });
    
    // Mock para falhar na atualização
    (databases.updateDocument as jest.Mock).mockRejectedValue(new Error('Erro de banco de dados'));
    
    const request = new Request('http://localhost:3000/api/establishment/est1/manual-status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isOpen: true
      })
    });
    
    // Chamar o endpoint
    await PATCH(request, { params: { identifier: 'est1' } });
    
    // Verificar resposta de erro
    expect(NextResponse.json).toHaveBeenCalledWith(
      { 
        error: "Erro ao atualizar status do estabelecimento", 
        details: "Erro de banco de dados" 
      },
      { status: 500 }
    );
  });
}); 