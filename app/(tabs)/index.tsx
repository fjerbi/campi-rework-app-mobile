import { FeedCard } from "@/components/home/FeedCard";
import Header from "@/components/home/Header";
import CreateCampingModal from "@/components/home/ModalCampForm";
import { tripsAPI } from "@/services/api";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Camping color palette
const colors = {
  primary: "#2D5016",
  primaryDark: "#1F3A0F",
  secondary: "#8B7355",
  accent: "#D4772C",
  success: "#4A7C2C",
  warning: "#E89B3C",
  danger: "#C94A3A",
  dark: "#1A2810",
  darkLight: "#3D5A2B",
  gray: "#6B7F5A",
  grayLight: "#9BAA8C",
  light: "#F5F7F2",
  cardBg: "#FFFFFF",
  border: "#D9E3CE",
};

// Mock data for camping feed

export default function Index() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const [showModal, setShowModal] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const router = useRouter();
  const filters = ["All", "Mountain", "Forest", "Lake", "Desert"];

  // Fetch trips from API
  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const response = await tripsAPI.getTrips();
      if (response.success && response.data) {
        // Map API trips to feed format
        const mappedTrips = response.data.map((trip: any) => {
          const organizer = trip.organizer || {};
          const startDate = trip.startDate ? new Date(trip.startDate) : null;
          const endDate = trip.endDate ? new Date(trip.endDate) : null;
          const duration =
            startDate && endDate
              ? `${Math.ceil(
                  (endDate.getTime() - startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                )} nights`
              : "Unknown";

          return {
            id: trip._id,
            isLiked: false,
            user: {
              name: organizer.first_name
                ? `${organizer.first_name} ${organizer.last_name || ""}`
                : "Unknown Organizer",
              avatar:
                organizer.picture ||
                `https://ui-avatars.com/api/?name=${
                  organizer.username || "User"
                }&background=2D5016&color=fff`,
              level: organizer.username
                ? `@${organizer.username}`
                : "Organizer",
            },
            location: trip.campingSiteName || "Camping Site",
            image:
              trip.image ||
              "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
            activity: {
              type: trip.terrainType || "Camping",
              icon: "trail-sign",
              distance: trip.trailDistance || "Unknown",
              duration: duration,
              elevation: "N/A",
            },
            time: trip.timestamp
              ? new Date(trip.timestamp).toLocaleDateString()
              : "Recently",
            likes: trip.likes || 0,
            tags: trip.terrainType ? [trip.terrainType] : ["Camping"],
            participants: trip.participants?.length || 0,
            maxParticipants: trip.maxParticipants || 10,
          };
        });
        setFeed(mappedTrips);
      }
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch trips when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips])
  );

  const handleLike = (id: string) => {
    setFeed(
      feed.map((item) =>
        item.id === id
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.isLiked
                ? (item.likes || 0) - 1
                : (item.likes || 0) + 1,
            }
          : item
      )
    );
  };

  const handleJoin = (id: string) => {
    router.push({
      pathname: "/trip/[id]",
      params: {
        id,
      },
    });
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Header
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D5016" />
        </View>
      ) : (
        <ScrollView
          style={styles.feed}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
        >
          {feed.map((item, index) => (
            <FeedCard
              key={item.id}
              item={item}
              onLike={handleLike}
              onJoin={handleJoin}
              isFirst={index === 0}
            />
          ))}
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={styles.fab}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[colors.accent, "#B85E1F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
      {/* Modal */}
      <CreateCampingModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

// Feed Card Component

/* ================================================================ */
/*  Camping Theme Styles - Social Feed                             */
/* ================================================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Feed
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
