export type CustomerStatus = "active" | "prospect" | "lead" | "inactive" | "archived";

export interface CustomerNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  jobTitle?: string;
  dealValue?: number;
  accountOwner?: string;
  lastContactDate: string; // ISO date
  createdDate: string; // ISO date
  notes: CustomerNote[];
}

export interface FilterState {
  status: CustomerStatus[];
  companies: string[];
  dateFrom?: string;
  dateTo?: string;
  phoneContains?: string;
  emailContains?: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  isPinned: boolean;
  order: number;
  filters: FilterState;
}

export interface CustomerQueryParams {
  search?: string;
  status?: CustomerStatus[];
  companies?: string[];
  dateFrom?: string;
  dateTo?: string;
  phoneContains?: string;
  emailContains?: string;
  sortBy?: "name" | "email" | "lastContactDate" | "company" | "dealValue";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface PaginatedCustomersResponse {
  data: Customer[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  availableCompanies: string[];
}
