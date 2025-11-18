import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function Header({ userName = "John" }) {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#F8FAFC"]}
      style={styles.headerGradient}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userName} 👋</Text>
        </View>

        <Ionicons name="person-circle-outline" size={44} color="#1a1a1a" />
      </View>

      <Animated.View
        entering={FadeInDown.duration(600)}
        style={styles.titleBox}
      >
        <Text style={styles.title}>Become Healthy &</Text>
        <Text style={styles.title}>Stay Resilient.</Text>
        <Text style={styles.date}>Today, 8 January 2025</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingBottom: 32,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 2,
  },
  titleBox: { marginTop: 10 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 34,
  },
  date: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 6,
  },
});
