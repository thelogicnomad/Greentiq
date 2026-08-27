import React from "react";
import { CustomerCardProps } from "./CustomerCard.type";
import { CustomerAvatar } from "@/components/crm/CustomerAvatar";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, Calendar as CalendarIcon } from "lucide-react";

export function CustomerCard({
  customer,
  isSelected,
  onSelectToggle,
  onViewDetails,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  return (
    <div
      onClick={() => onViewDetails(customer)}
      className={`w-full min-w-0 rounded-2xl border border-border bg-card p-5 cursor-pointer shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden ${
        isSelected ? "border-primary bg-primary/5" : ""
      }`}
    >
      <div className="space-y-3.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelectToggle(customer.id)}
              />
            </div>
            <CustomerAvatar name={customer.name} size="md" />
            <div className="min-w-0 flex-1 overflow-hidden">
              <h4 className="text-sm font-bold text-foreground truncate">{customer.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{customer.company}</p>
            </div>
          </div>
          <StatusBadge status={customer.status} className="text-[10px] shrink-0" />
        </div>

        <div className="space-y-2 text-xs text-muted-foreground min-w-0">
          <div className="flex items-center space-x-2 min-w-0">
            <Mail className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center space-x-2 min-w-0">
            <Phone className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span className="truncate">{customer.phone}</span>
          </div>
          <div className="flex items-center space-x-2 min-w-0">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span className="truncate">Last contact: {formatDate(customer.lastContactDate)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(customer);
          }}
          className="h-8 px-3 text-xs border-border bg-background"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(customer);
          }}
          className="h-8 px-3 text-xs"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
