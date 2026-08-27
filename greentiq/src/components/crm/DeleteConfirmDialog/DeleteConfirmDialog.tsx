import React from "react";
import { Customer } from "@/types";
import { useDeleteCustomer } from "@/hooks/useCustomerMutations";
import { DeleteConfirmDialogProps } from "./DeleteConfirmDialog.type";
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

export function DeleteConfirmDialog({
  customer,
  isOpen,
  onClose,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const deleteMutation = useDeleteCustomer();

  if (!customer) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(customer.id);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Delete customer error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-md bg-card border-border text-card-foreground rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center space-x-3 text-destructive mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-foreground">Delete Customer</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to delete <strong className="text-foreground">{customer.name}</strong> from{" "}
            <strong className="text-foreground">{customer.company}</strong>? This action cannot be undone.
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
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold text-xs"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
