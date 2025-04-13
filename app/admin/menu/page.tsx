"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, ChevronRight, RefreshCcw } from "lucide-react";
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
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Cardápio</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            className="p-2 border rounded-md"
            disabled={isLoading}
          >
            <RefreshCcw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar categorias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-md"
        />
      </div>

      {/* Lista de categorias */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Produtos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {category.description || "Sem descrição"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{category.productCount} produtos</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {category.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => toggleCategoryStatus(category.id)}
                          className={`px-3 py-1 rounded-md text-xs ${
                            category.isActive 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {category.isActive ? 'Desativar' : 'Ativar'}
                        </button>
                        <Link
                          href={`/admin/menu/categories/${category.id}`}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs hover:bg-blue-200"
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/admin/menu/products?category=${category.id}`}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-xs hover:bg-purple-200 inline-flex items-center"
                        >
                          <span>Ver Produtos</span>
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(category.id)}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-xs hover:bg-gray-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      Nenhuma categoria encontrada com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita e todos os produtos desta categoria ficarão sem categoria.
            </p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de adição */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Nova Categoria</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Ex: Pizzas, Bebidas, Sobremesas..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Breve descrição da categoria (opcional)"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddCategory}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
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