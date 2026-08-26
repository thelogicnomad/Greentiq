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

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start space-x-2 border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 dark:border-slate-800 dark:bg-slate-950/60"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-400" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          <span className="capitalize text-xs font-medium">Theme: {theme || "system"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-slate-900 border-slate-800 text-slate-200">
        <DropdownMenuItem onClick={() => setTheme("light")} className="text-xs cursor-pointer">
          <Sun className="mr-2 h-4 w-4 text-amber-400" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="text-xs cursor-pointer">
          <Moon className="mr-2 h-4 w-4 text-blue-400" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="text-xs cursor-pointer">
          <Laptop className="mr-2 h-4 w-4 text-slate-400" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
