"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2, DollarSign, Info } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface Additional {
  id: string;
  name: string;
  price: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
  isCustomizable: boolean;
  hasAdditions: boolean;
  additionals: Additional[];
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const isNewProduct = params.id === "new";
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Estado do formulário
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    imageUrl: "",
    isActive: true,
    isCustomizable: false,
    hasAdditions: false,
    additionals: []
  });

  // Carrega dados simulados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulação de carregamento de dados
        setTimeout(() => {
          // Categorias disponíveis
          const mockCategories: Category[] = [
            { id: "1", name: "Entradas" },
            { id: "2", name: "Pratos Principais" },
            { id: "3", name: "Sobremesas" },
            { id: "4", name: "Bebidas" },
            { id: "5", name: "Cervejas" },
            { id: "6", name: "Drinks" },
          ];
          setCategories(mockCategories);
          
          // Se for edição de produto existente
          if (!isNewProduct) {
            // Produto existente (simulação baseada no ID)
            let mockProduct;
            switch(params.id) {
              case "1":
                mockProduct = {
                  name: "Batata Frita",
                  description: "Porção de batata frita crocante",
                  price: 25.90,
                  categoryId: "1",
                  imageUrl: "/images/products/fries.jpg",
                  isActive: true,
                  isCustomizable: false,
                  hasAdditions: true,
                  additionals: [
                    { id: "1", name: "Cheddar", price: 5.0 },
                    { id: "2", name: "Bacon", price: 6.0 }
                  ]
                };
                break;
              case "2":
                mockProduct = {
                  name: "Camarão Empanado",
                  description: "Camarões empanados servidos com molho",
                  price: 45.90,
                  categoryId: "1",
                  imageUrl: "/images/products/shrimp.jpg",
                  isActive: true,
                  isCustomizable: false,
                  hasAdditions: true,
                  additionals: [
                    { id: "1", name: "Molho extra", price: 3.0 }
                  ]
                };
                break;
              default:
                mockProduct = {
                  name: "Produto Exemplo",
                  description: "Descrição do produto exemplo",
                  price: 29.90,
                  categoryId: "1",
                  imageUrl: "",
                  isActive: true,
                  isCustomizable: false,
                  hasAdditions: false,
                  additionals: []
                };
            }
            setForm(mockProduct);
          } else {
            // Produto novo - valor inicial
            setForm({
              name: "",
              description: "",
              price: 0,
              categoryId: mockCategories[0].id, // Seleciona primeira categoria por padrão
              imageUrl: "",
              isActive: true,
              isCustomizable: false,
              hasAdditions: false,
              additionals: []
            });
          }
          
          setIsLoading(false);
        }, 800);
      } catch {
        toast.error("Erro ao carregar dados");
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.id, isNewProduct]);

  // Manipuladores de formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddAdditional = () => {
    const newAdditional: Additional = {
      id: Date.now().toString(),
      name: "",
      price: 0
    };
    
    setForm(prev => ({
      ...prev,
      additionals: [...prev.additionals, newAdditional],
      hasAdditions: true // Ativa automaticamente se adicionar um adicional
    }));
  };

  const handleRemoveAdditional = (id: string) => {
    setForm(prev => ({
      ...prev,
      additionals: prev.additionals.filter(add => add.id !== id)
    }));
  };

  const handleAdditionalChange = (id: string, field: keyof Additional, value: string | number) => {
    setForm(prev => ({
      ...prev,
      additionals: prev.additionals.map(add => 
        add.id === id ? { ...add, [field]: field === 'price' ? parseFloat(value as string) || 0 : value } : add
      )
    }));
  };

  // Salvar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!form.name.trim()) {
      toast.error("O nome do produto é obrigatório");
      return;
    }
    
    if (!form.categoryId) {
      toast.error("Selecione uma categoria");
      return;
    }
    
    if (form.price <= 0) {
      toast.error("O preço deve ser maior que zero");
      return;
    }
    
    // Verifica se todos os adicionais têm nome e preço
    if (form.hasAdditions && form.additionals.length > 0) {
      const invalidAdditions = form.additionals.some(add => !add.name.trim() || add.price <= 0);
      if (invalidAdditions) {
        toast.error("Todos os adicionais devem ter nome e preço válido");
        return;
      }
    }
    
    setIsSaving(true);
    
    try {
      // Simulação de salvamento
      setTimeout(() => {
        setIsSaving(false);
        toast.success(isNewProduct ? "Produto criado com sucesso" : "Produto atualizado com sucesso");
        
        // Redireciona para a lista após criar um novo produto
        if (isNewProduct) {
          window.location.href = "/admin/menu/products";
        }
      }, 1000);
    } catch {
      toast.error("Erro ao salvar produto");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Link href="/admin/menu/products" className="p-2 border rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">
          {isNewProduct ? "Novo Produto" : "Editar Produto"}
        </h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Nome do produto"
                required
              />
            </div>
            
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
                Categoria *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded-md"
                placeholder="Descrição do produto"
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Preço *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border rounded-md"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                URL da Imagem
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6 mt-6">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleCheckboxChange}
                />
                <div
                  className={`block w-10 h-6 rounded-full transition ${
                    form.isActive ? "bg-green-400" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                    form.isActive ? "translate-x-4" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium">
                Status: {form.isActive ? "Ativo" : "Inativo"}
              </span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                name="isCustomizable"
                checked={form.isCustomizable}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2 text-sm">Produto customizável</span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                name="hasAdditions"
                checked={form.hasAdditions}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2 text-sm">Possui adicionais</span>
            </label>
          </div>
        </div>
        
        {/* Seção de adicionais */}
        {form.hasAdditions && (
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Adicionais</h2>
              <button
                type="button"
                onClick={handleAddAdditional}
                className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </button>
            </div>
            
            {form.additionals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center bg-muted/20 rounded-md">
                <Info className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Clique em "Adicionar" para incluir adicionais ao produto</p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.additionals.map((additional) => (
                  <div key={additional.id} className="flex items-center space-x-3 bg-muted/20 p-3 rounded-md">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Nome do adicional"
                        value={additional.name}
                        onChange={(e) => handleAdditionalChange(additional.id, 'name', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="w-32">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                          type="number"
                          placeholder="0,00"
                          value={additional.price}
                          onChange={(e) => handleAdditionalChange(additional.id, 'price', e.target.value)}
                          className="w-full pl-10 p-2 border rounded-md"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditional(additional.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <Link
            href="/admin/menu/products"
            className="px-4 py-2 border rounded-md text-sm"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 