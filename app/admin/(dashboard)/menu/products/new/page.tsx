"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
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
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
            >
              {isSubmitting ? "Salvando..." : "Salvar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 