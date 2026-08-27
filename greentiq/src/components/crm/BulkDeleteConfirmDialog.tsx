import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface BulkDeleteConfirmDialogProps {
  selectedCount: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function BulkDeleteConfirmDialog({
  selectedCount,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: BulkDeleteConfirmDialogProps) {
  if (selectedCount === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-md bg-card border-border text-card-foreground rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center space-x-3 text-destructive mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">Bulk Delete Customers</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to delete <strong className="text-foreground">{selectedCount} selected customer{selectedCount > 1 ? "s" : ""}</strong>? This action cannot be undone and will permanently remove their records.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto text-muted-foreground text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold text-xs"
          >
            {isDeleting ? "Deleting..." : `Delete ${selectedCount} Customer${selectedCount > 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
