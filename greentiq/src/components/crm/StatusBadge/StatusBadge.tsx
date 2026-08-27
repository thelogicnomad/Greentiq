import React from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeVariant } from "@/lib/utils";
import { StatusBadgeProps } from "./StatusBadge.type";

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const badgeVariant = getStatusBadgeVariant(status);

  return (
    <Badge
      variant="outline"
      className={`${badgeVariant.bg} ${badgeVariant.text} ${badgeVariant.border} capitalize font-semibold ${className}`}
    >
      {status}
    </Badge>
  );
}
