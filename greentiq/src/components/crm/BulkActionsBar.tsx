import React from "react";
import { CustomerStatus } from "@/types";
import { STATUSES } from "@/lib/api/seed";
import { Button } from "@/components/ui/button";
import { X, Trash2, CheckCircle2, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: CustomerStatus) => void;
  onExportCsv: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkStatusChange,
  onExportCsv,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <>
      {/* 1. MOBILE LAYOUT (Bottom Fixed Full-Width Sheet Bar) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/98 p-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200 text-foreground space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {selectedCount}
            </span>
            <span className="text-xs font-semibold text-foreground">
              Customer{selectedCount > 1 ? "s" : ""} Selected
            </span>
          </div>

          <button
            onClick={onClearSelection}
            className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <span>Deselect</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-3 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs border-border bg-background text-foreground w-full px-1">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-primary shrink-0" /> Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-popover border-border text-popover-foreground">
              {STATUSES.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onBulkStatusChange(status)}
                  className="capitalize text-xs cursor-pointer"
                >
                  Set status to {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="h-8 text-xs border-border bg-background text-foreground w-full px-1"
          >
            <Download className="mr-1 h-3.5 w-3.5 text-emerald-500 shrink-0" /> Export
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full px-1 font-semibold"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5 shrink-0" /> Delete
          </Button>
        </div>
      </div>

      {/* 2. DESKTOP LAYOUT (Floating Pill Bar) */}
      <div className="hidden sm:flex fixed bottom-6 left-1/2 z-40 -translate-x-1/2 items-center space-x-3 rounded-2xl border border-border bg-card/95 px-5 py-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200 text-foreground">
        <div className="flex items-center space-x-2 border-r border-border pr-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {selectedCount}
          </span>
          <span className="text-xs font-medium text-foreground">selected</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs border-border bg-background text-foreground">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-primary" /> Change Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
            {STATUSES.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => onBulkStatusChange(status)}
                className="capitalize text-xs cursor-pointer"
              >
                Set status to {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={onExportCsv}
          className="h-8 text-xs border-border bg-background text-foreground"
        >
          <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> Export CSV
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
        </Button>

        <button
          onClick={onClearSelection}
          className="ml-2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          title="Clear Selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
