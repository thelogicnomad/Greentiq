"use client";

import React, { useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Customer, CustomerStatus, FilterState } from "@/types";
import { STATUSES } from "@/lib/api/seed";
import { useCustomers } from "@/hooks/useCustomers";
import { useDeleteCustomer, useUpdateCustomer } from "@/hooks/useCustomerMutations";
import { AppSidebar } from "@/components/crm/AppSidebar";
import { DashboardStatCards } from "@/components/crm/DashboardStatCards";
import { CustomerTable } from "@/components/crm/CustomerTable";
import { AdvancedFiltersSheet } from "@/components/crm/AdvancedFiltersSheet";
import { CustomerDetailsDrawer } from "@/components/crm/CustomerDetailsDrawer";
import { CustomerFormModal } from "@/components/crm/CustomerFormModal";
import { DeleteConfirmDialog } from "@/components/crm/DeleteConfirmDialog";
import { BulkActionsBar } from "@/components/crm/BulkActionsBar";
import { KeyboardShortcutsHelp } from "@/components/crm/KeyboardShortcutsHelp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Filter,
  Download,
  X,
  Keyboard,
  Menu,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function CRMDashboardPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "contacts" | "deals" | "tasks" | "settings">("contacts");

  // Search state with 300ms debounce
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    companies: [],
    dateFrom: undefined,
    dateTo: undefined,
    phoneContains: undefined,
    emailContains: undefined,
  });

  // Sorting & Pagination
  const [sortBy, setSortBy] = useState<"name" | "email" | "lastContactDate">("lastContactDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk selections
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals / Drawers state
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerToView, setCustomerToView] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Query parameters composer
  const queryParams = {
    search: debouncedSearch || undefined,
    status: filters.status,
    companies: filters.companies,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    phoneContains: filters.phoneContains,
    emailContains: filters.emailContains,
    sortBy,
    sortOrder,
    page,
    pageSize,
  };

  // TanStack Query for customer list
  const { data, isLoading, isError, error } = useCustomers(queryParams);

  const customers = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;
  const availableCompanies = data?.availableCompanies || [];

  const deleteMutation = useDeleteCustomer();
  const updateMutation = useUpdateCustomer();

  // Active filter count calculation
  const activeFilterCount =
    (filters.status?.length || 0) +
    (filters.companies?.length || 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.phoneContains ? 1 : 0) +
    (filters.emailContains ? 1 : 0);

  // Sorting Handler
  const handleSortChange = (column: "name" | "email" | "lastContactDate") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Bulk Selection Handlers
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllToggle = (allIds: string[]) => {
    const isAllSelected = allIds.every((id) => selectedIds.includes(id));
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => deleteMutation.mutateAsync(id)));
      toast.success(`Deleted ${selectedIds.length} customers`);
      setSelectedIds([]);
    } catch (err) {
      toast.error("Failed to delete some selected customers");
    }
  };

  const handleBulkStatusChange = async (newStatus: CustomerStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((id) => updateMutation.mutateAsync({ id, data: { status: newStatus } }))
      );
      toast.success(`Updated status of ${selectedIds.length} customers to ${newStatus}`);
      setSelectedIds([]);
    } catch (err) {
      toast.error("Failed to update status for selected customers");
    }
  };

  // CSV Export Feature
  const handleExportCsv = () => {
    if (customers.length === 0) {
      toast.error("No customers available to export");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "Company", "Status", "Job Title", "Deal Value", "Account Owner", "Last Contact Date"];
    const rows = customers.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${c.phone.replace(/"/g, '""')}"`,
      `"${c.company.replace(/"/g, '""')}"`,
      c.status,
      `"${(c.jobTitle || "").replace(/"/g, '""')}"`,
      c.dealValue || 0,
      `"${(c.accountOwner || "").replace(/"/g, '""')}"`,
      c.lastContactDate,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `crm-customers-export-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased">
      {/* App Sidebar (Desktop) */}
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between border-b border-slate-800 bg-slate-950 p-4 sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-bold text-slate-100 text-base">Advanced CRM</span>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setCustomerToEdit(null);
              setIsAddEditModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-xs"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </header>

        {/* Page Main Content Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Dashboard Stat Cards */}
          <DashboardStatCards totalCustomers={totalCount} isLoading={isLoading} />

          {/* Contacts Section Header & Toolbar matching Mockup Page 2 */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">Customers</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage contacts, filter sales pipelines, and track interaction timelines.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  className="border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 text-xs"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-400" /> Export CSV
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setCustomerToEdit(null);
                    setIsAddEditModalOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 font-semibold text-xs shadow-md"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add Customer
                </Button>
              </div>
            </div>

            {/* Filter & Search Bar matching PDF Mockup Page 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 shadow-lg backdrop-blur-md">
              {/* Search Bar with Debounce */}
              <div className="relative md:col-span-6 lg:col-span-6">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search customers by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 pr-9 bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 h-9 text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Quick Status Dropdown Filter */}
              <div className="md:col-span-3 lg:col-span-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-9 w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 px-3 text-xs text-slate-300 hover:border-slate-700">
                      <span className="truncate">
                        Status:{" "}
                        <strong className="text-slate-100 capitalize">
                          {filters.status && filters.status.length > 0
                            ? `${filters.status.length} selected`
                            : "All"}
                        </strong>
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <DropdownMenuItem
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, status: [] }));
                        setPage(1);
                      }}
                      className="text-xs cursor-pointer"
                    >
                      All Statuses
                    </DropdownMenuItem>
                    {STATUSES.map((st) => (
                      <DropdownMenuItem
                        key={st}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            status: [st],
                          }));
                          setPage(1);
                        }}
                        className="capitalize text-xs cursor-pointer"
                      >
                        {st}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Advanced Filters Button with Badge */}
              <div className="md:col-span-3 lg:col-span-4 flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFiltersSheetOpen(true)}
                  className={`h-9 w-full md:w-auto text-xs border-slate-800 bg-slate-950/80 font-medium ${
                    activeFilterCount > 0
                      ? "border-blue-500/50 text-blue-300 bg-blue-500/10"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Filter className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
                  Advanced Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Customer Table / Card List */}
          <CustomerTable
            customers={customers}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error instanceof Error ? error.message : undefined}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
            selectedIds={selectedIds}
            onSelectToggle={handleSelectToggle}
            onSelectAllToggle={handleSelectAllToggle}
            onViewDetails={(c) => setCustomerToView(c)}
            onEdit={(c) => {
              setCustomerToEdit(c);
              setIsAddEditModalOpen(true);
            }}
            onDelete={(c) => setCustomerToDelete(c)}
          />
        </main>
      </div>

      {/* Slide-out Advanced Filters Sheet */}
      <AdvancedFiltersSheet
        isOpen={isFiltersSheetOpen}
        onClose={() => setIsFiltersSheetOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
        availableCompanies={availableCompanies}
        activeFilterCount={activeFilterCount}
      />

      {/* Customer Details Drawer */}
      <CustomerDetailsDrawer
        customer={customerToView}
        isOpen={Boolean(customerToView)}
        onClose={() => setCustomerToView(null)}
        onEdit={(c) => {
          setCustomerToView(null);
          setCustomerToEdit(c);
          setIsAddEditModalOpen(true);
        }}
        onDelete={(c) => {
          setCustomerToView(null);
          setCustomerToDelete(c);
        }}
      />

      {/* Add / Edit Customer Modal */}
      <CustomerFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setCustomerToEdit(null);
        }}
        customerToEdit={customerToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        customer={customerToDelete}
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
      />

      {/* Floating Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        onExportCsv={handleExportCsv}
      />

      {/* Keyboard Shortcuts Listener */}
      <KeyboardShortcutsHelp
        onToggleFilters={() => setIsFiltersSheetOpen((prev) => !prev)}
        onFocusSearch={() => searchInputRef.current?.focus()}
        onOpenAddModal={() => {
          setCustomerToEdit(null);
          setIsAddEditModalOpen(true);
        }}
      />
    </div>
  );
}
