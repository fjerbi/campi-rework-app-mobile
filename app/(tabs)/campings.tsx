import { campingSites } from "@/data/campingSites";
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
  TextInput,
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

// Mock data based on your example

const CampingsScreen = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [sites, setSites] = useState(campingSites);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Free", "Paid", "Nearby"];

  const toggleFavorite = (id: string) => {
    setSites(
      sites.map((site) =>
        site._id === id ? { ...site, isFavorite: !site.isFavorite } : site
      )
    );
  };

  const getActivityIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      hiking: "walk",
      nature: "leaf",
      wc: "business",
      water: "water",
      "electrical-services": "flash",
      terrain: "trending-up",
    };
    return iconMap[iconName] || "checkmark-circle";
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Camping Sites</Text>
            <Text style={styles.headerSubtitle}>
              Discover {sites.length} amazing locations
            </Text>
          </View>
          <TouchableOpacity style={styles.mapButton}>
            <Ionicons name="map-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.gray}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search camping sites..."
            placeholderTextColor={colors.grayLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                selectedFilter === filter && styles.filterPillActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Sites List */}
      <ScrollView
        style={styles.sitesList}
        contentContainerStyle={styles.sitesListContent}
        showsVerticalScrollIndicator={false}
      >
        {sites.map((site, index) => (
          <SiteCard
            key={site.name}
            site={site}
            onToggleFavorite={toggleFavorite}
            getActivityIcon={getActivityIcon}
            isFirst={index === 0}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// Site Card Component
const SiteCard = ({
  site,
  onToggleFavorite,
  getActivityIcon,
  isFirst,
}: any) => {
  return (
    <TouchableOpacity
      style={[styles.siteCard, isFirst && styles.siteCardFirst]}
      activeOpacity={0.9}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: site.imageUrl }} style={styles.siteImage} />
        <LinearGradient
          colors={["transparent", "rgba(26,40,16,0.6)"]}
          style={styles.imageGradient}
        />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(site._id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={site.isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={site.isFavorite ? colors.danger : "#fff"}
          />
        </TouchableOpacity>

        {/* Price Badge */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{site.price}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        {/* Title & Location */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.siteName} numberOfLines={1}>
              {site.name}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={colors.gray} />
              <Text style={styles.cityText}>{site.city}</Text>
              <View style={styles.distanceBadge}>
                <Ionicons name="navigate" size={12} color={colors.accent} />
                <Text style={styles.distanceText}>{site.distance} km</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {site.description}
        </Text>

        {/* Activities */}
        <View style={styles.activitiesContainer}>
          {site.activities.slice(0, 4).map((activity: any, index: number) => (
            <View key={activity.id} style={styles.activityChip}>
              <Ionicons
                name={getActivityIcon(activity.icon)}
                size={14}
                color={colors.primary}
              />
              <Text style={styles.activityText}>{activity.activity_name}</Text>
            </View>
          ))}
          {site.activities.length > 4 && (
            <View style={styles.moreActivities}>
              <Text style={styles.moreActivitiesText}>
                +{site.activities.length - 4}
              </Text>
            </View>
          )}
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.infoButton} activeOpacity={0.7}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.gray}
            />
            <Text style={styles.infoButtonText}>Details</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookButton} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bookButtonGradient}
            >
              <Ionicons name="calendar-outline" size={18} color="#fff" />
              <Text style={styles.bookButtonText}>Organize</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* ================================================================ */
/*  Styles - Camping Sites Theme                                   */
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
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: colors.dark,
    paddingVertical: 14,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
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

  // Sites List
  sitesList: {
    flex: 1,
  },
  sitesListContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Site Card
  siteCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
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
  siteCardFirst: {
    marginTop: 0,
  },

  // Image
  imageContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  siteImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  priceBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: "#fff",
  },

  // Card Content
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  siteName: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: colors.dark,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cityText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.gray,
    marginRight: 8,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  distanceText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: colors.accent,
  },

  // Description
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
    marginBottom: 12,
  },

  // Activities
  activitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  activityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: colors.darkLight,
  },
  moreActivities: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + "30",
  },
  moreActivitiesText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: colors.primary,
  },

  // Actions
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.gray,
  },
  bookButton: {
    flex: 1.5,
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bookButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  bookButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#fff",
  },
});

export default CampingsScreen;
