import { AuthGuard } from "@/components/AuthGuard";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { BiometricProvider } from "@/components/providers/BiometricProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { queryClient } from "@/services/queryClient";
import { createMMKVPersister } from "@/services/queryPersister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "../store";
import { restoreAuth } from "../store/authSlice";

// create mmkv persister for offline cache
const persister = createMMKVPersister();

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      // restore auth state
      store.dispatch(restoreAuth());
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
              persister,
              maxAge: 24 * 60 * 60 * 1000, // 24 hours
            }}
          >
            <AuthGuard>
              <BiometricProvider>
                <View style={{ flex: 1 }}>
                  <OfflineIndicator />
                  <StatusBar style="auto" />
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="auth/login" />
                    <Stack.Screen name="(tabs)" />
                  </Stack>
                </View>
              </BiometricProvider>
            </AuthGuard>
          </PersistQueryClientProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
