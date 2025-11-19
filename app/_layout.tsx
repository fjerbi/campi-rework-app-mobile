import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useEffect } from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/authStore";
import SignInScreen from "./SignInScreen";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AuthGate() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const verifyStoredAuth = useAuthStore((s) => s.verifyStoredAuth);

  // 🔥 Load token + verify on app start
  useEffect(() => {
    verifyStoredAuth();
  }, []);

  // Show splash while checking auth
  if (loading) return null; // or your custom splash screen

  // Not authenticated → show login page
  if (!user) return <SignInScreen />;

  // Authenticated → load app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="ActivityDetail" />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* ❌ Removed AuthProvider — not needed with Zustand */}
      <AuthGate />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
