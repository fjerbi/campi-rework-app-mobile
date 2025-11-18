import { friends } from "@/data/mockData";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function FriendCard() {
  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.card}>
      <Text style={styles.title}>Friends</Text>

      {friends.map((f) => (
        <View key={f.id} style={styles.row}>
          <Image source={{ uri: f.avatar }} style={styles.avatar} />
          <Text style={styles.activity}>{f.activity}</Text>
        </View>
      ))}

      <Text style={styles.seeAll}>See all</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.3,
    backgroundColor: "rgba(39,39,39,0.9)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  title: { color: "#fff", fontSize: 16, fontWeight: "600", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  activity: { color: "#fff", fontSize: 10 },
  seeAll: {
    color: "#34C759",
    marginTop: 12,
    textAlign: "right",
    fontWeight: "600",
    fontSize: 13,
  },
});
