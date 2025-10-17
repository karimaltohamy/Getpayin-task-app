import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000, // 24 hours - keep data for offline access
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: "offlineFirst", // Show cached data even when offline
    },
    mutations: {
      retry: 1,
      networkMode: "online", // Only allow mutations when online
    },
  },
});
