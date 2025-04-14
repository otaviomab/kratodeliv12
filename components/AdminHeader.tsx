"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="container flex h-16 items-center justify-between py-4">
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    </header>
  );
} 