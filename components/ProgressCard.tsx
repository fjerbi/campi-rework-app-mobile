import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

export default function ProgressCard({ icon, label, value, color, bg, data }) {
  // Convert plain number array to GiftedChart format
  const chartData = data.map((v) => ({ value: v }));

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: color + "22" }]}>
          <MaterialIcons name={icon} size={22} color={color} />
        </View>

        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>

      <Text style={styles.label}>{label}</Text>

      <LineChart
        data={chartData}
        thickness={3}
        hideDataPoints
        color={color}
        width={width * 0.3}
        height={90}
        hideYAxisText
        hideRules
        initialSpacing={0}
        spacing={18}
        isAnimated
        curve="natural" // smooth curve
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.44,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#4a4a4a",
    marginBottom: 10,
  },
});
