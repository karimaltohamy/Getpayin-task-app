import { authApi } from "@/api/auth";
import { LoginCredentials } from "@/api/auth/types";
import { Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { setCredentials } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { loginSchema } from "@/utils/validations/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import React from "react";
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
        >
          <View style={styles.formContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {loginMutation.isError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {(loginMutation.error as any)?.message ||
                    "An error occurred during login"}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[
                  styles.input,
                  formik.touched.username && formik.errors.username
                    ? styles.inputError
                    : null,
                ]}
                placeholder="Enter your username"
                placeholderTextColor={colors.text.tertiary}
                value={formik.values.username}
                onChangeText={formik.handleChange("username")}
                onBlur={formik.handleBlur("username")}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loginMutation.isPending}
              />
              {formik.touched.username && formik.errors.username ? (
                <Text style={styles.fieldError}>{formik.errors.username}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  formik.touched.password && formik.errors.password
                    ? styles.inputError
                    : null,
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.tertiary}
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loginMutation.isPending}
              />
              {formik.touched.password && formik.errors.password ? (
                <Text style={styles.fieldError}>{formik.errors.password}</Text>
              ) : null}
            </View>

            <View style={styles.testCredentialsContainer}>
              <Text style={styles.testCredentialsTitle}>Test Credentials:</Text>
              <Text style={styles.testCredentials}>Username: emilys</Text>
              <Text style={styles.testCredentials}>Password: emilyspass</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                loginMutation.isPending ? styles.loginButtonDisabled : null,
              ]}
              onPress={() => formik.handleSubmit()}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
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
      padding: 24,
    },
    formContainer: {
      width: "100%",
      maxWidth: 400,
      alignSelf: "center",
    },
    header: {
      marginBottom: 32,
      alignItems: "center",
    },
    title: {
      ...Typography.heading1,
      color: colors.text.primary,
      marginBottom: 8,
    },
    subtitle: {
      ...Typography.body,
      color: colors.text.secondary,
    },
    errorContainer: {
      backgroundColor: colors.error + "15",
      borderWidth: 1,
      borderColor: colors.error,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    errorText: {
      ...Typography.body,
      color: colors.error,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      ...Typography.bodyBold,
      color: colors.text.primary,
      marginBottom: 8,
    },
    input: {
      ...Typography.body,
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: 8,
      padding: 14,
      color: colors.text.primary,
    },
    inputError: {
      borderColor: colors.error,
    },
    fieldError: {
      ...Typography.caption,
      color: colors.error,
      marginTop: 4,
    },
    testCredentialsContainer: {
      backgroundColor: colors.background.secondary,
      borderRadius: 8,
      padding: 12,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    testCredentialsTitle: {
      ...Typography.bodyBold,
      color: colors.text.secondary,
      marginBottom: 4,
    },
    testCredentials: {
      ...Typography.caption,
      color: colors.text.tertiary,
    },
    loginButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 52,
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      ...Typography.buttonText,
      color: colors.text.inverse,
    },
  });

export default Login;
