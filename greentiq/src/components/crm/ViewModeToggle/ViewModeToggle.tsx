import React from "react";
import { Table as TableIcon, LayoutGrid } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ViewModeToggleProps } from "./ViewModeToggle.type";

export function ViewModeToggle({ viewMode, onViewModeChange, className = "" }: ViewModeToggleProps) {
  return (
    <div className={`flex items-center space-x-1 border border-border bg-muted/40 p-0.5 rounded-lg h-9 ${className}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`flex items-center justify-center h-8 w-8 rounded text-xs font-medium transition-colors ${
              viewMode === "table"
                ? "bg-card text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TableIcon className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Table view</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onViewModeChange("card")}
            className={`flex items-center justify-center h-8 w-8 rounded text-xs font-medium transition-colors ${
              viewMode === "card"
                ? "bg-card text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Card view</TooltipContent>
      </Tooltip>
    </div>
  );
}
