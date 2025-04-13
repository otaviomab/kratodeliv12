"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock de categorias
const categories = [
  { id: "1", name: "Entradas" },
  { id: "2", name: "Pratos Principais" },
  { id: "3", name: "Sobremesas" },
  { id: "4", name: "Bebidas" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    isActive: true,
    isHighlighted: false,
    hasOptions: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name === "price") {
      // Permitir apenas números e um único ponto decimal
      const sanitized = value.replace(/[^0-9.]/g, "");
      const parts = sanitized.split(".");
      const formatted = parts.length > 1 
        ? `${parts[0]}.${parts.slice(1).join("")}` 
        : sanitized;
      
      setFormData({
        ...formData,
        [name]: formatted
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name.trim()) {
      toast.error("Nome do produto é obrigatório");
      return;
    }
    
    if (!formData.categoryId) {
      toast.error("Selecione uma categoria");
      return;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Preço deve ser um valor positivo");
      return;
    }
    
    // Simulação de envio para a API
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("Produto adicionado com sucesso!");
      setIsSubmitting(false);
      router.push("/admin/menu/products");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center space-x-2">
        <Link href="/admin/menu/products" className="p-2 rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Novo Produto</h1>
      </div>

      {/* Formulário */}
      <div className="bg-card rounded-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações básicas */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nome do Produto <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex.: Filé Mignon"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex.: Filé mignon grelhado com molho madeira"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Preço (R$) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex.: 59.90"
                  required
                />
              </div>
            </div>
            
            {/* Configurações adicionais */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Imagem do Produto
                </label>
                <div className="border-2 border-dashed rounded-md py-8 flex flex-col items-center">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Arraste uma imagem ou clique para fazer upload
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG ou WEBP (max. 5MB)
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center px-3 py-1.5 text-sm font-medium border rounded-md"
                  >
                    Escolher Arquivo
                  </button>
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm">
                    Produto ativo (visível para clientes)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isHighlighted"
                    name="isHighlighted"
                    type="checkbox"
                    checked={formData.isHighlighted}
                    onChange={handleChange}
                    className="h-4 w-4 rounded"
                  />
                  <label htmlFor="isHighlighted" className="ml-2 block text-sm">
                    Destacar produto (aparece no início da categoria)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="hasOptions"
                    name="hasOptions"
                    type="checkbox"
                    checked={formData.hasOptions}
                    onChange={handleChange}
                    className="h-4 w-4 rounded"
                  />
                  <label htmlFor="hasOptions" className="ml-2 block text-sm">
                    Produto customizável (permitir adicionais e opções)
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="pt-4 flex justify-end space-x-3">
            <Link
              href="/admin/menu/products"
              className="px-4 py-2 border rounded-md text-sm font-medium"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
            >
              {isSubmitting ? "Salvando..." : "Salvar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 