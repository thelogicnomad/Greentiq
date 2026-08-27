"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Customer, CustomerStatus, FilterState } from "@/types";
import { STATUSES } from "@/lib/api/seed";
import { useCustomers, useInfiniteCustomers } from "@/hooks/useCustomers";
import { useDeleteCustomer, useUpdateCustomer } from "@/hooks/useCustomerMutations";
import { AppSidebar } from "@/components/crm/AppSidebar";
import { TopNavbar } from "@/components/crm/TopNavbar";
import { DashboardStatCards } from "@/components/crm/DashboardStatCards";
import { CustomerTable } from "@/components/crm/CustomerTable";
import { AdvancedFiltersSheet } from "@/components/crm/AdvancedFiltersSheet";
import { CustomerDetailsModal } from "@/components/crm/CustomerDetailsModal";
import { CustomerFormModal } from "@/components/crm/CustomerFormModal";
import { DeleteConfirmDialog } from "@/components/crm/DeleteConfirmDialog";
import { BulkDeleteConfirmDialog } from "@/components/crm/BulkDeleteConfirmDialog";
import { BulkActionsBar } from "@/components/crm/BulkActionsBar";
import { KeyboardShortcutsHelp } from "@/components/crm/KeyboardShortcutsHelp";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Filter,
  Download,
  X,
  ChevronDown,
  Table as TableIcon,
  LayoutGrid,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function CRMDashboardPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "contacts" | "deals" | "tasks" | "settings">("dashboard");

  // View Mode: Table vs Card (Item 1 & 2)
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Initialized viewMode based on viewport width on first mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setViewMode("card");
    }
  }, []);

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

  // Sorting & Pagination (Table View)
  const [sortBy, setSortBy] = useState<"name" | "email" | "lastContactDate">("lastContactDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk selections & Bulk Delete Modal state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Modals / Drawers state
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerToView, setCustomerToView] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

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
  };

  // Table View Query (Paginated)
  const tableQueryResult = useCustomers({ ...queryParams, page, pageSize });

  // Card View Query (Infinite Scroll)
  const infiniteQueryResult = useInfiniteCustomers(queryParams);

  const customers = tableQueryResult.data?.data || [];
  const totalCount = tableQueryResult.data?.totalCount || 0;
  const totalPages = tableQueryResult.data?.totalPages || 1;
  const availableCompanies = tableQueryResult.data?.availableCompanies || infiniteQueryResult.data?.pages[0]?.availableCompanies || [];

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

  // Bulk Actions: Confirmed Deletion
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => deleteMutation.mutateAsync(id)));
      toast.success(`Deleted ${selectedIds.length} customers`);
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
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
    const exportList = viewMode === "card"
      ? (infiniteQueryResult.data?.pages.flatMap((p) => p.data) || [])
      : customers;

    if (exportList.length === 0) {
      toast.error("No customers available to export");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "Company", "Status", "Job Title", "Deal Value", "Account Owner", "Last Contact Date"];
    const rows = exportList.map((c) => [
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
    <div className="flex min-h-screen bg-background text-foreground antialiased transition-colors duration-200">
      {/* App Sidebar (Desktop) */}
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar
          onOpenAddModal={() => {
            setCustomerToEdit(null);
            setIsAddEditModalOpen(true);
          }}
        />

        {/* Page Main Content Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Dashboard Stat Cards */}
          <DashboardStatCards totalCustomers={totalCount} isLoading={tableQueryResult.isLoading} />

          {/* Contacts Section Header & Toolbar */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage contacts, filter sales pipelines, and track interaction timelines.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Table / Card View Mode Toggle Group */}
                <div className="flex items-center space-x-1 border border-border bg-muted/40 p-0.5 rounded-lg h-9">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setViewMode("table")}
                        className={`flex items-center justify-center h-8 w-8 rounded text-xs font-medium transition-colors ${
                          viewMode === "table"
                            ? "bg-card text-primary shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <TableIcon className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Table view</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setViewMode("card")}
                        className={`flex items-center justify-center h-8 w-8 rounded text-xs font-medium transition-colors ${
                          viewMode === "card"
                            ? "bg-card text-primary shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Card view</TooltipContent>
                  </Tooltip>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  className="h-9 border-border bg-background text-foreground hover:bg-accent text-xs"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> Export CSV
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setCustomerToEdit(null);
                    setIsAddEditModalOpen(true);
                  }}
                  className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs shadow-xs"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add Customer
                </Button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center rounded-2xl border border-border bg-card p-3 shadow-xs backdrop-blur-md">
              {/* Search Bar */}
              <div className="relative md:col-span-7 lg:col-span-8">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search customers by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 pr-9 bg-background border-input text-foreground placeholder:text-muted-foreground h-9 text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Quick Status Dropdown Filter */}
              <div className="md:col-span-2 lg:col-span-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-xs text-foreground hover:border-border">
                      <span className="truncate">
                        Status:{" "}
                        <strong className="text-foreground capitalize">
                          {filters.status && filters.status.length > 0
                            ? `${filters.status.length} selected`
                            : "All"}
                        </strong>
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
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
              <div className="md:col-span-3 lg:col-span-2 flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFiltersSheetOpen(true)}
                  className={`h-9 w-full text-xs font-medium transition-colors ${
                    activeFilterCount > 0
                      ? "border-primary text-primary bg-primary/10 hover:bg-primary/20"
                      : "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Filter className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-none shrink-0">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Customer Table / Card View */}
          <CustomerTable
            customers={customers}
            isLoading={tableQueryResult.isLoading}
            isFetching={tableQueryResult.isFetching}
            isError={tableQueryResult.isError}
            errorMessage={tableQueryResult.error instanceof Error ? tableQueryResult.error.message : undefined}
            viewMode={viewMode}
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
            infiniteData={infiniteQueryResult.data}
            isInfiniteLoading={infiniteQueryResult.isLoading}
            isFetchingNextPage={infiniteQueryResult.isFetchingNextPage}
            hasNextPage={infiniteQueryResult.hasNextPage}
            fetchNextPage={infiniteQueryResult.fetchNextPage}
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

      {/* Customer Details Modal */}
      <CustomerDetailsModal
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

      {/* Single Customer Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        customer={customerToDelete}
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
      />

      {/* Bulk Customer Delete Confirmation Dialog */}
      <BulkDeleteConfirmDialog
        selectedCount={selectedIds.length}
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDelete}
        isDeleting={deleteMutation.isPending}
      />

      {/* Floating Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
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
