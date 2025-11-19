import { useAuthStore } from "@/stores/authStore";
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

// Mock user data - Camping theme
const userData = {
  name: "Alex Rivers",
  username: "@wildexplorer",
  avatar:
    "https://ui-avatars.com/api/?name=Alex+Rivers&background=2D5016&color=fff&bold=true&size=256",
  coverImage:
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80",
  bio: "Wilderness enthusiast ⛺ | Trail explorer | Finding peace under the stars 🌲🏕️",
  level: "Wilderness Expert",
  joinedDate: "March 2022",
  location: "Colorado, USA",
  stats: {
    totalTrips: 87,
    totalNights: "245 nights",
    totalDistance: "1,847 km",
    followers: 2340,
    following: 1256,
  },
  achievements: [
    {
      id: 1,
      icon: "trophy",
      color: colors.warning,
      title: "Peak Seeker",
      description: "Camped at 10 mountain peaks",
    },
    {
      id: 2,
      icon: "flame",
      color: colors.danger,
      title: "Fire Master",
      description: "Built 50 successful campfires",
    },
    {
      id: 3,
      icon: "moon",
      color: colors.accent,
      title: "Night Owl",
      description: "100 nights under the stars",
    },
    {
      id: 4,
      icon: "people",
      color: colors.success,
      title: "Camp Leader",
      description: "Organized 25+ group camps",
    },
  ],
  recentActivities: [
    {
      id: 1,
      type: "Mountain Camping",
      icon: "trail-sign",
      distance: "15.2 km hike",
      duration: "3 nights",
      elevation: "2,400m",
      date: "1 week ago",
      image:
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
    },
    {
      id: 2,
      type: "Forest Camping",
      icon: "leaf",
      distance: "8.5 km hike",
      duration: "2 nights",
      elevation: "1,200m",
      date: "2 weeks ago",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    },
    {
      id: 3,
      type: "Lakeside Camp",
      icon: "water",
      distance: "6.8 km hike",
      duration: "1 night",
      elevation: "800m",
      date: "3 weeks ago",
      image:
        "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=800&q=80",
    },
  ],
  personalBests: [
    { label: "Longest Trek", value: "42 km", icon: "navigate" },
    { label: "Highest Camp", value: "3,200m", icon: "trending-up" },
    { label: "Coldest Night", value: "-15°C", icon: "snow" },
  ],
};

const Profile = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [activeTab, setActiveTab] = useState<"activities" | "achievements">(
    "activities"
  );
  const user = useAuthStore((state) => state.user);
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Cover Image */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: userData.coverImage }}
            style={styles.coverImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(29,40,16,0.8)"]}
            style={styles.coverGradient}
          />

          {/* Header Buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            <View style={styles.levelBadge}>
              <Ionicons name="bonfire" size={14} color="#fff" />
              <Text style={styles.levelText}>{userData.level}</Text>
            </View>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={styles.username}>{user?.username}</Text>
          </View>

          <Text style={styles.bio}>{userData.bio}</Text>

          {/* Location & Join Date */}
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={16} color={colors.gray} />
              <Text style={styles.metaText}>{userData.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={16} color={colors.gray} />
              <Text style={styles.metaText}>Joined {userData.joinedDate}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                <Ionicons name="person-add" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Follow</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.secondaryButtonText}>Message</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.stats.totalTrips}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.stats.totalNights}</Text>
              <Text style={styles.statLabel}>Nights Out</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.stats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.stats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Personal Bests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Camping Records</Text>
          <View style={styles.personalBestsGrid}>
            {userData.personalBests.map((pb, index) => (
              <View key={index} style={styles.personalBestCard}>
                <View style={styles.pbIconContainer}>
                  <Ionicons
                    name={pb.icon as any}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.pbValue}>{pb.value}</Text>
                <Text style={styles.pbLabel}>{pb.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "activities" && styles.tabActive]}
            onPress={() => setActiveTab("activities")}
          >
            <Ionicons
              name="trail-sign"
              size={20}
              color={activeTab === "activities" ? colors.primary : colors.gray}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "activities" && styles.tabTextActive,
              ]}
            >
              Trips
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "achievements" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("achievements")}
          >
            <Ionicons
              name="trophy"
              size={20}
              color={
                activeTab === "achievements" ? colors.primary : colors.gray
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "achievements" && styles.tabTextActive,
              ]}
            >
              Badges
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "activities" ? (
            <View style={styles.activitiesList}>
              {userData.recentActivities.map((activity) => (
                <TouchableOpacity key={activity.id} style={styles.activityCard}>
                  <Image
                    source={{ uri: activity.image }}
                    style={styles.activityImage}
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.6)"]}
                    style={styles.activityImageGradient}
                  >
                    <View style={styles.activityBadge}>
                      <Ionicons
                        name={activity.icon as any}
                        size={14}
                        color="#fff"
                      />
                    </View>
                  </LinearGradient>
                  <View style={styles.activityInfo}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityType}>{activity.type}</Text>
                      <Text style={styles.activityDate}>{activity.date}</Text>
                    </View>
                    <View style={styles.activityStats}>
                      <View style={styles.activityStatItem}>
                        <Ionicons
                          name="navigate-outline"
                          size={14}
                          color={colors.gray}
                        />
                        <Text style={styles.activityStatText}>
                          {activity.distance}
                        </Text>
                      </View>
                      <View style={styles.activityStatItem}>
                        <Ionicons
                          name="moon-outline"
                          size={14}
                          color={colors.gray}
                        />
                        <Text style={styles.activityStatText}>
                          {activity.duration}
                        </Text>
                      </View>
                      <View style={styles.activityStatItem}>
                        <Ionicons
                          name="trending-up-outline"
                          size={14}
                          color={colors.gray}
                        />
                        <Text style={styles.activityStatText}>
                          {activity.elevation}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.achievementsGrid}>
              {userData.achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <View
                    style={[
                      styles.achievementIcon,
                      { backgroundColor: achievement.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={achievement.icon as any}
                      size={32}
                      color={achievement.color}
                    />
                  </View>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  headerButtons: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  profileSection: {
    paddingHorizontal: 20,
    marginTop: -40,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "flex-start",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.cardBg,
  },
  levelBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 2,
    borderColor: colors.cardBg,
  },
  levelText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "#fff",
  },
  nameContainer: {
    marginTop: 16,
  },
  name: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 28,
    color: colors.dark,
    letterSpacing: -0.5,
  },
  username: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: colors.gray,
    marginTop: 2,
  },
  bio: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: colors.darkLight,
    marginTop: 12,
  },
  metaInfo: {
    flexDirection: "row",
    gap: 20,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: colors.gray,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#fff",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary + "15",
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary + "30",
  },
  secondaryButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 20,
    color: colors.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: colors.border,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: colors.dark,
    marginBottom: 16,
  },
  personalBestsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  personalBestCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
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
  pbIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  pbValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: colors.dark,
    marginBottom: 4,
  },
  pbLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: colors.gray,
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 24,
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary + "15",
    borderColor: colors.primary + "30",
  },
  tabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.gray,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabContent: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  activitiesList: {
    gap: 16,
  },
  activityCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  activityImageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: 12,
  },
  activityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(45,80,22,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  activityInfo: {
    padding: 16,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activityType: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: colors.dark,
  },
  activityDate: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
  },
  activityStats: {
    flexDirection: "row",
    gap: 16,
  },
  activityStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activityStatText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.darkLight,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  achievementCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  achievementTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.dark,
    textAlign: "center",
    marginBottom: 4,
  },
  achievementDescription: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: colors.gray,
    textAlign: "center",
    lineHeight: 16,
  },
});
