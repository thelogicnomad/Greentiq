import { Customer, PaginatedCustomersResponse } from "@/types";
import { InfiniteData } from "@tanstack/react-query";

export interface CustomerCardListProps {
  customers: Customer[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onViewDetails: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;

  infiniteData?: InfiniteData<PaginatedCustomersResponse>;
  isInfiniteLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
}
