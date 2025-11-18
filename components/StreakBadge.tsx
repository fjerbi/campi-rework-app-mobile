import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function StreakBadge({ days = 7 }) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="local-fire-department" size={32} color="#FF6B00" />
      <Text style={styles.text}>{days}-Day Streak!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 243, 224, 0.9)",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  text: {
    marginLeft: 12,
    fontFamily: "Inter_700Bold",
    fontSize: 19,
    color: "#FF6B00",
  },
});
