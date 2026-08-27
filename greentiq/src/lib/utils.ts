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
      return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" };
    case "prospect":
      return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" };
    case "lead":
      return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" };
    case "inactive":
      return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" };
    case "archived":
      return { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30" };
    default:
      return { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/30" };
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
