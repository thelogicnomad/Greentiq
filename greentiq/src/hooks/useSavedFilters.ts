import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SavedFilter } from "@/types";
import { SavedFilterFormValues } from "@/lib/schemas";
import { toast } from "sonner";

async function fetchSavedFilters(): Promise<SavedFilter[]> {
  const response = await fetch("/api/saved-filters");
  if (!response.ok) {
    throw new Error("Failed to fetch saved filters");
  }
  return response.json();
}

export function useSavedFilters() {
  return useQuery({
    queryKey: ["saved-filters"],
    queryFn: fetchSavedFilters,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddSavedFilter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SavedFilterFormValues) => {
      const response = await fetch("/api/saved-filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save filter preset");
      }
      return response.json();
    },
    onSuccess: (newFilter: SavedFilter) => {
      queryClient.invalidateQueries({ queryKey: ["saved-filters"] });
      toast.success(`Filter preset "${newFilter.name}" saved`);
    },
    onError: (error: Error) => {
      toast.error(`Error saving filter: ${error.message}`);
    },
  });
}

export function useDeleteSavedFilter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/saved-filters/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete saved filter");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-filters"] });
      toast.success("Filter preset deleted");
    },
    onError: (error: Error) => {
      toast.error(`Error deleting saved filter: ${error.message}`);
    },
  });
}

export function useReorderSavedFilters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const response = await fetch("/api/saved-filters/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to persist filter order");
      }
      return response.json();
    },
    onMutate: async (orderedIds: string[]) => {
      await queryClient.cancelQueries({ queryKey: ["saved-filters"] });
      const previousFilters = queryClient.getQueryData<SavedFilter[]>(["saved-filters"]);

      if (previousFilters) {
        const filterMap = new Map(previousFilters.map((f) => [f.id, f]));
        const reordered = orderedIds
          .map((id, index) => {
            const f = filterMap.get(id);
            return f ? { ...f, order: index } : null;
          })
          .filter((f): f is SavedFilter => f !== null);

        queryClient.setQueryData(["saved-filters"], reordered);
      }

      return { previousFilters };
    },
    onError: (_error, _orderedIds, context) => {
      if (context?.previousFilters) {
        queryClient.setQueryData(["saved-filters"], context.previousFilters);
      }
      toast.error("Failed to update filter order");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-filters"] });
    },
  });
}
