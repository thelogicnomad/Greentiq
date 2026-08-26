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
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center space-x-3 rounded-2xl border border-slate-700 bg-slate-900/95 px-5 py-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center space-x-2 border-r border-slate-700 pr-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {selectedCount}
        </span>
        <span className="text-xs font-medium text-slate-200">selected</span>
      </div>

      {/* Bulk Status Update */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 text-xs border-slate-700 bg-slate-800 text-slate-200">
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-blue-400" /> Change Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200">
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

      {/* Bulk Export CSV */}
      <Button
        variant="outline"
        size="sm"
        onClick={onExportCsv}
        className="h-8 text-xs border-slate-700 bg-slate-800 text-slate-200"
      >
        <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-400" /> Export CSV
      </Button>

      {/* Bulk Delete */}
      <Button
        variant="destructive"
        size="sm"
        onClick={onBulkDelete}
        className="h-8 text-xs bg-rose-600 hover:bg-rose-500"
      >
        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
      </Button>

      {/* Clear Selection */}
      <button
        onClick={onClearSelection}
        className="ml-2 text-slate-400 hover:text-white transition-colors p-1 rounded"
        title="Clear Selection"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
