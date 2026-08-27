import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { CustomerQueryParams, PaginatedCustomersResponse } from "@/types";

async function fetchCustomers(params: CustomerQueryParams & { page?: number }): Promise<PaginatedCustomersResponse> {
  const urlParams = new URLSearchParams();

  if (params.search) urlParams.set("search", params.search);
  if (params.status && params.status.length > 0) urlParams.set("status", params.status.join(","));
  if (params.companies && params.companies.length > 0) urlParams.set("company", params.companies.join(","));
  if (params.dateFrom) urlParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) urlParams.set("dateTo", params.dateTo);
  if (params.phoneContains) urlParams.set("phoneContains", params.phoneContains);
  if (params.emailContains) urlParams.set("emailContains", params.emailContains);
  if (params.sortBy) urlParams.set("sortBy", params.sortBy);
  if (params.sortOrder) urlParams.set("sortOrder", params.sortOrder);
  if (params.page) urlParams.set("page", params.page.toString());
  if (params.pageSize) urlParams.set("pageSize", params.pageSize.toString());

  const response = await fetch(`/api/customers?${urlParams.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch customers");
  }
  return response.json();
}

// Table View Hook: Paginated useQuery
export function useCustomers(params: CustomerQueryParams) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => fetchCustomers(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

// Card View Hook: Infinite Scroll useInfiniteQuery (Item 1)
export function useInfiniteCustomers(params: Omit<CustomerQueryParams, "page" | "pageSize"> & { pageSize?: number }) {
  const pageSize = params.pageSize || 20;

  return useInfiniteQuery({
    queryKey: ["customers-infinite", { ...params, pageSize }],
    queryFn: ({ pageParam = 1 }) => fetchCustomers({ ...params, page: pageParam as number, pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}
