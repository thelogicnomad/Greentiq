import React from "react";
import { CustomerTableViewProps } from "./CustomerTableView.type";
import { CustomerAvatar } from "@/components/crm/CustomerAvatar";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

export function CustomerTableView({
  customers,
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
}: CustomerTableViewProps) {
  const allCurrentIds = customers.map((c) => c.id);
  const isAllSelected = allCurrentIds.length > 0 && allCurrentIds.every((id) => selectedIds.includes(id));

  const renderSortIcon = (column: "name" | "email" | "lastContactDate") => {
    if (sortBy !== column) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary font-bold" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary font-bold" />
    );
  };

  return (
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
                        <CustomerAvatar name={customer.name} size="sm" />
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
                      <StatusBadge status={customer.status} />
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
  );
}
