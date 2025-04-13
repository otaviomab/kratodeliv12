"use client";

import MenuItem from "./MenuItem";
import { type Product } from "@/types/menu";

interface Category {
  id: string;
  name: string;
  products: Product[];
}

interface ProductAdditional {
  id: string;
  name: string;
  price: number;
  isAvailable?: boolean;
}

interface MenuCategoryListProps {
  categories: Category[];
}

export default function MenuCategoryList({ categories }: MenuCategoryListProps) {
  const handleProductClick = (product: Product) => {
    console.log("Produto clicado:", product.name);
    // Aqui você pode navegar para a página de detalhes do produto ou abrir um modal
  };

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <div key={category.id} id={`category-${category.id}`} className="scroll-mt-16">
          <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.products.map((product) => (
              <MenuItem 
                key={product.id} 
                product={product} 
                onClick={() => handleProductClick(product)} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 