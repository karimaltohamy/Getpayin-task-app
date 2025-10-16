import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useBiometric } from "@/hooks/useBiometric";
import { useAppSelector } from "@/store/hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export function BiometricLockScreen() {
  const { isLocked, requiresUnlock } = useAppSelector(
    (state) => state.biometric
  );
  const { authenticate, isAuthenticating, getBiometricTypeName } =
    useBiometric();
  const [biometricType, setBiometricType] = useState<string>("Biometric");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // get biometric type name
    getBiometricTypeName().then(setBiometricType);

    // auto-trigger authentication when lock screen appears
    if ((isLocked || requiresUnlock) && !isAuthenticating) {
      handleAuthenticate();
    }
  }, [isLocked, requiresUnlock]);

  const handleAuthenticate = async () => {
    setError("");
    const result = await authenticate({
      promptMessage: `Use ${biometricType} to unlock`,
      cancelLabel: "Cancel",
    });

    if (!result.success) {
      setError(result.error || "Authentication failed");
    }
  };

  const getBiometricIcon = () => {
    if (biometricType === "Face ID") {
      return "face";
    } else if (biometricType === "Touch ID") {
      return "fingerprint";
    }
    return "lock";
  };

  if (!isLocked && !requiresUnlock) {
    return null;
  }

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" ? (
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
      ) : (
        <View style={styles.androidBlur} />
      )}

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={getBiometricIcon()}
            size={80}
            color={Colors.primary}
          />
        </View>

        <Text style={styles.title}>App Locked</Text>
        <Text style={styles.subtitle}>
          Use {biometricType} to unlock and continue
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons
              name="error-outline"
              size={20}
              color={Colors.error}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.unlockButton}
          onPress={handleAuthenticate}
          disabled={isAuthenticating}
        >
          {isAuthenticating ? (
            <ActivityIndicator color={Colors.text.inverse} />
          ) : (
            <>
              <MaterialIcons
                name={getBiometricIcon()}
                size={24}
                color={Colors.text.inverse}
              />
              <Text style={styles.unlockButtonText}>
                Unlock with {biometricType}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.infoText}>
          The app has been locked due to inactivity or being sent to the
          background
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    zIndex: 9999,
  },
  androidBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.heading1,
    color: Platform.OS === "ios" ? Colors.text.inverse : Colors.text.inverse,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.body,
    color: Platform.OS === "ios" ? Colors.text.tertiary : Colors.text.tertiary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.error}20`,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    flex: 1,
  },
  unlockButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    minWidth: 240,
    gap: Spacing.sm,
  },
  unlockButtonText: {
    ...Typography.buttonText,
    color: Colors.text.inverse,
  },
  infoText: {
    ...Typography.caption,
    color: Platform.OS === "ios" ? Colors.text.tertiary : Colors.text.tertiary,
    textAlign: "center",
    marginTop: Spacing.xl,
    maxWidth: 280,
  },
});
