import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
export const FeedCard = ({ item, onLike, onJoin, isFirst }: any) => {
  // Normalize numeric fields (API may return strings or undefined)
  const participantsNum = Number(item.participants || 0);
  const maxParticipantsNum = Number(item.maxParticipants || 0);
  const isFull =
    maxParticipantsNum > 0 && participantsNum >= maxParticipantsNum;
  const spotsLeft = Math.max(0, maxParticipantsNum - participantsNum);
  return (
    <View style={[styles.card, isFirst && styles.cardFirst]}>
      {/* User Info */}
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.userLevel}>{item.user.level}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color={colors.gray} />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>

      {/* Activity Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.activityImage} />
        <LinearGradient
          colors={["transparent", "rgba(26,40,16,0.8)"]}
          style={styles.imageGradient}
        >
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={14} color="#fff" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Activity Details */}
      <View style={styles.activityDetails}>
        <View style={styles.activityHeader}>
          <View style={styles.activityTypeContainer}>
            <View style={styles.activityIcon}>
              <Ionicons
                name={item.activity.icon}
                size={18}
                color={colors.primary}
              />
            </View>
            <Text style={styles.activityType}>{item.activity.type}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="navigate-outline" size={16} color={colors.gray} />
            <Text style={styles.statText}>{item.activity.distance}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="moon-outline" size={16} color={colors.gray} />
            <Text style={styles.statText}>{item.activity.duration}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons
              name="trending-up-outline"
              size={16}
              color={colors.gray}
            />
            <Text style={styles.statText}>{item.activity.elevation}</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {item.tags.map((tag: string, index: number) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Participants Bar */}
        <View style={styles.participantsContainer}>
          <View style={styles.participantsInfo}>
            <View style={styles.participantsAvatars}>
              {/* Show max 3 avatars */}
              <View
                style={[styles.miniAvatar, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="person" size={12} color="#fff" />
              </View>
              <View
                style={[
                  styles.miniAvatar,
                  { backgroundColor: colors.accent, marginLeft: -8 },
                ]}
              >
                <Ionicons name="person" size={12} color="#fff" />
              </View>
              <View
                style={[
                  styles.miniAvatar,
                  { backgroundColor: colors.success, marginLeft: -8 },
                ]}
              >
                <Ionicons name="person" size={12} color="#fff" />
              </View>
            </View>
            <Text style={styles.participantsText}>
              {participantsNum} campers
            </Text>
          </View>
          {!isFull && (
            <Text style={styles.spotsLeftText}>{spotsLeft} spots left</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => onLike(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.isLiked ? "heart" : "heart-outline"}
              size={22}
              color={item.isLiked ? colors.danger : colors.gray}
            />
            <Text
              style={[styles.likeText, item.isLiked && styles.likeTextActive]}
            >
              {item.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.joinButton, isFull && styles.joinButtonDisabled]}
            onPress={() => !isFull && onJoin(item.id)}
            activeOpacity={0.8}
            disabled={isFull}
          >
            <LinearGradient
              colors={
                isFull
                  ? [colors.gray, colors.grayLight]
                  : [colors.primary, colors.primaryDark]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.joinButtonGradient}
            >
              <Ionicons
                name={isFull ? "lock-closed" : "bonfire"}
                size={20}
                color="#fff"
              />
              <Text style={styles.joinButtonText}>
                {isFull ? "Full" : "Join Camp"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
