import { useAppState } from "@/hooks/useAppState";
import { useInactivity } from "@/hooks/useInactivity";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { BiometricLockScreen } from "../BiometricLockScreen";

interface BiometricProviderProps {
  children: ReactNode;
}

export function BiometricProvider({ children }: BiometricProviderProps) {
  const { panResponder } = useInactivity();

  // initialize app state monitoring
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
