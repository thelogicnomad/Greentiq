import { Customer, CustomerNote, CustomerQueryParams, CustomerStatus, PaginatedCustomersResponse, SavedFilter } from "@/types";
import { generateSeedCustomers, generateSeedSavedFilters } from "./seed";

// Global singleton in-memory store attached to globalThis for Next.js App Router cross-route consistency
const globalForCRM = globalThis as unknown as {
  customersStore?: Customer[];
  savedFiltersStore?: SavedFilter[];
};

function getCustomers(): Customer[] {
  if (!globalForCRM.customersStore) {
    globalForCRM.customersStore = generateSeedCustomers(150);
  }
  return globalForCRM.customersStore;
}

function getSavedFiltersStore(): SavedFilter[] {
  if (!globalForCRM.savedFiltersStore) {
    globalForCRM.savedFiltersStore = generateSeedSavedFilters();
  }
  return globalForCRM.savedFiltersStore;
}

export async function simulateLatency(min = 300, max = 600): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export async function queryCustomers(params: CustomerQueryParams): Promise<PaginatedCustomersResponse> {
  await simulateLatency();
  const allCustomers = getCustomers();

  let filtered = [...allCustomers];

  // 1. Search filter across name, email, company
  if (params.search && params.search.trim() !== "") {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
    );
  }

  // 2. Status filter
  if (params.status && params.status.length > 0) {
    const statusSet = new Set(params.status);
    filtered = filtered.filter((c) => statusSet.has(c.status));
  }

  // 3. Company filter
  if (params.companies && params.companies.length > 0) {
    const companySet = new Set(params.companies.map((comp) => comp.toLowerCase()));
    filtered = filtered.filter((c) => companySet.has(c.company.toLowerCase()));
  }

  // 4. Date range filter (lastContactDate)
  if (params.dateFrom) {
    const fromTime = new Date(params.dateFrom).getTime();
    if (!isNaN(fromTime)) {
      filtered = filtered.filter((c) => new Date(c.lastContactDate).getTime() >= fromTime);
    }
  }
  if (params.dateTo) {
    const toDateObj = new Date(params.dateTo);
    toDateObj.setHours(23, 59, 59, 999);
    const toTime = toDateObj.getTime();
    if (!isNaN(toTime)) {
      filtered = filtered.filter((c) => new Date(c.lastContactDate).getTime() <= toTime);
    }
  }

  // 5. Phone contains
  if (params.phoneContains && params.phoneContains.trim() !== "") {
    const p = params.phoneContains.trim().toLowerCase();
    filtered = filtered.filter((c) => c.phone.toLowerCase().includes(p));
  }

  // 6. Email contains
  if (params.emailContains && params.emailContains.trim() !== "") {
    const e = params.emailContains.trim().toLowerCase();
    filtered = filtered.filter((c) => c.email.toLowerCase().includes(e));
  }

  // Sorting
  const sortBy = params.sortBy || "lastContactDate";
  const sortOrder = params.sortOrder || "desc";

  filtered.sort((a, b) => {
    let aVal: string | number = "";
    let bVal: string | number = "";

    if (sortBy === "name") {
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
    } else if (sortBy === "email") {
      aVal = a.email.toLowerCase();
      bVal = b.email.toLowerCase();
    } else if (sortBy === "company") {
      aVal = a.company.toLowerCase();
      bVal = b.company.toLowerCase();
    } else if (sortBy === "dealValue") {
      aVal = a.dealValue || 0;
      bVal = b.dealValue || 0;
    } else {
      aVal = new Date(a.lastContactDate).getTime();
      bVal = new Date(b.lastContactDate).getTime();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const startIndex = (page - 1) * pageSize;
  const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

  const availableCompanies = Array.from(new Set(allCustomers.map((c) => c.company))).sort();

  return {
    data: paginatedData,
    totalCount,
    page,
    pageSize,
    totalPages,
    availableCompanies,
  };
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  await simulateLatency();
  const customers = getCustomers();
  return customers.find((c) => c.id === id) || null;
}

export async function addCustomer(newCustomerData: Omit<Customer, "id" | "createdDate" | "lastContactDate" | "notes"> & { lastContactDate?: string; notes?: string }): Promise<Customer> {
  await simulateLatency();
  const customers = getCustomers();

  const nowISO = new Date().toISOString();
  const newCustomer: Customer = {
    ...newCustomerData,
    id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdDate: nowISO,
    lastContactDate: newCustomerData.lastContactDate || nowISO,
    notes: newCustomerData.notes && newCustomerData.notes.trim()
      ? [{ id: `note-${Date.now()}`, content: newCustomerData.notes.trim(), createdAt: nowISO }]
      : [],
  };

  customers.unshift(newCustomer);
  return newCustomer;
}

export async function updateCustomer(
  id: string,
  updates: Partial<Omit<Customer, "notes">> & { notes?: string | CustomerNote[] }
): Promise<Customer | null> {
  await simulateLatency();
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const existingNotes = customers[index].notes || [];
  let updatedNotes = [...existingNotes];

  if (typeof updates.notes === "string" && updates.notes.trim() !== "") {
    updatedNotes.unshift({
      id: `note-${Date.now()}`,
      content: updates.notes.trim(),
      createdAt: new Date().toISOString(),
    });
  } else if (Array.isArray(updates.notes)) {
    updatedNotes = updates.notes;
  }

  const { notes, ...otherUpdates } = updates;

  const updated = {
    ...customers[index],
    ...otherUpdates,
    notes: updatedNotes,
  };
  customers[index] = updated;
  return updated;
}

export async function deleteCustomer(id: string): Promise<boolean> {
  await simulateLatency();
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return false;

  customers.splice(index, 1);
  return true;
}

export async function addCustomerNote(customerId: string, content: string): Promise<Customer | null> {
  await simulateLatency();
  const customers = getCustomers();
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return null;

  const newNote = {
    id: `note-${Date.now()}`,
    content,
    createdAt: new Date().toISOString(),
  };

  customer.notes.unshift(newNote);
  customer.lastContactDate = newNote.createdAt;
  return customer;
}

// Saved Filters API
export async function getSavedFilters(): Promise<SavedFilter[]> {
  await simulateLatency();
  const filters = getSavedFiltersStore();
  return [...filters].sort((a, b) => a.order - b.order);
}

export async function addSavedFilter(filterData: Omit<SavedFilter, "id" | "order">): Promise<SavedFilter> {
  await simulateLatency();
  const filters = getSavedFiltersStore();
  const newFilter: SavedFilter = {
    ...filterData,
    id: `filter-${Date.now()}`,
    order: filters.length,
  };
  filters.push(newFilter);
  return newFilter;
}

export async function deleteSavedFilter(id: string): Promise<boolean> {
  await simulateLatency();
  const filters = getSavedFiltersStore();
  const index = filters.findIndex((f) => f.id === id);
  if (index === -1) return false;

  filters.splice(index, 1);
  filters.forEach((f, idx) => {
    f.order = idx;
  });
  return true;
}

export async function reorderSavedFilters(orderedIds: string[]): Promise<SavedFilter[]> {
  await simulateLatency();
  const filters = getSavedFiltersStore();

  const filterMap = new Map(filters.map((f) => [f.id, f]));
  const reordered: SavedFilter[] = [];

  orderedIds.forEach((id, index) => {
    const item = filterMap.get(id);
    if (item) {
      item.order = index;
      reordered.push(item);
    }
  });

  filters.forEach((item) => {
    if (!orderedIds.includes(item.id)) {
      item.order = reordered.length;
      reordered.push(item);
    }
  });

  globalForCRM.savedFiltersStore = reordered;
  return reordered;
}
