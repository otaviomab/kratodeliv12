"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Store, Pizza, Utensils, Coffee, IceCream, Settings } from "lucide-react";

const tiposEstabelecimento = [
  {
    id: "pizzaria",
    nome: "Pizzaria",
    descricao: "Especializado em pizzas com opções de tamanhos e sabores",
    icon: Pizza,
    configuracoes: {
      tamanhos: ["4 Fatias", "6 Fatias", "8 Fatias", "12 Fatias"],
      opcoes: ["Meio a Meio", "Borda Recheada"],
      extras: [],
      modeloProduto: {
        tamanhos: true,
        meioAMeio: true,
        bordas: true,
        extras: true
      }
    }
  },
  {
    id: "hamburgueria",
    nome: "Hamburgueria",
    descricao: "Lanches, hambúrgueres e combos",
    icon: Store,
    configuracoes: {
      pontoCarne: ["Mal Passado", "Ao Ponto", "Bem Passado"],
      paes: ["Brioche", "Australiano", "Tradicional"],
      extras: [],
      modeloProduto: {
        pontoCarne: true,
        paes: true,
        extras: true,
        combos: true
      }
    }
  },
  {
    id: "marmitaria",
    nome: "Marmitaria",
    descricao: "Marmitas em diferentes tamanhos com opções de misturas",
    icon: Utensils,
    configuracoes: {
      tamanhos: ["P", "M", "G"],
      proteinas: ["1 Mistura", "2 Misturas", "3 Misturas"],
      complementos: [],
      modeloProduto: {
        tamanhos: true,
        proteinas: true,
        complementos: true,
        quantidadeComplementos: true
      }
    }
  },
  {
    id: "cafeteria",
    nome: "Cafeteria",
    descricao: "Cafés, bebidas e lanches rápidos",
    icon: Coffee,
    configuracoes: {
      tamanhos: ["Pequeno", "Médio", "Grande"],
      temperaturas: ["Quente", "Gelado"],
      extras: [],
      modeloProduto: {
        tamanhos: true,
        temperaturas: true,
        extras: true,
        combos: true
      }
    }
  },
  {
    id: "acai",
    nome: "Açaí",
    descricao: "Açaí, sorvetes e sobremesas geladas",
    icon: IceCream,
    configuracoes: {
      tamanhos: ["300ml", "500ml", "700ml"],
      complementos: [],
      coberturas: [],
      modeloProduto: {
        tamanhos: true,
        complementos: true,
        coberturas: true,
        limitesComplementos: true
      }
    }
  },
  {
    id: "personalizado",
    nome: "Personalizado",
    descricao: "Crie seu próprio modelo de estabelecimento com configurações personalizadas",
    icon: Settings,
    configuracoes: {
      modeloProduto: {}
    }
  }
];

export default function TipoEstabelecimentoPage() {
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [configuracaoPersonalizada, setConfiguracaoPersonalizada] = useState({
    secoes: [
      {
        id: '1',
        nome: 'Nova Seção',
        opcoes: [{
          nome: '',
          preco: ''
        }]
      }
    ],
    modeloProduto: {
      limitesPersonalizados: true
    }
  });
  const [extrasEditaveis, setExtrasEditaveis] = useState<{[key: string]: {nome: string, preco: string}[]}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTipoSelect = (tipoId: string) => {
    setTipoSelecionado(tipoId);
  };

  const handleSave = async () => {
    if (!tipoSelecionado) {
      toast.error("Selecione um tipo de estabelecimento");
      return;
    }

    setIsSubmitting(true);
    // Simulação de salvamento
    setTimeout(() => {
      toast.success("Tipo de estabelecimento salvo com sucesso!");
      setIsSubmitting(false);
    }, 1000);
  };

  const tipoAtual = tiposEstabelecimento.find(tipo => tipo.id === tipoSelecionado);

  const adicionarSecao = () => {
    setConfiguracaoPersonalizada(prev => ({
      ...prev,
      secoes: [...prev.secoes, {
        id: Date.now().toString(),
        nome: 'Nova Seção',
        opcoes: [{
          nome: '',
          preco: ''
        }]
      }]
    }));
  };

  const removerSecao = (id: string) => {
    setConfiguracaoPersonalizada(prev => ({
      ...prev,
      secoes: prev.secoes.filter(secao => secao.id !== id)
    }));
  };

  const atualizarNomeSecao = (id: string, novoNome: string) => {
    setConfiguracaoPersonalizada(prev => ({
      ...prev,
      secoes: prev.secoes.map(secao => 
        secao.id === id ? { ...secao, nome: novoNome } : secao
      )
    }));
  };

  const adicionarOpcao = (secaoId: string) => {
    setConfiguracaoPersonalizada(prev => ({
      ...prev,
      secoes: prev.secoes.map(secao => 
        secao.id === secaoId 
          ? { ...secao, opcoes: [...secao.opcoes, { nome: '', preco: '' }] }
          : secao
      )
    }));
  };

  const removerOpcao = (secaoId: string, opcaoIndex: number) => {
    setConfiguracaoPersonalizada(prev => ({
      ...prev,
      secoes: prev.secoes.map(secao => 
        secao.id === secaoId 
          ? { ...secao, opcoes: secao.opcoes.filter((_, i) => i !== opcaoIndex) }
          : secao
      )
    }));
  };

  const atualizarOpcao = (secaoId: string, opcaoIndex: number, campo: 'nome' | 'preco', novoValor: string) => {
    setConfiguracaoPersonalizada(prev => ({
      ...prev,
      secoes: prev.secoes.map(secao => 
        secao.id === secaoId 
          ? {
              ...secao,
              opcoes: secao.opcoes.map((opcao, i) => 
                i === opcaoIndex ? { ...opcao, [campo]: novoValor } : opcao
              )
            }
          : secao
      )
    }));
  };

  const adicionarExtra = (tipo: string) => {
    setExtrasEditaveis(prev => ({
      ...prev,
      [tipo]: [...(prev[tipo] || []), { nome: '', preco: '' }]
    }));
  };

  const removerExtra = (tipo: string, index: number) => {
    setExtrasEditaveis(prev => ({
      ...prev,
      [tipo]: prev[tipo].filter((_, i) => i !== index)
    }));
  };

  const atualizarExtra = (tipo: string, index: number, campo: 'nome' | 'preco', valor: string) => {
    setExtrasEditaveis(prev => ({
      ...prev,
      [tipo]: prev[tipo].map((extra, i) => 
        i === index ? { ...extra, [campo]: valor } : extra
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Store className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Tipo de Estabelecimento</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiposEstabelecimento.map((tipo) => {
          const isSelected = tipo.id === tipoSelecionado;
          const Icon = tipo.icon;

          return (
            <button
              key={tipo.id}
              onClick={() => handleTipoSelect(tipo.id)}
              className={`p-6 rounded-lg border text-left transition-all ${
                isSelected 
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                  : "border-border/10 hover:border-primary/20 hover:bg-[#fcf8f2]"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`h-8 w-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="text-lg font-medium">{tipo.nome}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{tipo.descricao}</p>
            </button>
          );
        })}
      </div>

      {tipoAtual && (
        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-lg border border-border/10 p-6">
            <h2 className="text-lg font-medium mb-4">Configurações Disponíveis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tamanhos */}
              {tipoAtual.configuracoes.tamanhos && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Tamanhos Disponíveis</h3>
                    <button
                      onClick={() => adicionarExtra('tamanhos')}
                      className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                    >
                      Adicionar Tamanho
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tipoAtual.configuracoes.tamanhos.map((tamanho, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`tamanho-${index}`}
                          defaultChecked
                          className="rounded"
                        />
                        <label htmlFor={`tamanho-${index}`} className="ml-2 text-sm">
                          {tamanho}
                        </label>
                      </div>
                    ))}
                    {extrasEditaveis['tamanhos']?.map((extra, index) => (
                      <div key={`extra-${index}`} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={extra.nome}
                          onChange={(e) => atualizarExtra('tamanhos', index, 'nome', e.target.value)}
                          placeholder="Digite o tamanho"
                          className="flex-1 px-2 py-1 text-sm border rounded"
                        />
                        <input
                          type="number"
                          value={extra.preco}
                          onChange={(e) => atualizarExtra('tamanhos', index, 'preco', e.target.value)}
                          placeholder="R$ 0,00"
                          className="w-24 px-2 py-1 text-sm border rounded"
                          min="0"
                          step="0.01"
                        />
                        <button
                          onClick={() => removerExtra('tamanhos', index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <span className="sr-only">Remover</span>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras/Complementos */}
              {tipoAtual.configuracoes.extras && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Extras Disponíveis</h3>
                    <button
                      onClick={() => adicionarExtra('extras')}
                      className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                    >
                      Adicionar Extra
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tipoAtual.configuracoes.extras.map((extra, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`extra-${index}`}
                          defaultChecked
                          className="rounded"
                        />
                        <label htmlFor={`extra-${index}`} className="ml-2 text-sm">
                          {extra}
                        </label>
                      </div>
                    ))}
                    {extrasEditaveis['extras']?.map((extra, index) => (
                      <div key={`extra-${index}`} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={extra.nome}
                          onChange={(e) => atualizarExtra('extras', index, 'nome', e.target.value)}
                          placeholder="Digite o extra"
                          className="flex-1 px-2 py-1 text-sm border rounded"
                        />
                        <input
                          type="number"
                          value={extra.preco}
                          onChange={(e) => atualizarExtra('extras', index, 'preco', e.target.value)}
                          placeholder="R$ 0,00"
                          className="w-24 px-2 py-1 text-sm border rounded"
                          min="0"
                          step="0.01"
                        />
                        <button
                          onClick={() => removerExtra('extras', index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <span className="sr-only">Remover</span>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opções Específicas */}
              {tipoAtual.configuracoes.opcoes && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Opções Especiais</h3>
                    <button
                      onClick={() => adicionarExtra('opcoes')}
                      className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                    >
                      Adicionar Opção
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tipoAtual.configuracoes.opcoes.map((opcao, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`opcao-${index}`}
                          defaultChecked
                          className="rounded"
                        />
                        <label htmlFor={`opcao-${index}`} className="ml-2 text-sm">
                          {opcao}
                        </label>
                      </div>
                    ))}
                    {extrasEditaveis['opcoes']?.map((extra, index) => (
                      <div key={`extra-${index}`} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={extra.nome}
                          onChange={(e) => atualizarExtra('opcoes', index, 'nome', e.target.value)}
                          placeholder="Digite a opção"
                          className="flex-1 px-2 py-1 text-sm border rounded"
                        />
                        <input
                          type="number"
                          value={extra.preco}
                          onChange={(e) => atualizarExtra('opcoes', index, 'preco', e.target.value)}
                          placeholder="R$ 0,00"
                          className="w-24 px-2 py-1 text-sm border rounded"
                          min="0"
                          step="0.01"
                        />
                        <button
                          onClick={() => removerExtra('opcoes', index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <span className="sr-only">Remover</span>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Configurações do Modelo de Produto */}
              <div>
                <h3 className="text-sm font-medium mb-2">Funcionalidades do Produto</h3>
                <div className="space-y-2">
                  {Object.entries(tipoAtual.configuracoes.modeloProduto).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`modelo-${key}`}
                        defaultChecked={value}
                        className="rounded"
                      />
                      <label htmlFor={`modelo-${key}`} className="ml-2 text-sm">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Salvando..." : "Salvar Configurações"}
            </button>
          </div>
        </div>
      )}

      {tipoSelecionado === 'personalizado' && (
        <div className="bg-white rounded-lg border border-border/10 p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Configurações Personalizadas</h2>
            <button
              onClick={adicionarSecao}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Adicionar Nova Seção
            </button>
          </div>
          
          {configuracaoPersonalizada.secoes.map((secao) => (
            <div key={secao.id} className="mb-8 p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={secao.nome}
                  onChange={(e) => atualizarNomeSecao(secao.id, e.target.value)}
                  placeholder="Nome da Seção"
                  className="text-lg font-medium bg-transparent border-b border-border/10 focus:border-primary outline-none px-2 py-1"
                />
                <button
                  onClick={() => removerSecao(secao.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remover Seção
                </button>
              </div>

              <div className="space-y-2">
                {secao.opcoes.map((opcao, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opcao.nome}
                      onChange={(e) => atualizarOpcao(secao.id, index, 'nome', e.target.value)}
                      placeholder="Digite uma opção"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <input
                      type="number"
                      value={opcao.preco}
                      onChange={(e) => atualizarOpcao(secao.id, index, 'preco', e.target.value)}
                      placeholder="R$ 0,00 (opcional)"
                      className="w-32 px-3 py-2 border rounded-md"
                      min="0"
                      step="0.01"
                    />
                    <button
                      onClick={() => removerOpcao(secao.id, index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remover
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => adicionarOpcao(secao.id)}
                  className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20"
                >
                  Adicionar Opção
                </button>
              </div>
            </div>
          ))}

          {/* Configurações do Modelo de Produto */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-4">Configurações do Modelo de Produto</h3>
            <div className="space-y-2">
              {Object.entries(configuracaoPersonalizada.modeloProduto).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`modelo-${key}`}
                    checked={value}
                    onChange={(e) => setConfiguracaoPersonalizada(prev => ({
                      ...prev,
                      modeloProduto: {
                        ...prev.modeloProduto,
                        [key]: e.target.checked
                      }
                    }))}
                    className="rounded"
                  />
                  <label htmlFor={`modelo-${key}`} className="ml-2 text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 