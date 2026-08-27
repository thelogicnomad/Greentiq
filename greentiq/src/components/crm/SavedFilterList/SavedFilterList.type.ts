import React from "react";
import { SavedFilter } from "@/types";

export interface SavedFilterListProps {
  filters: SavedFilter[];
  activeSavedFilterId?: string;
  onApply: (filter: SavedFilter) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onReorder: (orderedIds: string[]) => void;
}
