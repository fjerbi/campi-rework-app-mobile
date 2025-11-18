import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function RunCard() {
  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.card}>
      <Image
        source={{ uri: "https://openmaptiles.org/img/home-banner-map.png" }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <LinearGradient
        colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={18} color="#fff" />
          <Text style={styles.title}>Today Run</Text>
        </View>

        <View style={styles.distanceRow}>
          <Text style={styles.distance}>19.45</Text>
          <Text style={styles.unit}>km</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>Pace 512</Text>
          <Text style={styles.meta}>Time 1h 42m</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.58,
    height: 220,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 12,
    marginRight: 16,
  },
  content: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
  },
  row: { flexDirection: "row", alignItems: "center" },
  title: { color: "#fff", marginLeft: 8, fontSize: 16, fontWeight: "600" },
  distanceRow: { flexDirection: "row", alignItems: "baseline" },
  distance: { color: "#fff", fontSize: 36, fontWeight: "700" },
  unit: { color: "#fff", fontSize: 18, marginLeft: 4 },
  metaRow: { flexDirection: "row", justifyContent: "space-between" },
  meta: { color: "#fff", opacity: 0.9, fontSize: 13 },
});
