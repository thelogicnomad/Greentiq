import React, { useState } from "react";
import { Customer } from "@/types";
import { formatDate, formatCurrency, getStatusBadgeVariant } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddCustomerNote } from "@/hooks/useCustomerMutations";
import {
  X,
  Copy,
  Check,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  UserCheck,
  MessageSquarePlus,
  Trash2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

interface CustomerDetailsDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerDetailsDrawer({
  customer,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: CustomerDetailsDrawerProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");

  const addNoteMutation = useAddCustomerNote();

  if (!isOpen || !customer) return null;

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

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    await addNoteMutation.mutateAsync({
      customerId: customer.id,
      content: newNoteContent.trim(),
    });

    setNewNoteContent("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal / Drawer matching Page 6 mockup */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-800 bg-slate-900 shadow-2xl transition-all animate-in slide-in-from-right duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div className="flex items-center space-x-4">
            {/* Avatar Circle */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white text-xl shadow-lg ring-2 ring-blue-500/30">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{customer.name}</h2>
              <p className="text-sm text-slate-400 font-medium">
                {customer.jobTitle || "Customer Contact"}
              </p>
              <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500">
                <Building2 className="h-3.5 w-3.5" />
                <span>{customer.company}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(customer)}
              className="border-rose-900/50 bg-rose-950/30 text-rose-400 hover:bg-rose-900 hover:text-white"
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onEdit(customer)}
              className="bg-blue-600 hover:bg-blue-500"
            >
              <Edit className="mr-1 h-3.5 w-3.5" /> Edit Customer
            </Button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Grid Section: Contact Info & Company/Status */}
          <div className="grid grid-cols-2 gap-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Contact Information
              </h4>
              <div>
                <span className="text-xs text-slate-500 block mb-1">Email</span>
                <div className="flex items-center space-x-2 text-sm text-slate-200">
                  <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                  <button
                    onClick={handleCopyEmail}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-1">Phone</span>
                <div className="flex items-center space-x-2 text-sm text-slate-200">
                  <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Company & Status */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Company & Status
              </h4>
              <div>
                <span className="text-xs text-slate-500 block mb-1">Status</span>
                <Badge
                  variant="outline"
                  className={`${badgeVariant.bg} ${badgeVariant.text} ${badgeVariant.border} capitalize px-3 py-1 font-semibold`}
                >
                  {customer.status}
                </Badge>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-1">Deal Value</span>
                <div className="flex items-center space-x-1 text-sm font-semibold text-emerald-400">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatCurrency(customer.dealValue)}</span>
                </div>
              </div>

              {customer.accountOwner && (
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Account Owner</span>
                  <div className="flex items-center space-x-1.5 text-sm text-slate-200">
                    <UserCheck className="h-4 w-4 text-slate-400" />
                    <span>{customer.accountOwner}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timelines Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Timelines
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Last Contact Date</span>
                <div className="flex items-center space-x-2 text-slate-200 font-medium">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>{formatDate(customer.lastContactDate, "PPP")}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Account Created Date</span>
                <div className="flex items-center space-x-2 text-slate-200 font-medium">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{formatDate(customer.createdDate, "PPP")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Interaction Timeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Notes & Interactions
              </h4>
              <span className="text-xs text-slate-500">{customer.notes.length} Entries</span>
            </div>

            {/* Add New Note Input */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                placeholder="Type interaction note or meeting summary..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newNoteContent.trim() || addNoteMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-500 text-xs h-7 px-3"
                >
                  <MessageSquarePlus className="mr-1 h-3.5 w-3.5" />
                  {addNoteMutation.isPending ? "Adding..." : "Add Note"}
                </Button>
              </div>
            </form>

            {/* Timeline Notes List */}
            <div className="space-y-3 pt-2">
              {customer.notes.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4">No notes recorded yet.</p>
              ) : (
                customer.notes.map((note) => (
                  <div
                    key={note.id}
                    className="relative pl-4 border-l-2 border-slate-700 space-y-1 py-1"
                  >
                    <p className="text-xs text-slate-200">{note.content}</p>
                    <span className="text-[10px] text-slate-500 block">
                      {formatDate(note.createdAt, "PPP 'at' p")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
