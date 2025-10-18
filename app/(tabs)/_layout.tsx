import { BorderRadius, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { logout } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Alert, Platform } from "react-native";

export default function TabsLayout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { colors } = useTheme();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          position: "absolute",
          // width: "95%",
          alignSelf: "center",
          bottom: Spacing.lg,
          backgroundColor: colors.background.primary,
          borderTopWidth: 0,
          borderRadius: BorderRadius.xl + Spacing.xl,
          paddingTop: Spacing.sm,
          paddingBottom: Spacing.sm,
          paddingHorizontal: Spacing.sm,
          ...Shadows.lg,
          borderWidth: 1,
          borderColor: colors.border.light,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          borderRadius: BorderRadius.lg,
          marginHorizontal: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: "Category",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "filter" : "filter-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="signout"
        options={{
          title: "Sign Out",
          tabBarIcon: ({ color }) => (
            <Ionicons name="log-out-outline" size={24} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleSignOut();
          },
        }}
      />
    </Tabs>
  );
}
