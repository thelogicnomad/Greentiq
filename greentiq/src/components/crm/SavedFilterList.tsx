import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SavedFilter } from "@/types";
import { SavedFilterItem } from "./SavedFilterItem";

interface SavedFilterListProps {
  filters: SavedFilter[];
  activeSavedFilterId?: string;
  onApply: (filter: SavedFilter) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onReorder: (orderedIds: string[]) => void;
}

export function SavedFilterList({
  filters,
  activeSavedFilterId,
  onApply,
  onDelete,
  onReorder,
}: SavedFilterListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4, // 4px distance required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filters.findIndex((item) => item.id === active.id);
      const newIndex = filters.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(filters, oldIndex, newIndex);
      const newOrderedIds = reorderedItems.map((item) => item.id);
      onReorder(newOrderedIds);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={filters.map((f) => f.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1.5">
          {filters.map((filter) => (
            <SavedFilterItem
              key={filter.id}
              filter={filter}
              isActiveFilter={filter.id === activeSavedFilterId}
              onApply={onApply}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
