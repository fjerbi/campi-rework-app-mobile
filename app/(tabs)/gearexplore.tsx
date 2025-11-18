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
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Color palette
const colors = {
  primary: "#2E8B57",
  primaryDark: "#1A5C3A",
  secondary: "#4F7942",
  accent: "#D4A373",
  accentBright: "#FFB347",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  dark: "#1E293B",
  darkLight: "#334155",
  gray: "#64748B",
  grayLight: "#94A3B8",
  light: "#F8FAFC",
  cardBg: "#FFFFFF",
  border: "#E2E8F0",
};

// Mock data for gear exchange
const gearListings = [
  {
    id: 1,
    user: {
      name: "Alex Johnson",
      avatar:
        "https://ui-avatars.com/api/?name=Alex+Johnson&background=2E8B57&color=fff&bold=true&size=128",
      rating: 4.8,
      exchangeCount: 23,
    },
    gear: {
      name: "Coleman 4-Person Tent",
      description:
        "Barely used camping tent, perfect for family trips. Waterproof and easy to set up.",
      image:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
      condition: "Like New",
      category: "Tent",
    },
    location: "Denver, CO",
    status: "public",
    postedTime: "2 days ago",
    isBookmarked: false,
  },
  {
    id: 2,
    user: {
      name: "Sarah Martinez",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Martinez&background=FFB347&color=fff&bold=true&size=128",
      rating: 4.9,
      exchangeCount: 34,
    },
    gear: {
      name: "MSR Backpacking Stove",
      description:
        "Compact camping stove with fuel canister. Great condition, used only 3 times.",
      image:
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
      condition: "Excellent",
      category: "Cooking",
    },
    location: "Portland, OR",
    status: "public",
    postedTime: "5 days ago",
    isBookmarked: true,
  },
  {
    id: 3,
    user: {
      name: "Mike Chen",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+Chen&background=4F7942&color=fff&bold=true&size=128",
      rating: 4.7,
      exchangeCount: 18,
    },
    gear: {
      name: "Sleeping Bag -15°C",
      description:
        "Heavy-duty winter sleeping bag. Perfect for cold weather camping. Clean and well-maintained.",
      image:
        "https://images.unsplash.com/photo-1520095972714-909e91b038e5?w=800&q=80",
      condition: "Good",
      category: "Sleeping",
    },
    location: "Seattle, WA",
    status: "public",
    postedTime: "1 week ago",
    isBookmarked: false,
  },
];

export default function ExchangeGear() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [listings, setListings] = useState(gearListings);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Browse");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Form state
  const [newGear, setNewGear] = useState({
    name: "",
    description: "",
    condition: "Good",
    category: "Tent",
    location: "",
    status: "public",
    image: null,
  });

  const categories = [
    "All",
    "Tent",
    "Sleeping",
    "Cooking",
    "Backpack",
    "Other",
  ];
  const conditions = ["Like New", "Excellent", "Good", "Fair"];
  const tabs = ["Browse", "My Gear"];

  const handleBookmark = (id: number) => {
    setListings(
      listings.map((item) =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  const handleAddGear = () => {
    console.log("Adding new gear:", newGear);
    setShowAddModal(false);
    // Reset form
    setNewGear({
      name: "",
      description: "",
      condition: "Good",
      category: "Tent",
      location: "",
      status: "public",
      image: null,
    });
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
            <Text style={styles.headerTitle}>Gear Exchange</Text>
            <Text style={styles.headerSubtitle}>
              Share & borrow camping gear
            </Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Categories Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryPill,
              selectedCategory === category && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Listings */}
      <ScrollView
        style={styles.listingsContainer}
        contentContainerStyle={styles.listingsContent}
        showsVerticalScrollIndicator={false}
      >
        {listings.map((listing) => (
          <GearCard
            key={listing.id}
            listing={listing}
            onBookmark={handleBookmark}
          />
        ))}
      </ScrollView>

      {/* Add Gear Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[colors.accent, "#D4A373"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Add Gear Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Your Gear</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={28} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Image Upload */}
              <TouchableOpacity style={styles.imageUpload} activeOpacity={0.7}>
                <Ionicons name="camera" size={40} color={colors.gray} />
                <Text style={styles.imageUploadText}>Add Photo</Text>
              </TouchableOpacity>

              {/* Gear Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Gear Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Coleman 4-Person Tent"
                  placeholderTextColor={colors.grayLight}
                  value={newGear.name}
                  onChangeText={(text) =>
                    setNewGear({ ...newGear, name: text })
                  }
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your gear, condition, usage..."
                  placeholderTextColor={colors.grayLight}
                  multiline
                  numberOfLines={4}
                  value={newGear.description}
                  onChangeText={(text) =>
                    setNewGear({ ...newGear, description: text })
                  }
                />
              </View>

              {/* Category */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Category *</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.optionsContainer}
                >
                  {categories
                    .filter((c) => c !== "All")
                    .map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.optionPill,
                          newGear.category === category &&
                            styles.optionPillActive,
                        ]}
                        onPress={() => setNewGear({ ...newGear, category })}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            newGear.category === category &&
                              styles.optionTextActive,
                          ]}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>

              {/* Condition */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Condition *</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.optionsContainer}
                >
                  {conditions.map((condition) => (
                    <TouchableOpacity
                      key={condition}
                      style={[
                        styles.optionPill,
                        newGear.condition === condition &&
                          styles.optionPillActive,
                      ]}
                      onPress={() => setNewGear({ ...newGear, condition })}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          newGear.condition === condition &&
                            styles.optionTextActive,
                        ]}
                      >
                        {condition}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Location */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Location *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Denver, CO"
                  placeholderTextColor={colors.grayLight}
                  value={newGear.location}
                  onChangeText={(text) =>
                    setNewGear({ ...newGear, location: text })
                  }
                />
              </View>

              {/* Visibility */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Visibility</Text>
                <View style={styles.visibilityOptions}>
                  <TouchableOpacity
                    style={[
                      styles.visibilityOption,
                      newGear.status === "public" &&
                        styles.visibilityOptionActive,
                    ]}
                    onPress={() => setNewGear({ ...newGear, status: "public" })}
                  >
                    <Ionicons
                      name="earth"
                      size={20}
                      color={
                        newGear.status === "public"
                          ? colors.primary
                          : colors.gray
                      }
                    />
                    <Text
                      style={[
                        styles.visibilityText,
                        newGear.status === "public" &&
                          styles.visibilityTextActive,
                      ]}
                    >
                      Public
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.visibilityOption,
                      newGear.status === "private" &&
                        styles.visibilityOptionActive,
                    ]}
                    onPress={() =>
                      setNewGear({ ...newGear, status: "private" })
                    }
                  >
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color={
                        newGear.status === "private"
                          ? colors.primary
                          : colors.gray
                      }
                    />
                    <Text
                      style={[
                        styles.visibilityText,
                        newGear.status === "private" &&
                          styles.visibilityTextActive,
                      ]}
                    >
                      Only Me
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddGear}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButtonGradient}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.submitButtonText}>Post Gear</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Gear Card Component
const GearCard = ({ listing, onBookmark }: any) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Like New":
        return colors.success;
      case "Excellent":
        return colors.primary;
      case "Good":
        return colors.warning;
      default:
        return colors.gray;
    }
  };

  return (
    <View style={styles.card}>
      {/* Gear Image */}
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: listing.gear.image }} style={styles.cardImage} />
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => onBookmark(listing.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={listing.isBookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={listing.isBookmarked ? colors.accent : "#fff"}
          />
        </TouchableOpacity>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{listing.gear.category}</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Gear Info */}
        <View style={styles.gearInfo}>
          <Text style={styles.gearName}>{listing.gear.name}</Text>
          <View
            style={[
              styles.conditionBadge,
              {
                backgroundColor:
                  getConditionColor(listing.gear.condition) + "15",
              },
            ]}
          >
            <View
              style={[
                styles.conditionDot,
                { backgroundColor: getConditionColor(listing.gear.condition) },
              ]}
            />
            <Text
              style={[
                styles.conditionText,
                { color: getConditionColor(listing.gear.condition) },
              ]}
            >
              {listing.gear.condition}
            </Text>
          </View>
        </View>

        <Text style={styles.gearDescription} numberOfLines={2}>
          {listing.gear.description}
        </Text>

        {/* User Info */}
        <View style={styles.userSection}>
          <Image
            source={{ uri: listing.user.avatar }}
            style={styles.userAvatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{listing.user.name}</Text>
            <View style={styles.userMeta}>
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color={colors.accentBright} />
                <Text style={styles.ratingText}>{listing.user.rating}</Text>
              </View>
              <View style={styles.exchangeCount}>
                <Ionicons
                  name="swap-horizontal"
                  size={14}
                  color={colors.gray}
                />
                <Text style={styles.exchangeCountText}>
                  {listing.user.exchangeCount} exchanges
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location & Time */}
        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={colors.gray} />
            <Text style={styles.locationText}>{listing.location}</Text>
          </View>
          <Text style={styles.timeText}>{listing.postedTime}</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.contactButtonGradient}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Owner</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ================================================================ */
/*  Styles                                                          */
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
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Tabs
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  tabTextActive: {
    color: colors.primary,
  },

  // Categories
  categoriesScroll: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxHeight: 60,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: colors.dark,
  },
  categoryTextActive: {
    color: "#fff",
  },

  // Listings
  listingsContainer: {
    flex: 1,
  },
  listingsContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Card
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bookmarkButton: {
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
  categoryBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: "#fff",
  },

  // Card Content
  cardContent: {
    padding: 16,
  },
  gearInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  gearName: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: colors.dark,
    flex: 1,
    marginRight: 12,
  },
  conditionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  conditionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  conditionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  gearDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
    marginBottom: 16,
  },

  // User Section
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.dark,
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: "row",
    gap: 16,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.dark,
  },
  exchangeCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  exchangeCountText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
  },

  // Card Footer
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.dark,
  },
  timeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
  },

  // Contact Button
  contactButton: {
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  contactButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  contactButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 24,
    color: colors.dark,
  },

  // Form
  imageUpload: {
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  imageUploadText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.gray,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.dark,
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
    height: 100,
    textAlignVertical: "top",
  },
  optionsContainer: {
    gap: 8,
  },
  optionPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.dark,
  },
  optionTextActive: {
    color: "#fff",
  },

  // Visibility Options
  visibilityOptions: {
    flexDirection: "row",
    gap: 12,
  },
  visibilityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  visibilityOptionActive: {
    backgroundColor: colors.primary + "15",
    borderColor: colors.primary,
  },
  visibilityText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.gray,
  },
  visibilityTextActive: {
    color: colors.primary,
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
    marginTop: 12,
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
});
