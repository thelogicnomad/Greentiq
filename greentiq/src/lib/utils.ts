import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string, formatStr: string = "MMM d, yyyy"): string {
  if (!dateString) return "N/A";
  const date = parseISO(dateString);
  if (!isValid(date)) return dateString;
  return format(date, formatStr);
}

export function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getStatusBadgeVariant(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case "active":
      return { bg: "bg-[var(--status-active-bg)]", text: "text-[var(--status-active-text)]", border: "border-transparent" };
    case "prospect":
      return { bg: "bg-[var(--status-prospect-bg)]", text: "text-[var(--status-prospect-text)]", border: "border-transparent" };
    case "lead":
      return { bg: "bg-[var(--status-lead-bg)]", text: "text-[var(--status-lead-text)]", border: "border-transparent" };
    case "inactive":
      return { bg: "bg-transparent", text: "text-[var(--status-inactive-text)]", border: "border-transparent" };
    case "archived":
      return { bg: "bg-[var(--status-archived-bg)]", text: "text-[var(--status-archived-text)]", border: "border-transparent" };
    default:
      return { bg: "bg-muted/40", text: "text-muted-foreground", border: "border-transparent" };
  }
}

export function getInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}
