"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Verificar tema atual
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    
    const currentTheme = savedTheme || systemTheme;
    setTheme(currentTheme);
    updateTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    updateTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const updateTheme = (mode: "light" | "dark") => {
    const root = window.document.documentElement;
    
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 hover:bg-muted flex items-center justify-center"
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
    >
      {theme === "light" ? (
        <Moon size={20} className="text-foreground" />
      ) : (
        <Sun size={20} className="text-foreground" />
      )}
    </button>
  );
} 