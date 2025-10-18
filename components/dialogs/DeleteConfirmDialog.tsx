import { BorderRadius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DeleteConfirmDialogProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

export default function DeleteConfirmDialog({
  visible,
  onCancel,
  onConfirm,
  isLoading = false,
  title = "Delete Product",
  message = "Are you sure you want to delete this product? This action cannot be undone.",
}: DeleteConfirmDialogProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning-outline" size={48} color={colors.error} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: Spacing.lg,
    },
    dialog: {
      backgroundColor: colors.background.primary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xl,
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    iconContainer: {
      marginBottom: Spacing.md,
    },
    title: {
      ...Typography.heading2,
      color: colors.text.primary,
      marginBottom: Spacing.sm,
      textAlign: "center",
    },
    message: {
      ...Typography.body,
      color: colors.text.secondary,
      textAlign: "center",
      marginBottom: Spacing.xl,
      lineHeight: 22,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: Spacing.md,
      width: "100%",
    },
    button: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
    },
    cancelButton: {
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    cancelButtonText: {
      ...Typography.body,
      color: colors.text.primary,
      fontWeight: "600",
    },
    confirmButton: {
      backgroundColor: colors.error,
    },
    confirmButtonText: {
      ...Typography.body,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    buttonDisabled: {
      opacity: 0.6,
    },
  });
