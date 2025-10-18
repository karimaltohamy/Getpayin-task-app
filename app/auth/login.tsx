import { authApi } from "@/api/auth";
import { LoginCredentials } from "@/api/auth/types";
import { BorderRadius, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { setCredentials } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { loginSchema } from "@/utils/validations/auth";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      const { refreshToken, accessToken, ...userData } = response;

      dispatch(
        setCredentials({
          user: userData,
          token: accessToken,
          refreshToken,
        })
      );

      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.message || "Login failed. Please check your credentials.";

      Alert.alert("Login Failed", errorMessage, [{ text: "OK" }]);
    },
  });

  const formik = useFormik<LoginCredentials>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            {/* error message */}
            {loginMutation.isError && (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={colors.error}
                  style={styles.errorIcon}
                />
                <Text style={styles.errorText}>
                  {(loginMutation.error as any)?.message ||
                    "An error occurred during login"}
                </Text>
              </View>
            )}

            {/* username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <View
                style={[
                  styles.inputWrapper,
                  formik.touched.username && formik.errors.username
                    ? styles.inputWrapperError
                    : null,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.text.tertiary}
                  value={formik.values.username}
                  onChangeText={formik.handleChange("username")}
                  onBlur={formik.handleBlur("username")}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loginMutation.isPending}
                />
              </View>
              {formik.touched.username && formik.errors.username ? (
                <Text style={styles.fieldError}>{formik.errors.username}</Text>
              ) : null}
            </View>

            {/* password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  formik.touched.password && formik.errors.password
                    ? styles.inputWrapperError
                    : null,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.text.tertiary}
                  value={formik.values.password}
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loginMutation.isPending}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.text.tertiary}
                  />
                </TouchableOpacity>
              </View>
              {formik.touched.password && formik.errors.password ? (
                <Text style={styles.fieldError}>{formik.errors.password}</Text>
              ) : null}
            </View>

            {/* test credentials  */}
            <View style={styles.testCredentialsContainer}>
              <View style={styles.testCredentialsHeader}>
                <Ionicons
                  name="information-circle"
                  size={18}
                  color={colors.info}
                />
                <Text style={styles.testCredentialsTitle}>
                  Test Credentials
                </Text>
              </View>
              <View style={styles.credentialRow}>
                <Ionicons
                  name="person"
                  size={14}
                  color={colors.text.tertiary}
                />
                <Text style={styles.testCredentials}>Username: emilys</Text>
              </View>
              <View style={styles.credentialRow}>
                <Ionicons name="key" size={14} color={colors.text.tertiary} />
                <Text style={styles.testCredentials}>Password: emilyspass</Text>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loginMutation.isPending ? styles.loginButtonDisabled : null,
              ]}
              onPress={() => formik.handleSubmit()}
              disabled={loginMutation.isPending}
              activeOpacity={0.8}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#FFFFFF"
                    style={styles.loginButtonIcon}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      padding: Spacing.lg,
    },
    formContainer: {
      width: "100%",
      maxWidth: 400,
      alignSelf: "center",
    },
    header: {
      marginBottom: Spacing.xl + Spacing.md,
      alignItems: "center",
    },
    iconContainer: {
      marginBottom: Spacing.lg,
    },
    iconGradient: {
      width: 80,
      height: 80,
      borderRadius: BorderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
      ...Shadows.lg,
    },
    title: {
      ...Typography.heading1,
      color: colors.text.primary,
      marginBottom: Spacing.sm,
      fontWeight: "700",
    },
    subtitle: {
      ...Typography.body,
      color: colors.text.secondary,
      fontSize: 15,
    },
    errorContainer: {
      backgroundColor: colors.error + "10",
      borderWidth: 1,
      borderColor: colors.error + "40",
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      flexDirection: "row",
      alignItems: "center",
    },
    errorIcon: {
      marginRight: Spacing.sm,
    },
    errorText: {
      ...Typography.body,
      color: colors.error,
      fontSize: 14,
      flex: 1,
    },
    inputContainer: {
      marginBottom: Spacing.lg,
    },
    label: {
      ...Typography.bodyBold,
      color: colors.text.primary,
      marginBottom: Spacing.sm,
      fontSize: 15,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background.secondary,
      borderWidth: 1.5,
      borderColor: colors.border.light,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      ...Shadows.sm,
    },
    inputWrapperError: {
      borderColor: colors.error,
    },
    inputIcon: {
      marginRight: Spacing.sm,
    },
    input: {
      ...Typography.body,
      flex: 1,
      paddingVertical: Platform.OS === "ios" ? Spacing.md + 2 : Spacing.sm + 2,
      color: colors.text.primary,
      fontSize: 18,
    },
    eyeIcon: {
      padding: Spacing.xs,
    },
    fieldError: {
      ...Typography.caption,
      color: colors.error,
      marginTop: Spacing.xs + 2,
      marginLeft: Spacing.xs,
    },
    testCredentialsContainer: {
      backgroundColor: colors.info + "08",
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.lg + Spacing.sm,
      borderWidth: 1,
      borderColor: colors.info + "20",
    },
    testCredentialsHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: Spacing.sm,
      gap: Spacing.xs + 2,
    },
    testCredentialsTitle: {
      ...Typography.bodyBold,
      color: colors.info,
      fontSize: 14,
    },
    credentialRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: Spacing.xs,
      gap: Spacing.sm,
    },
    testCredentials: {
      ...Typography.caption,
      color: colors.text.secondary,
      fontSize: 13,
    },
    loginButton: {
      borderRadius: BorderRadius.lg,
      overflow: "hidden",
      ...Shadows.md,
      paddingVertical: Spacing.md + 2,
      paddingHorizontal: Spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      minHeight: 56,
      backgroundColor: colors.primary,
    },
    loginButtonDisabled: {
      opacity: 1,
    },

    loginButtonText: {
      ...Typography.buttonText,
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "600",
    },
    loginButtonIcon: {
      marginLeft: Spacing.sm,
    },
  });

export default Login;
