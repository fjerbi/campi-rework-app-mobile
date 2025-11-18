import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import { calorieData, heartRateData } from "@/data/mockData";
import ProgressCard from "./ProgressCard";

const { width } = Dimensions.get("window");

export default function ProgressRow() {
  return (
    <View style={styles.row}>
      <ProgressCard
        icon="local-fire-department"
        label="Calories Burnt"
        value="520"
        data={calorieData}
        color="#FF6B00"
        bg="#FFF3E0"
      />
      <ProgressCard
        icon="favorite"
        label="Heart Rate"
        value="102"
        data={heartRateData}
        color="#E91E63"
        bg="#FFEBEE"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between" },
});
