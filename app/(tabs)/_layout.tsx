import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2E8B57",
        tabBarInactiveTintColor: Colors.darkGray,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 11,
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name="house.fill"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name="safari.fill"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 32 : 28}
              name="plus.circle.fill"
              color={Colors.forestGreen}
            />
          ),
          tabBarItemStyle: {
            marginTop: -8,
          },
        }}
      />

      <Tabs.Screen
        name="gearexplore"
        options={{
          title: "Gear",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name="gearshape.2.fill"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 30 : 26}
              name="person.circle.fill"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
