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
  Platform,
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

  const handleSubmit = () => {
    console.log("Camping Data:", campingData);
    console.log("Activities:", activities);
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
        onSubmit={(campingData, activities) => {
          console.log("Camping Data:", campingData);
          console.log("Activities:", activities);
          // Handle the submission
        }}
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

  // Header
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 32,
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  notificationBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#fff",
  },

  // Filters
  filtersContainer: {
    gap: 8,
    paddingRight: 20,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  filterPillActive: {
    backgroundColor: "#fff",
  },
  filterText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  filterTextActive: {
    color: colors.primary,
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

  // Card
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardFirst: {
    marginTop: 0,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.dark,
    marginBottom: 2,
  },
  userLevel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(26, 40, 16, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    maxHeight: "92%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 28,
    color: colors.dark,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: colors.gray,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: colors.dark,
    marginBottom: 12,
  },

  // Form
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.darkLight,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },

  // Dates
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateColumn: {
    flex: 1,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  dateText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.dark,
    flex: 1,
  },

  // Calendar
  calendarContainer: {
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBg,
  },

  // Terrain
  terrainContainer: {
    gap: 8,
  },
  terrainPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
  },
  terrainPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  terrainText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.dark,
  },
  terrainTextActive: {
    color: "#fff",
  },

  // Activity Timeline
  activityInputContainer: {
    backgroundColor: colors.light,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  activityInputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  activityDateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  activityDateText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.dark,
  },
  timeInput: {
    flex: 1,
  },
  addActivityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.success,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
    gap: 6,
  },
  addActivityText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#fff",
  },

  activitiesList: {
    gap: 10,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityDate: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: colors.dark,
    marginBottom: 2,
  },
  activityDescription: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
  },

  // Submit Button
  submitButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  submitButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: "#fff",
  },
  // Image
  imageContainer: {
    width: "100%",
    height: 240,
    position: "relative",
  },
  activityImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: "flex-end",
    padding: 16,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 6,
  },
  locationText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },

  // Activity Details
  activityDetails: {
    padding: 16,
  },
  activityHeader: {
    marginBottom: 12,
  },
  activityTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  activityType: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: colors.dark,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  statText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.dark,
  },

  // Tags
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: colors.darkLight,
  },

  // Participants
  participantsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  participantsInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  participantsAvatars: {
    flexDirection: "row",
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.cardBg,
  },
  participantsText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.dark,
  },
  spotsLeftText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: colors.success,
  },

  // Actions
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  likeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.gray,
  },
  likeTextActive: {
    color: colors.danger,
  },
  joinButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  joinButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  joinButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  joinButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
  },

  // FAB
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
