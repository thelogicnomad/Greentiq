import { FilterState } from "@/types";

export interface SaveFilterFormProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
}
