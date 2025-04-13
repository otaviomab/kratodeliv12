"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true
  });

  // Carrega dados simulados
  useEffect(() => {
    const loadCategory = async () => {
      setIsLoading(true);
      try {
        // Simulação de carregamento de dados
        setTimeout(() => {
          // Mock de uma categoria baseada no ID da URL
          const mockCategory: Category = {
            id: params.id,
            name: params.id === "1" ? "Entradas" : 
                 params.id === "2" ? "Pratos Principais" : 
                 params.id === "3" ? "Sobremesas" : 
                 params.id === "4" ? "Bebidas" : 
                 params.id === "5" ? "Cervejas" : "Drinks",
            description: params.id === "1" ? "Aperitivos e entradas" :
                        params.id === "2" ? "Pratos principais e executivos" :
                        params.id === "3" ? "Doces e sobremesas" :
                        params.id === "4" ? "Bebidas não alcoólicas" :
                        params.id === "5" ? "Cervejas nacionais e importadas" : "Drinks e coquetéis",
            isActive: params.id !== "5" // Todas ativas exceto "Cervejas"
          };
          
          setCategory(mockCategory);
          setForm({
            name: mockCategory.name,
            description: mockCategory.description || "",
            isActive: mockCategory.isActive
          });
          setIsLoading(false);
        }, 800);
      } catch {
        toast.error("Erro ao carregar dados da categoria");
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [params.id]);

  // Atualiza o estado do formulário quando os campos mudam
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Alterna o status de ativo/inativo
  const handleToggleActive = () => {
    setForm(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  // Salva as alterações
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error("O nome da categoria é obrigatório");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulação de salvamento
      setTimeout(() => {
        setIsSaving(false);
        toast.success("Categoria atualizada com sucesso");
        // Atualizaria o estado da categoria com os novos dados em um ambiente real
        setCategory({
          id: params.id,
          name: form.name,
          description: form.description,
          isActive: form.isActive
        });
      }, 1000);
    } catch {
      toast.error("Erro ao salvar categoria");
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

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Categoria não encontrada</h2>
        <p className="text-muted-foreground mb-6">A categoria solicitada não está disponível.</p>
        <Link href="/admin/menu" className="inline-flex items-center px-4 py-2 border rounded-md">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o Cardápio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Link href="/admin/menu" className="p-2 border rounded-md hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Editar Categoria</h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-lg border p-6">
          <div className="grid grid-cols-1 gap-6">
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
                placeholder="Nome da categoria"
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
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border rounded-md"
                placeholder="Descrição da categoria (opcional)"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.isActive}
                    onChange={handleToggleActive}
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
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Link
            href="/admin/menu"
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