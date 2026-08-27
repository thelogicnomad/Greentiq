import React from "react";
import { getInitials } from "@/lib/utils";
import { CustomerAvatarProps } from "./CustomerAvatar.type";

export function CustomerAvatar({ name, size = "md", className = "" }: CustomerAvatarProps) {
  const initials = getInitials(name);

  const sizeClasses =
    size === "sm"
      ? "h-8 w-8 text-xs rounded-full"
      : size === "lg"
      ? "h-12 w-12 sm:h-14 sm:w-14 text-lg sm:text-xl rounded-2xl ring-2 ring-primary/30"
      : "h-9 w-9 text-xs rounded-full";

  return (
    <div
      className={`flex items-center justify-center bg-muted font-bold text-foreground border border-border shrink-0 ${sizeClasses} ${className}`}
    >
      {initials}
    </div>
  );
}
