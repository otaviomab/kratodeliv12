import { cn } from "@/utils/cn";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("bg-card border-t mt-auto py-6", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Krato</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Plataforma de cardápio digital e pedidos online
            </p>
          </div>

          <div className="flex space-x-6">
            <Link href="/termos" className="text-sm text-muted-foreground hover:text-foreground">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-foreground">
              Política de Privacidade
            </Link>
            <Link href="/ajuda" className="text-sm text-muted-foreground hover:text-foreground">
              Ajuda
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {currentYear} Krato. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 