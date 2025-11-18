import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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

export default function ActivityDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isJoined, setIsJoined] = useState(false);

  // Parse the activity data from params
  const activity = params.activity
    ? JSON.parse(params.activity as string)
    : null;

  if (!activity) {
    return (
      <View style={styles.container}>
        <Text>Activity not found</Text>
      </View>
    );
  }

  const spotsLeft = activity.maxParticipants - activity.participants;

  const handleJoinActivity = () => {
    setIsJoined(!isJoined);
  };

  // Mock additional data - Camping theme
  const activityDetails = {
    date: "This Weekend, Nov 16-18",
    time: "Friday 4:00 PM",
    meetingPoint: "Station Métro Ariana",
    description:
      "Join us for an unforgettable mountain camping adventure! We'll hike to a stunning alpine meadow surrounded by towering peaks. This intermediate-level trip includes scenic trails, campfire cooking, stargazing, and wildlife spotting. Perfect for those looking to disconnect and immerse themselves in nature. We'll set up camp before sunset and spend the evening sharing stories around the campfire.",
    difficulty: "Intermediate",
    terrain: "Mountain trails with moderate elevation gain",
    weatherInfo: {
      temperature: "12°C / 8°C",
      condition: "Clear Skies",
      precipitation: "10%",
    },
    equipment: [
      "Tent (2-3 person recommended)",
      "Sleeping bag (-5°C rating)",
      "Camping stove & cookware",
      "Headlamp with extra batteries",
      "Water filter or purification tablets",
      "Warm layers & rain jacket",
      "First aid kit",
      "Optional: Camping chair, fishing gear",
    ],
    attendees: [
      {
        name: "Michael Carter",
        avatar:
          "https://ui-avatars.com/api/?name=Michael+Carter&background=2D5016&color=fff",
      },
      {
        name: "Emily Johnson",
        avatar:
          "https://ui-avatars.com/api/?name=Emily+Johnson&background=D4772C&color=fff",
      },
      {
        name: "Daniel Brooks",
        avatar:
          "https://ui-avatars.com/api/?name=Daniel+Brooks&background=4A7C2C&color=fff",
      },
      {
        name: "Sophia Reed",
        avatar:
          "https://ui-avatars.com/api/?name=Sophia+Reed&background=8B7355&color=fff",
      },
      {
        name: "James Walker",
        avatar:
          "https://ui-avatars.com/api/?name=James+Walker&background=E89B3C&color=fff",
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: activity.image }} style={styles.heroImage} />
          <LinearGradient
            colors={["transparent", "rgba(26,40,16,0.85)"]}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.activityTypeBadge}>
                <Ionicons
                  name={activity.activity.icon}
                  size={16}
                  color="#fff"
                />
                <Text style={styles.activityTypeText}>
                  {activity.activity.type}
                </Text>
              </View>
              <Text style={styles.locationText}>{activity.location}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Date & Time Card */}
          <View style={styles.dateTimeCard}>
            <View style={styles.dateTimeItem}>
              <Ionicons name="calendar" size={24} color={colors.primary} />
              <View>
                <Text style={styles.dateTimeLabel}>Date</Text>
                <Text style={styles.dateTimeValue}>{activityDetails.date}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.dateTimeItem}>
              <Ionicons name="time" size={24} color={colors.primary} />
              <View>
                <Text style={styles.dateTimeLabel}>Start Time</Text>
                <Text style={styles.dateTimeValue}>{activityDetails.time}</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons
                name="navigate-outline"
                size={28}
                color={colors.primary}
              />
              <Text style={styles.statValue}>{activity.activity.distance}</Text>
              <Text style={styles.statLabel}>Trail Distance</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="moon-outline" size={28} color={colors.primary} />
              <Text style={styles.statValue}>{activity.activity.duration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons
                name="trending-up-outline"
                size={28}
                color={colors.primary}
              />
              <Text style={styles.statValue}>
                {activity.activity.elevation}
              </Text>
              <Text style={styles.statLabel}>Elevation</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="bonfire" size={28} color={colors.accent} />
              <Text style={styles.statValue}>{activityDetails.difficulty}</Text>
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
          </View>

          {/* Organizer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trip Organizer</Text>
            <View style={styles.organizerCard}>
              <Image
                source={{ uri: activity.user.avatar }}
                style={styles.organizerAvatar}
              />
              <View style={styles.organizerInfo}>
                <Text style={styles.organizerName}>{activity.user.name}</Text>
                <Text style={styles.organizerLevel}>{activity.user.level}</Text>
              </View>
              <TouchableOpacity style={styles.messageButton}>
                <Ionicons
                  name="chatbubble-outline"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this adventure</Text>
            <Text style={styles.description}>
              {activityDetails.description}
            </Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {activity.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Meeting Point */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meeting Point</Text>
            <View style={styles.meetingPointCard}>
              <Ionicons name="location" size={24} color={colors.primary} />
              <Text style={styles.meetingPointText}>
                {activityDetails.meetingPoint}
              </Text>
            </View>
          </View>

          {/* Terrain Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terrain</Text>
            <View style={styles.terrainCard}>
              <Ionicons name="trail-sign" size={24} color={colors.secondary} />
              <Text style={styles.terrainText}>{activityDetails.terrain}</Text>
            </View>
          </View>

          {/* Weather Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expected Weather</Text>
            <View style={styles.weatherCard}>
              <View style={styles.weatherItem}>
                <Ionicons name="sunny" size={32} color={colors.warning} />
                <Text style={styles.weatherValue}>
                  {activityDetails.weatherInfo.condition}
                </Text>
              </View>
              <View style={styles.weatherItem}>
                <Ionicons name="thermometer" size={32} color={colors.accent} />
                <Text style={styles.weatherValue}>
                  {activityDetails.weatherInfo.temperature}
                </Text>
              </View>
              <View style={styles.weatherItem}>
                <Ionicons name="rainy" size={32} color={colors.primary} />
                <Text style={styles.weatherValue}>
                  {activityDetails.weatherInfo.precipitation}
                </Text>
              </View>
            </View>
          </View>

          {/* Equipment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gear checklist</Text>
            {activityDetails.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.success}
                />
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Participants */}
          <View style={styles.section}>
            <View style={styles.participantsHeader}>
              <Text style={styles.sectionTitle}>
                Campers ({activity.participants}/{activity.maxParticipants})
              </Text>
              {spotsLeft > 0 && (
                <View style={styles.spotsLeftBadge}>
                  <Text style={styles.spotsLeftText}>
                    {spotsLeft} spots left
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.participantsList}>
              {activityDetails.attendees.map((attendee, index) => (
                <View key={index} style={styles.participantItem}>
                  <Image
                    source={{ uri: attendee.avatar }}
                    style={styles.participantAvatar}
                  />
                  <Text style={styles.participantName}>{attendee.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom spacing for fixed button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.joinButton,
            spotsLeft === 0 && styles.joinButtonDisabled,
          ]}
          onPress={handleJoinActivity}
          disabled={spotsLeft === 0}
        >
          <LinearGradient
            colors={
              spotsLeft === 0
                ? [colors.gray, colors.grayLight]
                : isJoined
                ? [colors.success, "#3D6622"]
                : [colors.primary, colors.primaryDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.joinButtonGradient}
          >
            <Ionicons
              name={
                spotsLeft === 0
                  ? "lock-closed"
                  : isJoined
                  ? "checkmark-circle"
                  : "bonfire"
              }
              size={24}
              color="#fff"
            />
            <Text style={styles.joinButtonText}>
              {spotsLeft === 0
                ? "Trip Full"
                : isJoined
                ? "You're In!"
                : "Join This Trip"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    width: "100%",
    height: 320,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: "flex-end",
    padding: 20,
  },
  heroContent: {
    gap: 10,
  },
  activityTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: "flex-start",
    gap: 6,
  },
  activityTypeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: "#fff",
  },
  locationText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 24,
    color: "#fff",
    letterSpacing: -0.5,
  },
  content: {
    padding: 20,
  },
  dateTimeCard: {
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTimeItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateTimeLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.dark,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.cardBg,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: colors.dark,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: colors.gray,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: colors.dark,
    marginBottom: 12,
  },
  organizerCard: {
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  organizerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: colors.dark,
    marginBottom: 2,
  },
  organizerLevel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: colors.gray,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 24,
    color: colors.darkLight,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  tagText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: colors.darkLight,
  },
  meetingPointCard: {
    flexDirection: "row",
    backgroundColor: colors.primary + "15",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  meetingPointText: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.dark,
  },
  terrainCard: {
    flexDirection: "row",
    backgroundColor: colors.secondary + "15",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  terrainText: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.dark,
  },
  weatherCard: {
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weatherItem: {
    alignItems: "center",
    gap: 10,
  },
  weatherValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.dark,
  },
  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  equipmentText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: colors.dark,
  },
  participantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  spotsLeftBadge: {
    backgroundColor: colors.success + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  spotsLeftText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: colors.success,
  },
  participantsList: {
    gap: 10,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  participantName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.dark,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBg,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  joinButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  joinButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: "#fff",
  },
});
