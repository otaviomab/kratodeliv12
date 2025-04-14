import { Store } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <Store className="h-6 w-6" />
          <span className="font-semibold">Krato</span>
        </Link>
      </div>
    </header>
  );
} 