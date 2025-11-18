import * as shape from "d3-shape";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Grid, LineChart } from "react-native-svg-charts";

export default function ChartCard({ data, stroke = "#34C759", height = 180 }) {
  return (
    <View style={styles.card}>
      <LineChart
        style={{ height, borderRadius: 12 }}
        data={data}
        svg={{ stroke, strokeWidth: 3 }}
        contentInset={{ top: 20, bottom: 20 }}
        curve={shape.curveMonotoneX}
      >
        <Grid svg={{ stroke: "#e2e8f0", strokeDasharray: "4,4" }} />
      </LineChart>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
});
