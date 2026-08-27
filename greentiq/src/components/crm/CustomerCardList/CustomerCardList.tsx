import React, { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@/lib/useVirtualizer";
import { CustomerCard } from "@/components/crm/CustomerCard";
import { CustomerCardListProps } from "./CustomerCardList.type";
import { Loader2 } from "lucide-react";

export function CustomerCardList({
  customers,
  selectedIds,
  onSelectToggle,
  onViewDetails,
  onEdit,
  onDelete,
  infiniteData,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: CustomerCardListProps) {
  const [columnsCount, setColumnsCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumnsCount(1);
      } else if (window.innerWidth < 1024) {
        setColumnsCount(2);
      } else {
        setColumnsCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const flatCustomers = infiniteData?.pages.flatMap((p) => p.data) || customers;
  const parentRef = useRef<HTMLDivElement>(null);

  const totalGridRows = Math.ceil((flatCustomers.length + (hasNextPage ? 1 : 0)) / columnsCount);

  const virtualizer = useVirtualizer({
    count: totalGridRows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (columnsCount === 1 ? 230 : 250),
    overscan: 3,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !fetchNextPage) return;
    const lastRow = virtualItems[virtualItems.length - 1];
    if (lastRow && lastRow.index >= totalGridRows - 2) {
      fetchNextPage();
    }
  }, [virtualItems, hasNextPage, isFetchingNextPage, fetchNextPage, totalGridRows]);

  return (
    <div ref={parentRef} className="overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
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
          const verticalGap = columnsCount === 1 ? 16 : 28;

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size - verticalGap}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {showLoadingInRow ? (
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-center space-x-2 text-xs text-muted-foreground h-full">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Loading more customers...</span>
                </div>
              ) : (
                <div
                  className={`grid gap-4 h-full ${
                    columnsCount === 1
                      ? "grid-cols-1"
                      : columnsCount === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  {rowCustomers.map((customer) => (
                    <CustomerCard
                      key={customer.id}
                      customer={customer}
                      isSelected={selectedIds.includes(customer.id)}
                      onSelectToggle={onSelectToggle}
                      onViewDetails={onViewDetails}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
