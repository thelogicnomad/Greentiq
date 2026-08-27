export interface BulkDeleteConfirmDialogProps {
  selectedCount: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}
