"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2, DollarSign, Info, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
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
            setPreviewImage(mockProduct.imageUrl || null);
          } else {
            // Produto novo - valor inicial
            setForm({
              name: "",
              description: "",
              price: 0,
              categoryId: mockCategories[0].id,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Formato de imagem não suportado");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setForm(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setForm(prev => ({ ...prev, imageUrl: "" }));
  };

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
    <div className="space-y-6 p-6 bg-[#fdfaf5]">
      {/* Cabeçalho */}
      <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-4">
          <Link href="/admin/menu/products" className="p-2 border rounded-md hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">
            {isNewProduct ? "Novo Produto" : "Editar Produto"}
          </h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                className="w-full p-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                className="w-full p-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                className="w-full p-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  className="w-full pl-10 p-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">
                Imagem do Produto
              </label>
              <div className="border-2 border-dashed rounded-lg p-4">
                {previewImage ? (
                  <div className="relative">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center py-6 px-4">
                    <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center mb-1">
                      Arraste uma imagem ou clique para fazer upload
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      PNG, JPG ou WEBP (max. 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-[#fcf8f2] transition-colors"
                    >
                      Escolher Arquivo
                    </button>
                  </label>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm">
                  Produto ativo
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCustomizable"
                  name="isCustomizable"
                  checked={form.isCustomizable}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="isCustomizable" className="text-sm">
                  Produto customizável
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasAdditions"
                  name="hasAdditions"
                  checked={form.hasAdditions}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="hasAdditions" className="text-sm">
                  Permitir adicionais
                </label>
              </div>
            </div>
          </div>

          {/* Seção de adicionais */}
          {form.hasAdditions && (
            <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Adicionais</h2>
                <button
                  type="button"
                  onClick={handleAddAdditional}
                  className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
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
                    <div key={additional.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={additional.name}
                          onChange={(e) => handleAdditionalChange(additional.id, 'name', e.target.value)}
                          className="w-full p-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="Nome do adicional"
                        />
                      </div>
                      <div className="w-32">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <input
                            type="number"
                            value={additional.price}
                            onChange={(e) => handleAdditionalChange(additional.id, 'price', e.target.value)}
                            className="w-full pl-10 p-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="0,00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditional(additional.id)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end gap-2">
            <Link
              href="/admin/menu/products"
              className="px-4 py-2 rounded-md text-sm font-medium bg-white dark:bg-card border border-border/10 hover:bg-muted transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 