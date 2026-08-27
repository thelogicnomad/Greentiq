import React from "react";
import { SavedFilter } from "@/types";

export interface SavedFilterItemProps {
  filter: SavedFilter;
  isActiveFilter: boolean;
  onApply: (filter: SavedFilter) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}
