import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Section({ title, children }) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 32, paddingHorizontal: 20 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 21,
    color: "#1e293b",
    marginBottom: 16,
  },
});
