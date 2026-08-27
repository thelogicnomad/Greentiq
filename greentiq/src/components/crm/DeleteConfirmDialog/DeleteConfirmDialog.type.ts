import { Customer } from "@/types";

export interface DeleteConfirmDialogProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
