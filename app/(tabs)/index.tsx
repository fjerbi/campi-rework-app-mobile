import { FeedCard } from "@/components/home/FeedCard";
import Header from "@/components/home/Header";
import CreateCampingModal from "@/components/home/ModalCampForm";
import { feedData } from "@/data/dummy";
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
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [showActivityCalendar, setShowActivityCalendar] = useState(false);

  // Form state
  const [campingData, setCampingData] = useState({
    name: "",
    participants: "",
    startDate: new Date(),
    endDate: new Date(),
    equipment: "",
    meetingPoint: "",
    description: "",
    terrain: "Mountain",
    gearChecklist: "",
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({
    date: new Date(),
    time: "",
    description: "",
  });
  const terrainTypes = ["Mountain", "Forest", "Lake", "Desert", "Beach"];

  const addActivity = () => {
    if (newActivity.description.trim() && newActivity.time.trim()) {
      setActivities([
        ...activities,
        {
          id: Date.now().toString(),
          date: newActivity.date,
          time: newActivity.time,
          description: newActivity.description,
        },
      ]);
      setNewActivity({ date: new Date(), time: "", description: "" });
    }
  };

  const removeActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const handleCreateTrip = async (campingData: any, activities: any) => {
    try {
      // Prepare payload
      const payload = {
        campingData,
        activities,
        description:
          campingData.description || `New camping trip at ${campingData.name}`,
      };

      console.log("Submitting trip:", payload);

      // TODO: Replace with your actual API endpoint
      // const response = await fetch("https://your-api.com/api/trips", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // const data = await response.json();

      setShowModal(false);
      // Reset form
      setCampingData({
        name: "",
        participants: "",
        startDate: new Date(),
        endDate: new Date(),
        equipment: "",
        meetingPoint: "",
        description: "",
        terrain: "Mountain",
        gearChecklist: "",
      });
      setActivities([]);

      // Show success message or navigate
      console.log("Trip created successfully");
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };
  const [feed, setFeed] = useState(feedData);
  const [activeFilter, setActiveFilter] = useState("All");
  const router = useRouter();
  const filters = ["All", "Mountain", "Forest", "Lake", "Desert"];

  const handleLike = (id: number) => {
    setFeed(
      feed.map((item) =>
        item.id === id
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );
  };

  const handleJoin = (id: number) => {
    const activity = feed.find((item) => item.id === id);
    if (activity) {
      router.push({
        pathname: "/ActivityDetail",
        params: {
          activity: JSON.stringify(activity),
        },
      });
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Header
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

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
        onSubmit={handleCreateTrip}
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
