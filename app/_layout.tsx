import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import SignInScreen from "./SignInScreen";

export const unstable_settings = {
  anchor: "(tabs)",
};
function AuthGate() {
  const { user } = useAuth();
  // For now, skip auth (uncomment when needed)
  if (!user) return <SignInScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Modal screen */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ActivityDetail" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />

      {/* Home (index) screen will auto-load from app/index.tsx */}
    </Stack>
  );
}
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
