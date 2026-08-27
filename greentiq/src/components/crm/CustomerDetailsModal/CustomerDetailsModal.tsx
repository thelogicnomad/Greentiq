import React, { useState } from "react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { CustomerAvatar } from "@/components/crm/CustomerAvatar";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { CustomerDetailsModalProps } from "./CustomerDetailsModal.type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Copy,
  Check,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  UserCheck,
  Trash2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

export function CustomerDetailsModal({
  customer,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: CustomerDetailsModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!customer) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(customer.email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-2xl bg-card border-border text-card-foreground max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        {/* Modal Header */}
        <DialogHeader className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <CustomerAvatar name={customer.name} size="lg" />
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg sm:text-xl font-bold text-foreground truncate">{customer.name}</DialogTitle>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
                {customer.jobTitle || "Customer Contact"}
              </p>
              <div className="mt-0.5 flex items-center space-x-1.5 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{customer.company}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(customer)}
              className="border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs h-8"
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onEdit(customer)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8"
            >
              <Edit className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          </div>
        </DialogHeader>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-5 sm:space-y-6">
          {/* Grid Section: Contact Info & Company/Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 rounded-2xl border border-border bg-muted/30 p-4 sm:p-5">
            <div className="space-y-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact Information
              </h4>
              <div>
                <span className="text-[11px] sm:text-xs text-muted-foreground block mb-1">Email</span>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-foreground min-w-0">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{customer.email}</span>
                  <button
                    onClick={handleCopyEmail}
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] sm:text-xs text-muted-foreground block mb-1">Phone</span>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-foreground">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company & Status
              </h4>
              <div>
                <span className="text-[11px] sm:text-xs text-muted-foreground block mb-1">Status</span>
                <StatusBadge status={customer.status} className="px-3 py-0.5 text-xs" />
              </div>

              <div>
                <span className="text-[11px] sm:text-xs text-muted-foreground block mb-1">Deal Value</span>
                <div className="flex items-center space-x-1 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatCurrency(customer.dealValue)}</span>
                </div>
              </div>

              {customer.accountOwner && (
                <div>
                  <span className="text-[11px] sm:text-xs text-muted-foreground block mb-1">Account Owner</span>
                  <div className="flex items-center space-x-1.5 text-xs sm:text-sm text-foreground">
                    <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{customer.accountOwner}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timelines Section */}
          <div className="rounded-2xl border border-border bg-muted/30 p-4 sm:p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Timelines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block mb-1">Last Contact Date</span>
                <div className="flex items-center space-x-2 text-foreground font-medium">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>{formatDate(customer.lastContactDate, "PPP")}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Account Created Date</span>
                <div className="flex items-center space-x-2 text-foreground font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{formatDate(customer.createdDate, "PPP")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Interaction History Timeline */}
          <div className="rounded-2xl border border-border bg-muted/30 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Notes & Interaction History
              </h4>
              <span className="text-xs text-muted-foreground">{customer.notes.length} Entries</span>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {customer.notes.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-4">No notes recorded yet.</p>
              ) : (
                customer.notes.map((note) => (
                  <div
                    key={note.id}
                    className="relative pl-4 border-l-2 border-border space-y-1 py-1"
                  >
                    <p className="text-xs text-foreground">{note.content}</p>
                    <span className="text-[10px] text-muted-foreground block">
                      {formatDate(note.createdAt, "PPP 'at' p")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
