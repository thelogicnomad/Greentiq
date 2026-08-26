import React from "react";
import { Customer } from "@/types";
import { useDeleteCustomer } from "@/hooks/useCustomerMutations";
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

interface DeleteConfirmDialogProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

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
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <div className="flex items-center space-x-3 text-rose-400 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-100">Delete Customer</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-400 leading-relaxed">
            Are you sure you want to delete <strong className="text-slate-200">{customer.name}</strong> from{" "}
            <strong className="text-slate-200">{customer.company}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-slate-400"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-rose-600 hover:bg-rose-500 font-semibold"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
