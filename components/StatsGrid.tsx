import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import StatCard from "./StatCard";

const { width } = Dimensions.get("window");

export default function StatsGrid() {
  return (
    <View style={styles.row}>
      <StatCard icon="footsteps" label="Steps" value="11,520" color="#4A90E2" />
      <StatCard icon="timer" label="Active" value="68 min" color="#F5A623" />
      <StatCard icon="water" label="Water" value="2.1 L" color="#50C8F1" />
      <StatCard icon="bed" label="Sleep" value="7h 12m" color="#9B59B6" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between" },
});
