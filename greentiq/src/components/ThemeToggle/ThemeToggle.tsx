"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggleProps } from "./ThemeToggle.type";

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`w-full justify-start space-x-2 border-border bg-card text-card-foreground hover:bg-accent ${className}`}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-400" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          <span className="capitalize text-xs font-medium">Theme: {theme || "system"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-popover border-border text-popover-foreground">
        <DropdownMenuItem onClick={() => setTheme("light")} className="text-xs cursor-pointer">
          <Sun className="mr-2 h-4 w-4 text-amber-400" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="text-xs cursor-pointer">
          <Moon className="mr-2 h-4 w-4 text-blue-400" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="text-xs cursor-pointer">
          <Laptop className="mr-2 h-4 w-4 text-muted-foreground" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
