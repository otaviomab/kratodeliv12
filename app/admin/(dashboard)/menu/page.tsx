"use client";

import { useState, useEffect } from "react";
import { Plus, Search, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  productCount: number;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  // Carrega dados simulados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulação de carregamento de dados
        setTimeout(() => {
          const mockCategories: Category[] = [
            { id: "1", name: "Entradas", description: "Aperitivos e entradas", isActive: true, productCount: 8 },
            { id: "2", name: "Pratos Principais", description: "Pratos principais e executivos", isActive: true, productCount: 12 },
            { id: "3", name: "Sobremesas", description: "Doces e sobremesas", isActive: true, productCount: 6 },
            { id: "4", name: "Bebidas", description: "Bebidas não alcoólicas", isActive: true, productCount: 10 },
            { id: "5", name: "Cervejas", description: "Cervejas nacionais e importadas", isActive: false, productCount: 5 },
            { id: "6", name: "Drinks", description: "Drinks e coquetéis", isActive: true, productCount: 7 },
          ];
          setCategories(mockCategories);
          setIsLoading(false);
        }, 800);
      } catch {
        toast.error("Erro ao carregar categorias");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtra categorias com base na busca
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Lidar com a abertura do modal de exclusão
  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
  };

  // Confirmar exclusão de categoria
  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete));
      toast.success("Categoria excluída com sucesso");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  // Lidar com a adição de nova categoria
  const handleAddCategory = () => {
    if (newCategory.name.trim() === "") {
      toast.error("O nome da categoria é obrigatório");
      return;
    }

    const newCategoryItem: Category = {
      id: Math.random().toString(36).substring(2, 9),
      name: newCategory.name,
      description: newCategory.description,
      isActive: true,
      productCount: 0
    };

    setCategories([...categories, newCategoryItem]);
    setNewCategory({ name: "", description: "" });
    setShowAddModal(false);
    toast.success("Categoria adicionada com sucesso");
  };

  // Alternar status de ativação da categoria
  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(
      categories.map(cat => 
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      toast.success(`Categoria ${category.isActive ? 'desativada' : 'ativada'} com sucesso`);
    }
  };

  // Atualizar dados
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulação de atualização
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Dados atualizados");
    }, 800);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Cardápio</h1>
            <span className="text-sm text-muted-foreground">
              {filteredCategories.length} categorias
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              className="flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-white dark:bg-card border border-border/10 hover:bg-muted transition-colors"
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </button>
          </div>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Lista de categorias */}
      <div className="bg-white dark:bg-card rounded-lg border border-border/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/10">
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Descrição</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Produtos</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#fdfaf5] dark:hover:bg-card/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {category.description || "Sem descrição"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{category.productCount} produtos</div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {category.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleCategoryStatus(category.id)}
                          className="text-sm px-3 py-1.5 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                        >
                          {category.isActive ? 'Desativar' : 'Ativar'}
                        </button>
                        <Link
                          href={`/admin/menu/${category.id}`}
                          className="text-sm px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Ver produtos
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(category.id)}
                          className="text-sm px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-card rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirmar exclusão</h2>
            <p className="text-muted-foreground mb-6">
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md text-sm font-medium bg-white dark:bg-card border border-border/10 hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de adicionar categoria */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-card rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Nova Categoria</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Nome da categoria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Descrição da categoria"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-md text-sm font-medium bg-white dark:bg-card border border-border/10 hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 