import React from "react";
import { Users, TrendingUp, PhoneCall } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatCardsProps {
  totalCustomers?: number;
  isLoading?: boolean;
}

export function DashboardStatCards({ totalCustomers = 150, isLoading }: DashboardStatCardsProps) {
  const activeLeads = Math.round(totalCustomers * 0.28);
  const contactedThisWeek = Math.round(totalCustomers * 0.16);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 w-full rounded-xl bg-slate-200 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800" />
        <Skeleton className="h-28 w-full rounded-xl bg-slate-200 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800" />
        <Skeleton className="h-28 w-full rounded-xl bg-slate-200 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Total Customers */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 shadow-sm dark:shadow-none backdrop-blur-md transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Customers</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {totalCustomers.toLocaleString()}
          </span>
          <div className="mt-2 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span>Trend +3.2%</span>
            <span className="ml-1">↑ Green</span>
          </div>
        </div>
      </div>

      {/* Active Leads */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 shadow-sm dark:shadow-none backdrop-blur-md transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Leads</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {activeLeads.toLocaleString()}
          </span>
          <div className="mt-2 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span>Trend +5.8%</span>
            <span className="ml-1">↑ Green</span>
          </div>
        </div>
      </div>

      {/* Contacted This Week */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 shadow-sm dark:shadow-none backdrop-blur-md transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Contacted This Week</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <PhoneCall className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {contactedThisWeek.toLocaleString()}
          </span>
          <div className="mt-2 flex items-center text-xs font-medium text-rose-600 dark:text-rose-400">
            <span>Trend -1.5%</span>
            <span className="ml-1">↓ Red</span>
          </div>
        </div>
      </div>
    </div>
  );
}
