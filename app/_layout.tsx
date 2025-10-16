import { AuthGuard } from "@/components/AuthGuard";
import { BiometricProvider } from "@/components/BiometricProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "../store";
import { restoreAuth } from "../store/authSlice";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 60 * 60 * 1000, // 1 hour
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      // Restore auth state from storage on app launch
      store.dispatch(restoreAuth());
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthGuard>
            <BiometricProvider>
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth/login/index" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </BiometricProvider>
          </AuthGuard>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
