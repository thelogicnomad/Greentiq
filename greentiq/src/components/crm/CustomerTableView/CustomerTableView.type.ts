import { Customer } from "@/types";

export interface CustomerTableViewProps {
  customers: Customer[];
  sortBy?: "name" | "email" | "lastContactDate" | "company" | "dealValue";
  sortOrder?: "asc" | "desc";
  onSortChange: (column: "name" | "email" | "lastContactDate") => void;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAllToggle: (allIds: string[]) => void;
  onViewDetails: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}
