import React, { useState } from "react";
import { Customer } from "@/types";
import { formatDate, formatCurrency, getStatusBadgeVariant } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

interface CustomerDetailsModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerDetailsModal({
  customer,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: CustomerDetailsModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!customer) return null;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const badgeVariant = getStatusBadgeVariant(customer.status);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(customer.email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-card border-border text-card-foreground max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <DialogHeader className="p-6 border-b border-border flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-bold text-primary-foreground text-xl shadow-lg ring-2 ring-primary/30">
              {initials}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">{customer.name}</DialogTitle>
              <p className="text-sm text-muted-foreground font-medium">
                {customer.jobTitle || "Customer Contact"}
              </p>
              <div className="mt-1 flex items-center space-x-2 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                <span>{customer.company}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pr-6">
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

        {/* Modal Scrollable Body with generous padding */}
        <div className="flex-1 overflow-y-auto p-7 space-y-6">
          {/* Grid Section: Contact Info & Company/Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-2xl border border-border bg-muted/30 p-5">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact Information
              </h4>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Email</span>
                <div className="flex items-center space-x-2 text-sm text-foreground">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{customer.email}</span>
                  <button
                    onClick={handleCopyEmail}
                    className="text-muted-foreground hover:text-foreground transition-colors"
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
                <span className="text-xs text-muted-foreground block mb-1">Phone</span>
                <div className="flex items-center space-x-2 text-sm text-foreground">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company & Status
              </h4>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Status</span>
                <Badge
                  variant="outline"
                  className={`${badgeVariant.bg} ${badgeVariant.text} ${badgeVariant.border} capitalize px-3 py-1 font-semibold`}
                >
                  {customer.status}
                </Badge>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block mb-1">Deal Value</span>
                <div className="flex items-center space-x-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatCurrency(customer.dealValue)}</span>
                </div>
              </div>

              {customer.accountOwner && (
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Account Owner</span>
                  <div className="flex items-center space-x-1.5 text-sm text-foreground">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.accountOwner}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timelines Section */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Timelines
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block mb-1">Last Contact Date</span>
                <div className="flex items-center space-x-2 text-foreground font-medium">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formatDate(customer.lastContactDate, "PPP")}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Account Created Date</span>
                <div className="flex items-center space-x-2 text-foreground font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(customer.createdDate, "PPP")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Interaction History Timeline */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-4">
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
