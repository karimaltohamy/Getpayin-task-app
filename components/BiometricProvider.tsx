import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useInactivity } from "@/hooks/useInactivity";
import { useAppState } from "@/hooks/useAppState";
import { BiometricLockScreen } from "./BiometricLockScreen";

interface BiometricProviderProps {
  children: ReactNode;
}

export function BiometricProvider({ children }: BiometricProviderProps) {
  // Initialize inactivity tracking
  const { panResponder } = useInactivity();

  // Initialize app state monitoring
  useAppState();

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
      <BiometricLockScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
