"use client";
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeChangeButton = ({ className }: { className?: string }) => {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`dark:text-yellow-500 text-neutral-700 place-items-center place-content-center md:text-xl ${className}`}
    >
      <Sun className="hidden dark:block w-full h-full" fill="currentColor" />
      <Moon className="dark:hidden w-full h-full" fill="currentColor" />
    </button>
  );
};

export default ThemeChangeButton;
