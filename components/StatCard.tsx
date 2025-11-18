import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function StatCard({ icon, label, value, color }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    width: width * 0.215,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  value: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  label: { fontSize: 12, color: "#64748b", marginTop: 2 },
});
