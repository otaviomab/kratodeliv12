import { cn } from "@/utils/cn";
import Link from "next/link";
import { ShoppingCart, MapPin, Clock } from "lucide-react";
import { type Establishment } from "@/types/establishment";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  establishment: Establishment;
  cartItemsCount?: number;
  className?: string;
}

const Header = ({ establishment, cartItemsCount = 0, className }: HeaderProps) => {
  const { name, logoUrl, isOpen } = establishment;

  return (
    <header className={cn("sticky top-0 z-50 bg-card border-b", className)}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href={`/cardapio/${establishment.slug}`} className="flex items-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="h-10 w-10 rounded-full object-cover mr-2"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2">
                <span className="text-lg font-bold">{name.charAt(0)}</span>
              </div>
            )}
            <span className="text-lg font-semibold">{name}</span>
            {isOpen ? (
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Aberto</span>
            ) : (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Fechado</span>
            )}
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href="#info"
              className="hidden md:flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <MapPin className="h-4 w-4 mr-1" />
              <span>Informações</span>
            </Link>

            <Link
              href="#horarios"
              className="hidden md:flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <Clock className="h-4 w-4 mr-1" />
              <span>Horários</span>
            </Link>

            <ThemeToggle />

            <Link
              href="/cart"
              className="relative flex items-center justify-center h-10 w-10 rounded-md hover:bg-muted"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 