import { CustomerStatus } from "@/types";

export interface StatusFilterGroupProps {
  selectedStatuses: CustomerStatus[];
  onStatusToggle: (status: CustomerStatus) => void;
}
