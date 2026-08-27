import React from "react";
import { Users, TrendingUp, PhoneCall } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStatCardsProps } from "./DashboardStatCards.type";

export function DashboardStatCards({ totalCustomers = 150, isLoading }: DashboardStatCardsProps) {
  const activeLeads = Math.round(totalCustomers * 0.28);
  const contactedThisWeek = Math.round(totalCustomers * 0.16);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 w-full rounded-xl bg-muted/60 border border-border" />
        <Skeleton className="h-28 w-full rounded-xl bg-muted/60 border border-border" />
        <Skeleton className="h-28 w-full rounded-xl bg-muted/60 border border-border" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Total Customers */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-xs backdrop-blur-md transition-all hover:border-primary/50 text-card-foreground">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Customers</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {totalCustomers.toLocaleString()}
          </span>
          <div className="mt-2 flex items-center text-xs font-medium text-emerald-500">
            <span>Trend +3.2%</span>
            <span className="ml-1">↑ Green</span>
          </div>
        </div>
      </div>

      {/* Active Leads */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-xs backdrop-blur-md transition-all hover:border-primary/50 text-card-foreground">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Active Leads</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {activeLeads.toLocaleString()}
          </span>
          <div className="mt-2 flex items-center text-xs font-medium text-emerald-500">
            <span>Trend +5.8%</span>
            <span className="ml-1">↑ Green</span>
          </div>
        </div>
      </div>

      {/* Contacted This Week */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-xs backdrop-blur-md transition-all hover:border-primary/50 text-card-foreground">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Contacted This Week</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <PhoneCall className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {contactedThisWeek.toLocaleString()}
          </span>
          <div className="mt-2 flex items-center text-xs font-medium text-rose-500">
            <span>Trend -1.5%</span>
            <span className="ml-1">↓ Red</span>
          </div>
        </div>
      </div>
    </div>
  );
}
