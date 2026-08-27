import React, { useEffect, useRef } from "react";
import { useVirtualizer } from "@/lib/useVirtualizer";
import { Customer } from "@/types";
import { formatDate, getStatusBadgeVariant } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InfiniteData } from "@tanstack/react-query";
import { PaginatedCustomersResponse } from "@/types";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  Building2,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  isFetching?: boolean;
  isError: boolean;
  errorMessage?: string;
  viewMode: "table" | "card";
  sortBy?: "name" | "email" | "lastContactDate" | "company" | "dealValue";
  sortOrder?: "asc" | "desc";
  onSortChange: (column: "name" | "email" | "lastContactDate") => void;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAllToggle: (allIds: string[]) => void;
  onViewDetails: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;

  infiniteData?: InfiniteData<PaginatedCustomersResponse>;
  isInfiniteLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
}

export function CustomerTable({
  customers,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  viewMode,
  sortBy,
  sortOrder,
  onSortChange,
  page,
  pageSize,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
  selectedIds,
  onSelectToggle,
  onSelectAllToggle,
  onViewDetails,
  onEdit,
  onDelete,
  infiniteData,
  isInfiniteLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: CustomerTableProps) {
  const allCurrentIds = customers.map((c) => c.id);
  const isAllSelected = allCurrentIds.length > 0 && allCurrentIds.every((id) => selectedIds.includes(id));

  // Flatten infinite scroll customer pages for Card View
  const flatCustomers = infiniteData?.pages.flatMap((p) => p.data) || customers;
  const parentRef = useRef<HTMLDivElement>(null);

  // Group items into rows of 3 columns for desktop grid layout
  const columnsCount = 3;
  const totalGridRows = Math.ceil((flatCustomers.length + (hasNextPage ? 1 : 0)) / columnsCount);

  // Virtualizer for Card View Grid Rows with 200px item height including vertical gap
  const virtualizer = useVirtualizer({
    count: totalGridRows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 3,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Trigger next page fetch when near end of list
  useEffect(() => {
    if (viewMode !== "card" || !hasNextPage || isFetchingNextPage || !fetchNextPage) return;
    const lastRow = virtualItems[virtualItems.length - 1];
    if (lastRow && lastRow.index >= totalGridRows - 2) {
      fetchNextPage();
    }
  }, [virtualItems, hasNextPage, isFetchingNextPage, fetchNextPage, totalGridRows, viewMode]);

  const renderSortIcon = (column: "name" | "email" | "lastContactDate") => {
    if (sortBy !== column) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary font-bold" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary font-bold" />
    );
  };

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
        <h3 className="text-base font-semibold">Failed to load customer dataset</h3>
        <p className="mt-1 text-xs text-muted-foreground">{errorMessage || "An unexpected error occurred."}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          className="mt-4 border-border text-foreground hover:bg-accent"
        >
          Retry Load
        </Button>
      </div>
    );
  }

  // Loading Skeleton State
  if ((isLoading || isInfiniteLoading) && flatCustomers.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-14 w-full rounded-xl bg-muted/60" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (flatCustomers.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
        <Building2 className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
        <h3 className="text-base font-semibold text-foreground">No customers found</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Try adjusting your search criteria or clearing active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Refetching Overlay Indicator for Table View */}
      {isFetching && !isLoading && viewMode === "table" && (
        <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl transition-all">
          <div className="flex items-center space-x-2 bg-card border border-border px-3 py-1.5 rounded-full shadow-md text-xs text-muted-foreground">
            <Skeleton className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span>Updating list...</span>
          </div>
        </div>
      )}

      {/* 1. TABLE VIEW (PAGINATED) */}
      {viewMode === "table" && (
        <>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-foreground">
                <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                  <tr>
                    <th className="w-10 px-4 py-3.5">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={() => onSelectAllToggle(allCurrentIds)}
                      />
                    </th>
                    <th className="px-4 py-3.5">
                      <button
                        onClick={() => onSortChange("name")}
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        <span>Name</span>
                        {renderSortIcon("name")}
                      </button>
                    </th>
                    <th className="px-4 py-3.5">
                      <button
                        onClick={() => onSortChange("email")}
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        <span>Email</span>
                        {renderSortIcon("email")}
                      </button>
                    </th>
                    <th className="px-4 py-3.5">Phone</th>
                    <th className="px-4 py-3.5">Company</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">
                      <button
                        onClick={() => onSortChange("lastContactDate")}
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        <span>Last Contact</span>
                        {renderSortIcon("lastContactDate")}
                      </button>
                    </th>
                    <th className="w-24 px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customers.map((customer) => {
                    const isSelected = selectedIds.includes(customer.id);
                    const badgeVariant = getStatusBadgeVariant(customer.status);
                    const initials = customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2);

                    return (
                      <tr
                        key={customer.id}
                        onClick={() => onViewDetails(customer)}
                        className={`group cursor-pointer transition-colors hover:bg-muted/50 ${
                          isSelected ? "bg-primary/10" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onSelectToggle(customer.id)}
                          />
                        </td>

                        <td className="px-4 py-3.5 font-medium text-foreground">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold text-foreground text-xs border border-border">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold hover:text-primary transition-colors">
                                {customer.name}
                              </p>
                              {customer.jobTitle && (
                                <p className="text-[11px] text-muted-foreground font-normal">{customer.jobTitle}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">
                          {customer.email}
                        </td>

                        <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">
                          {customer.phone}
                        </td>

                        <td className="px-4 py-3.5 text-foreground font-medium">
                          {customer.company}
                        </td>

                        <td className="px-4 py-3.5">
                          <Badge
                            variant="outline"
                            className={`${badgeVariant.bg} ${badgeVariant.text} ${badgeVariant.border} capitalize font-semibold`}
                          >
                            {customer.status}
                          </Badge>
                        </td>

                        <td className="px-4 py-3.5 text-muted-foreground text-xs">
                          {formatDate(customer.lastContactDate)}
                        </td>

                        <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => onViewDetails(customer)}
                              className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onEdit(customer)}
                              className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-emerald-500 transition-colors"
                              title="Edit Customer"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDelete(customer)}
                              className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive transition-colors"
                              title="Delete Customer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
            <div>
              Showing{" "}
              <strong className="text-foreground">
                {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-foreground">{Math.min(page * pageSize, totalCount)}</strong> of{" "}
              <strong className="text-foreground">{totalCount}</strong> entries
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="rounded-lg border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                  className="h-8 px-2.5 border-border bg-background text-foreground disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>

                <span className="px-2 font-medium text-foreground">
                  {page} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="h-8 px-2.5 border-border bg-background text-foreground disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. CARD VIEW (PROPER VERTICAL AND HORIZONTAL GRID GAPS) */}
      {viewMode === "card" && (
        <div
          ref={parentRef}
          className="overflow-y-auto max-h-[calc(100vh-280px)] pr-1"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualItems.map((virtualRow) => {
              const rowIndex = virtualRow.index;
              const startCustomerIndex = rowIndex * columnsCount;
              const rowCustomers = flatCustomers.slice(startCustomerIndex, startCustomerIndex + columnsCount);
              const showLoadingInRow = startCustomerIndex >= flatCustomers.length;

              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size - 16}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="mb-4"
                >
                  {showLoadingInRow ? (
                    <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-center space-x-2 text-xs text-muted-foreground h-full">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>Loading more customers...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                      {rowCustomers.map((customer) => {
                        const isSelected = selectedIds.includes(customer.id);
                        const badgeVariant = getStatusBadgeVariant(customer.status);
                        const initials = customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2);

                        return (
                          <div
                            key={customer.id}
                            onClick={() => onViewDetails(customer)}
                            className={`min-w-[260px] max-w-full rounded-xl border border-border bg-card p-4 space-y-3 cursor-pointer shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between ${
                              isSelected ? "border-primary bg-primary/5" : ""
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => onSelectToggle(customer.id)}
                                    />
                                  </div>
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-bold text-foreground text-xs border border-border">
                                    {initials}
                                  </div>
                                  <div className="overflow-hidden">
                                    <h4 className="text-sm font-bold text-foreground truncate">{customer.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{customer.company}</p>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`${badgeVariant.bg} ${badgeVariant.text} ${badgeVariant.border} capitalize text-[10px] shrink-0`}
                                >
                                  {customer.status}
                                </Badge>
                              </div>

                              <div className="space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                                  <span className="truncate">{customer.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                                  <span>{customer.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                                  <span>Last contact: {formatDate(customer.lastContactDate)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border mt-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(customer);
                                }}
                                className="h-7 text-xs border-border bg-background"
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
                                className="h-7 text-xs"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
