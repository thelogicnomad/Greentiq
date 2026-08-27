import { CustomerStatus } from "@/types";

export interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: CustomerStatus) => void;
  onExportCsv: () => void;
}
