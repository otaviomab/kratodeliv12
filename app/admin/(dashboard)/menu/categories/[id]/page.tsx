"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const isNewCategory = params.id === "new";
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
    <div className="space-y-6 p-6 bg-[#fdfaf5]">
      {/* Cabeçalho */}
      <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-4">
          <Link href="/admin/menu" className="p-2 border rounded-md hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">
            {isNewCategory ? "Nova Categoria" : "Editar Categoria"}
          </h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                className="w-full p-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                rows={3}
                className="w-full p-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Descrição da categoria"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleToggleActive}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm">
                  Categoria ativa
                </label>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-2">
            <Link
              href="/admin/menu"
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