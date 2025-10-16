import { Colors } from "@/constants/theme";
import { restoreAuthAsync } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const hasInitialized = useRef(false);

  useEffect(() => {
    dispatch(restoreAuthAsync());
  }, []);

  // handle routing based on auth state
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!hasInitialized.current) {
      hasInitialized.current = true;
    }

    const inAuthGroup = segments[0] === "auth";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // show loading screen while restoring auth state
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background.primary,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}
