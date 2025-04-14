"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

// Mock de categorias para simulação
const initialCategories = [
  { id: "1", name: "Entradas", description: "Pratos para começar sua refeição", displayOrder: 1 },
  { id: "2", name: "Pratos Principais", description: "Nossas especialidades principais", displayOrder: 2 },
  { id: "3", name: "Sobremesas", description: "Opções doces para finalizar", displayOrder: 3 },
  { id: "4", name: "Bebidas", description: "Refrigerantes, sucos e drinks", displayOrder: 4 },
  { id: "5", name: "Combos", description: "Opções completas por um preço especial", displayOrder: 5 },
];

// Definindo a interface para os objetos de categoria
interface Category {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", displayOrder: 0 });
  const [draggedItem, setDraggedItem] = useState<Category | null>(null);

  // Handlers para edição
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCategory(null);
  };

  const handleSaveEdit = () => {
    if (editingCategory) {
      setCategories(
        categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat))
      );
      setIsEditing(false);
      setEditingCategory(null);
      toast.success("Categoria atualizada com sucesso");
    }
  };

  // Handlers para criação
  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEditingCategory(null);
    setNewCategory({
      name: "",
      description: "",
      displayOrder: categories.length + 1
    });
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewCategory({ name: "", description: "", displayOrder: 0 });
  };

  const handleSaveCreate = () => {
    if (newCategory.name.trim() === "") {
      toast.error("O nome da categoria é obrigatório");
      return;
    }

    const newId = `temp-${Date.now()}`;
    setCategories([
      ...categories,
      {
        id: newId,
        ...newCategory
      }
    ]);
    setIsCreating(false);
    setNewCategory({ name: "", description: "", displayOrder: 0 });
    toast.success("Categoria criada com sucesso");
  };

  // Handler para exclusão
  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("Categoria excluída com sucesso");
    }
  };

  // Handlers para arrastar e soltar (reordenação)
  const handleDragStart = (e: React.DragEvent, category: Category) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetCategory: Category) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetCategory.id) return;
    
    const updatedCategories = [...categories];
    
    // Encontra os índices dos itens de origem e destino
    const draggedIndex = updatedCategories.findIndex(cat => cat.id === draggedItem.id);
    const targetIndex = updatedCategories.findIndex(cat => cat.id === targetCategory.id);
    
    // Remove o item arrastado da lista
    const [removedItem] = updatedCategories.splice(draggedIndex, 1);
    
    // Insere o item na nova posição
    updatedCategories.splice(targetIndex, 0, removedItem);
    
    // Atualiza a ordem de exibição de todas as categorias
    const reorderedCategories = updatedCategories.map((cat, index) => ({
      ...cat,
      displayOrder: index + 1
    }));
    
    setCategories(reorderedCategories);
    setDraggedItem(null);
    toast.success("Ordem das categorias atualizada");
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categorias do Cardápio</h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </button>
      </div>

      {/* Formulário de Criação */}
      {isCreating && (
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Nova Categoria</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="Ex.: Entradas"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="Ex.: Pratos para iniciar sua refeição"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="order" className="block text-sm font-medium mb-1">
                Ordem de Exibição
              </label>
              <input
                type="number"
                id="order"
                value={newCategory.displayOrder}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    displayOrder: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border rounded-md bg-background"
                min="1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelCreate}
                className="px-4 py-2 border rounded-md bg-background text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCreate}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Categorias */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-10">
                  Ordem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y">
              {categories.map((category) => (
                isEditing && editingCategory?.id === category.id ? (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={editingCategory.displayOrder}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            displayOrder: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-16 px-2 py-1 border rounded-md bg-background"
                        min="1"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded-md bg-background"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        value={editingCategory.description}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded-md bg-background"
                        rows={2}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 border rounded-md bg-background text-xs"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-primary text-white rounded-md text-xs"
                      >
                        Salvar
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr 
                    key={category.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, category)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e, category)}
                    onDragEnd={handleDragEnd}
                    className={`hover:bg-muted/50 ${draggedItem?.id === category.id ? 'opacity-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-4 w-4 text-muted-foreground mr-2 cursor-move">≡</div>
                        <span>{category.displayOrder}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {category.name}
                    </td>
                    <td className="px-6 py-4">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Excluir
                      </button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Dicas</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Arraste as categorias para reordenar (clique e arraste no ícone de menu)</li>
          <li>A ordem das categorias define como elas aparecerão no cardápio</li>
          <li>Categorias vazias não serão exibidas para os clientes</li>
          <li>Você pode adicionar uma imagem para cada categoria na edição de produtos</li>
        </ul>
      </div>
    </div>
  );
} 