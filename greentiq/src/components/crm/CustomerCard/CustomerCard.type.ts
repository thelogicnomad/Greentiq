import { Customer } from "@/types";

export interface CustomerCardProps {
  customer: Customer;
  isSelected: boolean;
  onSelectToggle: (id: string) => void;
  onViewDetails: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}
