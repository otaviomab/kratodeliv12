"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, RefreshCcw, Filter } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  isCustomizable: boolean;
  hasAdditions: boolean;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Carrega dados simulados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulação de carregamento de dados
        setTimeout(() => {
          const mockCategories: Category[] = [
            { id: "1", name: "Entradas" },
            { id: "2", name: "Pratos Principais" },
            { id: "3", name: "Sobremesas" },
            { id: "4", name: "Bebidas" },
            { id: "5", name: "Cervejas" },
            { id: "6", name: "Drinks" },
          ];
          
          const mockProducts: Product[] = [
            { 
              id: "1", 
              name: "Batata Frita", 
              description: "Porção de batata frita crocante",
              price: 25.90,
              imageUrl: "/images/products/fries.jpg",
              categoryId: "1",
              categoryName: "Entradas",
              isActive: true,
              isCustomizable: false,
              hasAdditions: true
            },
            { 
              id: "2", 
              name: "Camarão Empanado", 
              description: "Camarões empanados servidos com molho",
              price: 45.90,
              imageUrl: "/images/products/shrimp.jpg",
              categoryId: "1",
              categoryName: "Entradas",
              isActive: true,
              isCustomizable: false,
              hasAdditions: true
            },
            { 
              id: "3", 
              name: "Filé Mignon", 
              description: "Filé mignon grelhado com batatas rústicas",
              price: 62.90,
              imageUrl: "/images/products/steak.jpg",
              categoryId: "2",
              categoryName: "Pratos Principais",
              isActive: true,
              isCustomizable: true,
              hasAdditions: true
            },
            { 
              id: "4", 
              name: "Risoto de Cogumelos", 
              description: "Risoto cremoso de cogumelos variados",
              price: 48.90,
              imageUrl: "/images/products/risotto.jpg",
              categoryId: "2",
              categoryName: "Pratos Principais",
              isActive: true,
              isCustomizable: false,
              hasAdditions: false
            },
            { 
              id: "5", 
              name: "Tiramisù", 
              description: "Sobremesa italiana com café e mascarpone",
              price: 22.90,
              imageUrl: "/images/products/tiramisu.jpg",
              categoryId: "3",
              categoryName: "Sobremesas",
              isActive: true,
              isCustomizable: false,
              hasAdditions: false
            },
            { 
              id: "6", 
              name: "Petit Gateau", 
              description: "Bolo quente com calda de chocolate e sorvete",
              price: 26.90,
              imageUrl: "/images/products/petit-gateau.jpg",
              categoryId: "3",
              categoryName: "Sobremesas",
              isActive: true,
              isCustomizable: false,
              hasAdditions: true
            },
            { 
              id: "7", 
              name: "Água Mineral", 
              description: "Garrafa 500ml",
              price: 6.90,
              imageUrl: "/images/products/water.jpg",
              categoryId: "4",
              categoryName: "Bebidas",
              isActive: true,
              isCustomizable: false,
              hasAdditions: false
            },
            { 
              id: "8", 
              name: "Refrigerante", 
              description: "Lata 350ml",
              price: 7.90,
              imageUrl: "/images/products/soda.jpg",
              categoryId: "4",
              categoryName: "Bebidas",
              isActive: true,
              isCustomizable: true,
              hasAdditions: false
            },
          ];
          
          setCategories(mockCategories);
          setProducts(mockProducts);
          setIsLoading(false);
        }, 800);
      } catch {
        toast.error("Erro ao carregar produtos");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtra produtos com base na busca e categoria
  const filteredProducts = products.filter(product => {
    // Filtro por categoria
    if (categoryFilter !== "all" && product.categoryId !== categoryFilter) {
      return false;
    }
    
    // Filtro por termo de busca
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Lidar com a alteração do filtro de categoria
  const handleCategoryChange = (categoryId: string) => {
    setCategoryFilter(categoryId);
  };

  // Lidar com a abertura do modal de exclusão
  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  // Confirmar exclusão de produto
  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(prod => prod.id !== productToDelete));
      toast.success("Produto excluído com sucesso");
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  // Alternar status de ativação do produto
  const toggleProductStatus = (productId: string) => {
    setProducts(
      products.map(prod => 
        prod.id === productId ? { ...prod, isActive: !prod.isActive } : prod
      )
    );
    const product = products.find(prod => prod.id === productId);
    if (product) {
      toast.success(`Produto ${product.isActive ? 'desativado' : 'ativado'} com sucesso`);
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

  // Formatação de preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            className="p-2 border rounded-md"
            disabled={isLoading}
          >
            <RefreshCcw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link 
            href="/admin/menu/products/new" 
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md text-sm"
              />
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-muted-foreground h-4 w-4" />
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="flex-1 p-2 border rounded-md text-sm"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <table className="min-w-full divide-y">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Produto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Preço
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
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-md bg-muted overflow-hidden">
                              {product.imageUrl && (
                                <div className="h-full w-full bg-gray-200"></div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-md text-xs bg-muted">
                            {product.categoryName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{formatPrice(product.price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => toggleProductStatus(product.id)}
                              className={`px-3 py-1 rounded-md text-xs ${
                                product.isActive 
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {product.isActive ? 'Desativar' : 'Ativar'}
                            </button>
                            <Link
                              href={`/admin/menu/products/${product.id}`}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs hover:bg-blue-200 inline-flex items-center"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              <span>Editar</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(product.id)}
                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-xs hover:bg-gray-200 inline-flex items-center"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              <span>Excluir</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhum produto encontrado com os filtros selecionados.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
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
    </div>
  );
} 