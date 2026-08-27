import { FilterState } from "@/types";

export interface AdvancedFiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
  availableCompanies: string[];
  activeFilterCount: number;
}
