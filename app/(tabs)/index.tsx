import { Colors, Typography } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            dispatch(logout());
            router.replace("/auth/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
        </View>

        {/* User Info Card */}
        {user && (
          <View style={styles.userCard}>
            <Image
              source={{ uri: user.image }}
              style={styles.avatar}
              defaultSource={require("../../assets/images/react-logo.png")}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userUsername}>@{user.username}</Text>
            </View>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  userCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: Colors.background.tertiary,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  userUsername: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.inverse,
  },
});

export default Home;
