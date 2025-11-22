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

// Mock experiences data
const experiencesData = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Johnson&background=2D5016&color=fff&bold=true&size=128",
    },
    campingName: "Camping Oued Zen",
    experience:
      "Amazing experience! The nature was breathtaking and the facilities were well-maintained.",
    advantages: "Beautiful scenery, Clean facilities, Friendly staff",
    disadvantages: "Limited parking space, No Wi-Fi",
    improvements: "Add more shaded areas, Improve road access",
    rating: 5,
    date: "2 days ago",
  },
  {
    id: "2",
    user: {
      name: "Mike Anderson",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+Anderson&background=D4772C&color=fff&bold=true&size=128",
    },
    campingName: "Mountain Peak Camp",
    experience:
      "Great spot for a weekend getaway. Perfect for families with kids.",
    advantages: "Family-friendly, Good hiking trails, Affordable prices",
    disadvantages: "Crowded on weekends",
    improvements: "Add more restrooms, Better waste management",
    rating: 4,
    date: "1 week ago",
  },
];

const SharedExperience = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [experiences, setExperiences] = useState(experiencesData);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    campingName: "",
    experience: "",
    advantages: "",
    disadvantages: "",
    improvements: "",
  });

  const handleSubmit = () => {
    console.log("Experience Data:", { ...formData, rating });
    setShowModal(false);
    // Reset form
    setFormData({
      campingName: "",
      experience: "",
      advantages: "",
      disadvantages: "",
      improvements: "",
    });
    setRating(0);
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
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Experiences</Text>
            <Text style={styles.headerSubtitle}>
              Share your camping adventures
            </Text>
          </View>
          <View style={styles.experienceIcon}>
            <Text style={styles.experienceIconText}>⛺</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Experiences List */}
      <ScrollView
        style={styles.experiencesList}
        contentContainerStyle={styles.experiencesContent}
        showsVerticalScrollIndicator={false}
      >
        {experiences.map((exp, index) => (
          <ExperienceCard key={exp.id} experience={exp} isFirst={index === 0} />
        ))}

        {/* Empty State */}
        {experiences.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏕️</Text>
            <Text style={styles.emptyTitle}>No experiences yet</Text>
            <Text style={styles.emptyText}>
              Be the first to share your camping experience!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
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

      {/* Add Experience Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Share Your Experience</Text>
                <Text style={styles.modalSubtitle}>
                  Help others discover great spots
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScrollContent}
            >
              {/* Camping Name */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  <Ionicons name="location" size={16} color={colors.primary} />{" "}
                  Camping Site
                </Text>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Camping Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Camping Oued Zen"
                    placeholderTextColor={colors.grayLight}
                    value={formData.campingName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, campingName: text })
                    }
                  />
                </View>
              </View>

              {/* Rating */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  <Ionicons name="star" size={16} color={colors.primary} /> Your
                  Rating
                </Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={36}
                        color={
                          star <= rating ? colors.warning : colors.grayLight
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.ratingText}>
                  {rating === 0
                    ? "Tap to rate"
                    : rating === 5
                    ? "Excellent!"
                    : rating === 4
                    ? "Great!"
                    : rating === 3
                    ? "Good"
                    : rating === 2
                    ? "Fair"
                    : "Poor"}
                </Text>
              </View>

              {/* Experience */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  <Ionicons
                    name="chatbubble"
                    size={16}
                    color={colors.primary}
                  />{" "}
                  Your Experience
                </Text>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Tell us about your stay *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Share your overall experience..."
                    placeholderTextColor={colors.grayLight}
                    multiline
                    numberOfLines={4}
                    value={formData.experience}
                    onChangeText={(text) =>
                      setFormData({ ...formData, experience: text })
                    }
                  />
                </View>
              </View>

              {/* Advantages */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  <Ionicons name="thumbs-up" size={16} color={colors.success} />{" "}
                  Advantages
                </Text>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>What did you like?</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Beautiful scenery, Clean facilities, Friendly staff..."
                    placeholderTextColor={colors.grayLight}
                    multiline
                    numberOfLines={3}
                    value={formData.advantages}
                    onChangeText={(text) =>
                      setFormData({ ...formData, advantages: text })
                    }
                  />
                </View>
              </View>

              {/* Disadvantages */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  <Ionicons
                    name="thumbs-down"
                    size={16}
                    color={colors.danger}
                  />{" "}
                  Disadvantages
                </Text>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>What could be better?</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Limited parking, No Wi-Fi, Crowded..."
                    placeholderTextColor={colors.grayLight}
                    multiline
                    numberOfLines={3}
                    value={formData.disadvantages}
                    onChangeText={(text) =>
                      setFormData({ ...formData, disadvantages: text })
                    }
                  />
                </View>
              </View>

              {/* Improvements */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  <Ionicons name="construct" size={16} color={colors.accent} />{" "}
                  Improvements
                </Text>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>What needs improvement?</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Add more restrooms, Better signage, Improve road access..."
                    placeholderTextColor={colors.grayLight}
                    multiline
                    numberOfLines={3}
                    value={formData.improvements}
                    onChangeText={(text) =>
                      setFormData({ ...formData, improvements: text })
                    }
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButtonGradient}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.submitButtonText}>Share Experience</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Experience Card Component
const ExperienceCard = ({ experience, isFirst }: any) => {
  return (
    <View
      style={[styles.experienceCard, isFirst && styles.experienceCardFirst]}
    >
      {/* User Header */}
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: experience.user.avatar }}
          style={styles.userAvatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{experience.user.name}</Text>
          <Text style={styles.campingNameText}>{experience.campingName}</Text>
        </View>
        <View style={styles.cardMeta}>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingValue}>{experience.rating}.0</Text>
          </View>
          <Text style={styles.dateText}>{experience.date}</Text>
        </View>
      </View>

      {/* Experience Text */}
      <Text style={styles.experienceText}>{experience.experience}</Text>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        {/* Advantages */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View
              style={[
                styles.detailIcon,
                { backgroundColor: colors.success + "15" },
              ]}
            >
              <Ionicons name="thumbs-up" size={18} color={colors.success} />
            </View>
            <Text style={styles.detailTitle}>Advantages</Text>
          </View>
          <Text style={styles.detailText}>{experience.advantages}</Text>
        </View>

        {/* Disadvantages */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View
              style={[
                styles.detailIcon,
                { backgroundColor: colors.danger + "15" },
              ]}
            >
              <Ionicons name="thumbs-down" size={18} color={colors.danger} />
            </View>
            <Text style={styles.detailTitle}>Disadvantages</Text>
          </View>
          <Text style={styles.detailText}>{experience.disadvantages}</Text>
        </View>

        {/* Improvements */}
        <View style={[styles.detailCard, styles.detailCardFull]}>
          <View style={styles.detailHeader}>
            <View
              style={[
                styles.detailIcon,
                { backgroundColor: colors.accent + "15" },
              ]}
            >
              <Ionicons name="construct" size={18} color={colors.accent} />
            </View>
            <Text style={styles.detailTitle}>Needs Improvement</Text>
          </View>
          <Text style={styles.detailText}>{experience.improvements}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="heart-outline" size={20} color={colors.gray} />
          <Text style={styles.actionText}>Helpful</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.gray} />
          <Text style={styles.actionText}>Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="share-outline" size={20} color={colors.gray} />
          <Text style={styles.actionText}>Share</Text>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  experienceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  experienceIconText: {
    fontSize: 32,
  },

  // Experiences List
  experiencesList: {
    flex: 1,
  },
  experiencesContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Experience Card
  experienceCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  experienceCardFirst: {
    marginTop: 0,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  campingNameText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.gray,
  },
  cardMeta: {
    alignItems: "flex-end",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.warning + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    marginBottom: 4,
  },
  ratingValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: colors.warning,
  },
  dateText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: colors.grayLight,
  },

  // Experience Text
  experienceText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: colors.dark,
    lineHeight: 22,
    marginBottom: 16,
  },

  // Details Grid
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: colors.light,
    borderRadius: 12,
    padding: 12,
    width: (width - 64) / 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailCardFull: {
    width: "100%",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  detailIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  detailTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: colors.dark,
  },
  detailText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
    lineHeight: 18,
  },

  // Card Actions
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.gray,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: colors.dark,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
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

  formScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },

  // Form
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: colors.dark,
    marginBottom: 12,
  },
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

  // Rating
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  ratingText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: colors.primary,
    textAlign: "center",
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
});

export default SharedExperience;
