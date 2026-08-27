import React from "react";
import { CustomerTableProps } from "./CustomerTable.type";
import { CustomerTableView } from "@/components/crm/CustomerTableView";
import { CustomerCardList } from "@/components/crm/CustomerCardList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

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
  const flatCustomers = infiniteData?.pages.flatMap((p) => p.data) || customers;

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
      {isFetching && !isLoading && viewMode === "table" && (
        <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl transition-all">
          <div className="flex items-center space-x-2 bg-card border border-border px-3 py-1.5 rounded-full shadow-md text-xs text-muted-foreground">
            <Skeleton className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span>Updating list...</span>
          </div>
        </div>
      )}

      {viewMode === "table" ? (
        <CustomerTableView
          customers={customers}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          selectedIds={selectedIds}
          onSelectToggle={onSelectToggle}
          onSelectAllToggle={onSelectAllToggle}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <CustomerCardList
          customers={customers}
          selectedIds={selectedIds}
          onSelectToggle={onSelectToggle}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          infiniteData={infiniteData}
          isInfiniteLoading={isInfiniteLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </div>
  );
}
