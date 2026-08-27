import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Customer, CustomerQueryParams, PaginatedCustomersResponse } from "@/types";
import { CustomerFormValues } from "@/lib/schemas";
import { toast } from "sonner";

export function useAddCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CustomerFormValues) => {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create customer");
      }
      return response.json();
    },
    onSuccess: (newCustomer: Customer) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers-infinite"] });
      toast.success(`Customer "${newCustomer.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error creating customer: ${error.message}`);
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CustomerFormValues> }) => {
      const response = await fetch(`/api/customers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update customer");
      }
      return response.json();
    },
    onSuccess: (updatedCustomer: Customer) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers-infinite"] });
      toast.success(`Customer "${updatedCustomer.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error updating customer: ${error.message}`);
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete customer");
      }
      return response.json();
    },
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: ["customers"] });
      await queryClient.cancelQueries({ queryKey: ["customers-infinite"] });

      const previousQueries = queryClient.getQueriesData<PaginatedCustomersResponse>({ queryKey: ["customers"] });

      queryClient.setQueriesData<PaginatedCustomersResponse>(
        { queryKey: ["customers"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((c) => c.id !== deletedId),
            totalCount: Math.max(0, oldData.totalCount - 1),
          };
        }
      );

      return { previousQueries };
    },
    onError: (error: Error, _deletedId, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Error deleting customer: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Customer deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers-infinite"] });
    },
  });
}

export function useAddCustomerNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, content }: { customerId: string; content: string }) => {
      const response = await fetch(`/api/customers/${customerId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to add note");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers-infinite"] });
      toast.success("Note added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Error adding note: ${error.message}`);
    },
  });
}
