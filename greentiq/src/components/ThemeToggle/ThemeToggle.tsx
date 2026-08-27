"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ThemeToggleProps } from "./ThemeToggle.type";

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground ${className}`}
        disabled
      >
        <Sun className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors ${className}`}
          aria-label={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400 shrink-0 transition-transform duration-200" />
          ) : (
            <Moon className="h-4 w-4 text-blue-400 shrink-0 transition-transform duration-200" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isDark ? "Switch to Light theme" : "Switch to Dark theme"}
      </TooltipContent>
    </Tooltip>
  );
}
