import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { SavedFilterItemProps } from "./SavedFilterItem.type";

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
          ? "border-primary bg-primary/10 text-primary font-bold"
          : "border-border bg-muted/40 text-foreground hover:border-primary/50 hover:bg-accent",
        isDragging && "opacity-50 z-20 border-primary shadow-xl"
      )}
    >
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <button
          type="button"
          className="cursor-grab text-muted-foreground hover:text-foreground touch-none active:cursor-grabbing p-0.5"
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
        className="ml-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
        title="Delete saved filter"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
