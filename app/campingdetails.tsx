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
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

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

// Mock camping site data based on your structure
const campingSite = {
  _id: "650daa80258245306d0e493e",
  name: "Camping Oued Zen",
  description:
    "The Oued Zen National Park extends in the Aïn Drahem region, an integral part of Kroumirie, with a total area of 6,700 hectares. This place, preserved from the hustle and urban pollution, provides an ideal environment for camping, making Oued Zen the perfect place for a natural outdoor experience.",
  city: "Aïne Draham",
  distance: 10,
  imageUrl: "https://nextjs-crud-testing.vercel.app/images/mainzen.jpg",
  latitude: 36.7421854,
  longitude: 8.735032,
  isFavorite: false,
  price: "Free/Different pricing options",
  activities: [
    { id: "3", activity_name: "Hiking", icon: "hiking" },
    { id: "6", activity_name: "Natural", icon: "nature" },
  ],
  images: [
    {
      id: "1",
      imageUrl:
        "https://media.safarway.com/content/b07e62d3-1ec4-46cb-ad98-9daf671cc3fb_xs.jpg",
    },
    {
      id: "2",
      imageUrl: "https://nextjs-crud-testing.vercel.app/images/subzen3.jpg",
    },
  ],
  contact: [
    {
      name: "Information Center",
      email: "info@ouedzen.tn",
      phone: "+216 78 123 456",
    },
  ],
};

const CampingDetailScreen = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [isFavorite, setIsFavorite] = useState(campingSite.isFavorite);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const openMaps = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${campingSite.latitude},${campingSite.longitude}`,
      android: `geo:0,0?q=${campingSite.latitude},${campingSite.longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const sendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  if (!fontsLoaded) return null;

  const allImages = [
    { id: "main", imageUrl: campingSite.imageUrl },
    ...campingSite.images,
  ];

  return (
    <View style={styles.container}>
      {/* Header with Image Gallery */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: allImages[selectedImageIndex].imageUrl }}
          style={styles.mainImage}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.8)"]}
          style={styles.imageGradient}
        />

        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.shareButton} activeOpacity={0.8}>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => setIsFavorite(!isFavorite)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? colors.danger : "#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Badge */}
        <View style={styles.floatingPriceBadge}>
          <LinearGradient
            colors={[colors.accent, "#B85E1F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.priceBadgeGradient}
          >
            <Ionicons name="pricetag" size={16} color="#fff" />
            <Text style={styles.priceText}>{campingSite.price}</Text>
          </LinearGradient>
        </View>

        {/* Image Gallery Thumbnails */}
        <View style={styles.thumbnailContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailScroll}
          >
            {allImages.map((image, index) => (
              <TouchableOpacity
                key={image.id}
                onPress={() => setSelectedImageIndex(index)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: image.imageUrl }}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.thumbnailActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.siteName}>{campingSite.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={18} color={colors.accent} />
                <Text style={styles.cityText}>{campingSite.city}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <Ionicons name="navigate" size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{campingSite.distance} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.success + "15" },
              ]}
            >
              <Ionicons name="star" size={20} color={colors.success} />
            </View>
            <Text style={styles.statValue}>4.5</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.accent + "15" },
              ]}
            >
              <Ionicons name="people" size={20} color={colors.accent} />
            </View>
            <Text style={styles.statValue}>250+</Text>
            <Text style={styles.statLabel}>Visitors</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={22} color={colors.primary} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <Text style={styles.description}>{campingSite.description}</Text>
        </View>

        {/* Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={22} color={colors.primary} />
            <Text style={styles.sectionTitle}>Activities & Facilities</Text>
          </View>
          <View style={styles.activitiesGrid}>
            {campingSite.activities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityIconCircle}>
                  <Ionicons
                    name={getActivityIcon(activity.icon)}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.activityName}>
                  {activity.activity_name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Location Map */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="map" size={22} color={colors.primary} />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <TouchableOpacity
            style={styles.mapCard}
            onPress={openMaps}
            activeOpacity={0.9}
          >
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={40} color={colors.gray} />
              <Text style={styles.mapText}>Tap to open in Maps</Text>
              <Text style={styles.coordinatesText}>
                {campingSite.latitude.toFixed(4)},{" "}
                {campingSite.longitude.toFixed(4)}
              </Text>
            </View>
            <View style={styles.mapButton}>
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={styles.mapButtonText}>Get Directions</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        {campingSite.contact[0].name !== "Unavaialble" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call" size={22} color={colors.primary} />
              <Text style={styles.sectionTitle}>Contact</Text>
            </View>
            {campingSite.contact.map((contact, index) => (
              <View key={index} style={styles.contactCard}>
                <View style={styles.contactItem}>
                  <View style={styles.contactIconCircle}>
                    <Ionicons name="person" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Contact Person</Text>
                    <Text style={styles.contactValue}>{contact.name}</Text>
                  </View>
                </View>

                {contact.phone !== "Unavailable" && (
                  <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() => callPhone(contact.phone)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.contactIconCircle}>
                      <Ionicons name="call" size={18} color={colors.success} />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactLabel}>Phone</Text>
                      <Text style={styles.contactValue}>{contact.phone}</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.gray}
                    />
                  </TouchableOpacity>
                )}

                {contact.email !== "Unavailable" && (
                  <TouchableOpacity
                    style={styles.contactItem}
                    onPress={() => sendEmail(contact.email)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.contactIconCircle}>
                      <Ionicons name="mail" size={18} color={colors.accent} />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactLabel}>Email</Text>
                      <Text style={styles.contactValue}>{contact.email}</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.gray}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Reviews Section Placeholder */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubbles" size={22} color={colors.primary} />
            <Text style={styles.sectionTitle}>Reviews</Text>
          </View>
          <View style={styles.reviewsPlaceholder}>
            <Ionicons name="star-outline" size={40} color={colors.grayLight} />
            <Text style={styles.reviewsPlaceholderText}>
              No reviews yet. Be the first to share your experience!
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
          <Ionicons name="call-outline" size={22} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButtonGradient}
          >
            <Ionicons name="calendar" size={22} color="#fff" />
            <Text style={styles.primaryButtonText}>Book Now</Text>
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

  // Image Gallery
  imageContainer: {
    height: height * 0.4,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Header Actions
  headerActions: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Price Badge
  floatingPriceBadge: {
    position: "absolute",
    top: Platform.OS === "ios" ? 110 : 90,
    left: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  priceBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  priceText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#fff",
  },

  // Thumbnails
  thumbnailContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  thumbnailScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
  },
  thumbnailActive: {
    borderColor: "#fff",
    transform: [{ scale: 1.05 }],
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },

  // Title Section
  titleSection: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
  },
  siteName: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 28,
    color: colors.dark,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cityText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: colors.gray,
  },

  // Quick Stats
  quickStats: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: colors.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: colors.dark,
  },

  // Description
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: colors.gray,
    lineHeight: 24,
  },

  // Activities
  activitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  activityCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    minWidth: (width - 64) / 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  activityName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: colors.dark,
    textAlign: "center",
  },

  // Map
  mapCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: colors.dark,
    marginTop: 12,
  },
  coordinatesText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: colors.gray,
    marginTop: 4,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 14,
    gap: 8,
  },
  mapButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#fff",
  },

  // Contact
  contactCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  contactValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: colors.dark,
  },

  // Reviews
  reviewsPlaceholder: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewsPlaceholderText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    marginTop: 12,
  },

  // Bottom Bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
    gap: 12,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: colors.primary,
  },
  primaryButton: {
    flex: 1.5,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
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
});

export default CampingDetailScreen;
