"use client";

import { formatPrice } from "@/utils/formatPrice";
import { cn } from "@/utils/cn";
import { Plus } from "lucide-react";
import { type Product } from "@/types/menu";

interface MenuItemProps {
  product: Product;
  onClick: (product: Product) => void;
  className?: string;
}

const MenuItem = ({ product, onClick, className }: MenuItemProps) => {
  const { name, description, price, imageUrl } = product;

  return (
    <div 
      className={cn(
        "flex border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-card",
        className
      )}
      onClick={() => onClick(product)}
    >
      <div className="flex-1 p-4">
        <h3 className="font-medium text-foreground">{name}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        <p className="mt-2 font-medium text-foreground">
          {formatPrice(price)}
        </p>
      </div>

      <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted">
            <span className="text-muted-foreground text-xs">Sem imagem</span>
          </div>
        )}
        <div className="absolute right-2 bottom-2">
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation();
              onClick(product);
            }}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
