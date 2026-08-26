import React from "react";
import { Customer } from "@/types";
import { formatDate, getStatusBadgeVariant } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  Calendar,
} from "lucide-react";

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
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
}

export function CustomerTable({
  customers,
  isLoading,
  isError,
  errorMessage,
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
}: CustomerTableProps) {
  const allCurrentIds = customers.map((c) => c.id);
  const isAllSelected = allCurrentIds.length > 0 && allCurrentIds.every((id) => selectedIds.includes(id));

  const renderSortIcon = (column: "name" | "email" | "lastContactDate") => {
    if (sortBy !== column) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5 text-blue-400 font-bold" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5 text-blue-400 font-bold" />
    );
  };

  // Error State Rendering
  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-8 text-center text-rose-300">
        <h3 className="text-base font-semibold">Failed to load customer dataset</h3>
        <p className="mt-1 text-xs text-rose-400">{errorMessage || "An unexpected error occurred."}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          className="mt-4 border-rose-800 text-rose-300 hover:bg-rose-900/50"
        >
          Retry Load
        </Button>
      </div>
    );
  }

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-14 w-full rounded-xl bg-slate-800/40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (customers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
        <Building2 className="mx-auto h-10 w-10 text-slate-600 mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No customers found</h3>
        <p className="mt-1 text-xs text-slate-400">
          Try adjusting your search criteria or clearing active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table Layout (Visible on sm and above) */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800/80 bg-slate-950/80 text-xs uppercase text-slate-400 font-semibold tracking-wider">
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
                    className="flex items-center hover:text-slate-100 transition-colors"
                  >
                    <span>Name</span>
                    {renderSortIcon("name")}
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button
                    onClick={() => onSortChange("email")}
                    className="flex items-center hover:text-slate-100 transition-colors"
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
                    className="flex items-center hover:text-slate-100 transition-colors"
                  >
                    <span>Last Contact</span>
                    {renderSortIcon("lastContactDate")}
                  </button>
                </th>
                <th className="w-24 px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
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
                    className={`group cursor-pointer transition-colors hover:bg-slate-800/50 ${
                      isSelected ? "bg-blue-950/20" : ""
                    }`}
                  >
                    {/* Select Checkbox */}
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelectToggle(customer.id)}
                      />
                    </td>

                    {/* Name with Avatar */}
                    <td className="px-4 py-3.5 font-medium text-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 font-semibold text-slate-200 text-xs border border-slate-700">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold hover:text-blue-400 transition-colors">
                            {customer.name}
                          </p>
                          {customer.jobTitle && (
                            <p className="text-[11px] text-slate-400 font-normal">{customer.jobTitle}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 text-slate-300 font-mono text-xs">
                      {customer.email}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 text-slate-300 font-mono text-xs">
                      {customer.phone}
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3.5 text-slate-200 font-medium">
                      {customer.company}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`${badgeVariant.bg} ${badgeVariant.text} ${badgeVariant.border} capitalize font-semibold`}
                      >
                        {customer.status}
                      </Badge>
                    </td>

                    {/* Last Contact Date */}
                    <td className="px-4 py-3.5 text-slate-300 text-xs">
                      {formatDate(customer.lastContactDate)}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onViewDetails(customer)}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(customer)}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(customer)}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
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

      {/* Mobile Responsive Cards Layout (Visible below sm breakpoint) */}
      <div className="sm:hidden space-y-3">
        {customers.map((customer) => {
          const isSelected = selectedIds.includes(customer.id);
          const badgeVariant = getStatusBadgeVariant(customer.status);

          return (
            <div
              key={customer.id}
              onClick={() => onViewDetails(customer)}
              className={`rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 cursor-pointer ${
                isSelected ? "border-blue-500 bg-blue-950/20" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectToggle(customer.id)}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{customer.name}</h4>
                    <p className="text-xs text-slate-400">{customer.company}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${badgeVariant.bg} ${badgeVariant.text} ${badgeVariant.border} capitalize text-[10px]`}
                >
                  {customer.status}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3.5 w-3.5 text-slate-500" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Last contact: {formatDate(customer.lastContactDate)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(customer);
                  }}
                  className="h-7 text-xs border-slate-700 bg-slate-800"
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
                  className="h-7 text-xs bg-rose-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls Matching PDF Mockup Page 2 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 text-xs text-slate-400">
        <div>
          Showing{" "}
          <strong className="text-slate-200">
            {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}
          </strong>{" "}
          to{" "}
          <strong className="text-slate-200">{Math.min(page * pageSize, totalCount)}</strong> of{" "}
          <strong className="text-slate-200">{totalCount}</strong> entries
        </div>

        <div className="flex items-center space-x-4">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Next / Prev Pagination Buttons */}
          <div className="flex items-center space-x-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-8 px-2.5 border-slate-800 bg-slate-950 text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>

            <span className="px-2 font-medium text-slate-300">
              {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="h-8 px-2.5 border-slate-800 bg-slate-950 text-slate-300 disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
