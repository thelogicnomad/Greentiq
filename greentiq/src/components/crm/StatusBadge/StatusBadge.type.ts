import { CustomerStatus } from "@/types";

export interface StatusBadgeProps {
  status: CustomerStatus | string;
  className?: string;
}
