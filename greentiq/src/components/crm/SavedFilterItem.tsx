import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Pin } from "lucide-react";
import { SavedFilter } from "@/types";
import { cn } from "@/lib/utils";

interface SavedFilterItemProps {
  filter: SavedFilter;
  isActiveFilter: boolean;
  onApply: (filter: SavedFilter) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export function SavedFilterItem({ filter, isActiveFilter, onApply, onDelete }: SavedFilterItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: filter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-all",
        isActiveFilter
          ? "border-blue-500/50 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
          : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60",
        isDragging && "opacity-50 z-20 border-blue-500 shadow-xl"
      )}
    >
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <button
          type="button"
          className="cursor-grab text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 touch-none active:cursor-grabbing p-0.5"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onApply(filter)}
          className="flex items-center space-x-1.5 min-w-0 flex-1 text-left truncate"
        >
          {filter.isPinned && <Pin className="h-3 w-3 text-amber-500 shrink-0" />}
          <span className="truncate">{filter.name}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={(e) => onDelete(filter.id, e)}
        className="ml-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800"
        title="Delete saved filter"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
