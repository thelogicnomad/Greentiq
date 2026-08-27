import React from "react";
import { STATUSES } from "@/lib/api/seed";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusFilterGroupProps } from "./StatusFilterGroup.type";

export function StatusFilterGroup({ selectedStatuses = [], onStatusToggle }: StatusFilterGroupProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Status
      </label>
      <div className="space-y-2.5 rounded-xl border border-border bg-muted/20 p-3.5">
        {STATUSES.map((status) => {
          const isChecked = selectedStatuses.includes(status);
          return (
            <label
              key={status}
              className="flex cursor-pointer items-center space-x-3 text-sm text-foreground hover:text-primary"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => onStatusToggle(status)}
              />
              <span className="capitalize">{status}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
