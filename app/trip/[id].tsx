import { tripsAPI } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function TripDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tripId = params.id as string;

  // Fetch trip details
  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      try {
        console.log("Fetching trip with ID:", tripId);
        const response = await tripsAPI.getTripById(tripId);
        console.log("Trip response:", response);

        if (response.success && response.data) {
          // Handle both data and trip in response
          const tripData = response.data?.trip || response.data;
          console.log("Trip data:", tripData);

          if (tripData) {
            setTrip(tripData);
            // Check if user is already joined
            const user = useAuthStore.getState().user;
            if (
              user &&
              tripData.participants?.some(
                (p: any) => p._id === user.id || p === user.id
              )
            ) {
              setIsJoined(true);
            }
          } else {
            // If direct endpoint fails, fetch all trips and find the one we need
            console.log("No trip data, fetching all trips...");
            const allTripsResponse = await tripsAPI.getTrips();
            if (allTripsResponse.success && allTripsResponse.data) {
              const foundTrip = Array.isArray(allTripsResponse.data)
                ? allTripsResponse.data.find((t: any) => t._id === tripId)
                : null;

              if (foundTrip) {
                setTrip(foundTrip);
                const user = useAuthStore.getState().user;
                if (
                  user &&
                  foundTrip.participants?.some(
                    (p: any) => p._id === user.id || p === user.id
                  )
                ) {
                  setIsJoined(true);
                }
              } else {
                Alert.alert("Error", "Trip not found");
              }
            } else {
              Alert.alert("Error", "Failed to load trip");
            }
          }
        } else if (!response.success) {
          // Direct endpoint failed, try fetching all trips
          console.log("getTripById failed, trying getTrips...");
          const allTripsResponse = await tripsAPI.getTrips();
          if (allTripsResponse.success && allTripsResponse.data) {
            const foundTrip = Array.isArray(allTripsResponse.data)
              ? allTripsResponse.data.find((t: any) => t._id === tripId)
              : null;

            if (foundTrip) {
              setTrip(foundTrip);
              const user = useAuthStore.getState().user;
              if (
                user &&
                foundTrip.participants?.some(
                  (p: any) => p._id === user.id || p === user.id
                )
              ) {
                setIsJoined(true);
              }
            } else {
              Alert.alert("Error", "Trip not found in list");
            }
          } else {
            Alert.alert(
              "Error",
              response.message ||
                allTripsResponse.message ||
                "Failed to load trip"
            );
          }
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
        Alert.alert("Error", "Failed to load trip details");
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const handleJoinActivity = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = useAuthStore.getState().user;

      if (!user) {
        Alert.alert("Error", "You must be logged in to join a trip");
        setIsLoading(false);
        return;
      }

      if (isJoined) {
        const response = await tripsAPI.leaveTrip(tripId, user.id);
        if (!response.success) {
          Alert.alert("Error", response.message || "Failed to leave trip");
          setIsLoading(false);
          return;
        }
        Alert.alert("Success", "You have left the trip");
        setIsJoined(false);
      } else {
        const response = await tripsAPI.joinTrip(tripId, user.id);
        if (!response.success) {
          Alert.alert("Error", response.message || "Failed to join trip");
          setIsLoading(false);
          return;
        }
        Alert.alert("Success", "You have successfully joined the trip!");
        setIsJoined(true);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error joining trip:", error);
      Alert.alert("Error", "Something went wrong");
      setIsLoading(false);
    }
  }, [tripId, isJoined]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text>Trip not found</Text>
      </View>
    );
  }

  const spotsLeft = trip.maxParticipants - (trip.participants?.length || 0);
  const isFull = spotsLeft <= 0;

  // Default placeholder image
  const tripImage =
    trip.image ||
    "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80";

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={colors.dark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-social" size={20} color={colors.dark} />
          </TouchableOpacity>
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: tripImage }}
            style={styles.heroImage}
            defaultSource={require("@/assets/images/icon.png")}
          />
          <LinearGradient
            colors={["transparent", "rgba(26,40,16,0.9)"]}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.tripName}>{trip.name}</Text>
              <View style={styles.locationBadge}>
                <Ionicons name="location" size={14} color="#fff" />
                <Text style={styles.locationText}>
                  {trip.campingSiteName || "Camping Site"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Trip Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.infoLabel}>Start Date</Text>
              <Text style={styles.infoValue}>
                {trip.startDate
                  ? new Date(trip.startDate).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.infoLabel}>End Date</Text>
              <Text style={styles.infoValue}>
                {trip.endDate
                  ? new Date(trip.endDate).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="people" size={20} color={colors.primary} />
              <Text style={styles.infoLabel}>Participants</Text>
              <Text style={styles.infoValue}>
                {trip.participants?.length || 0}/{trip.maxParticipants}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="compass" size={20} color={colors.primary} />
              <Text style={styles.infoLabel}>Terrain</Text>
              <Text style={styles.infoValue}>{trip.terrainType || "N/A"}</Text>
            </View>
          </View>

          {/* Description */}
          {trip.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About This Trip</Text>
              <Text style={styles.description}>{trip.description}</Text>
            </View>
          )}

          {/* Meeting Point */}
          {trip.meetingPoint && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meeting Point</Text>
              <View style={styles.meetingPointCard}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <Text style={styles.meetingPointText}>{trip.meetingPoint}</Text>
              </View>
            </View>
          )}

          {/* Activities */}
          {trip.activities &&
            Array.isArray(trip.activities) &&
            trip.activities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Planned Activities</Text>
                {trip.activities.map((activity: any, index: number) => (
                  <View key={index} style={styles.activityItem}>
                    <View style={styles.activityIcon}>
                      <Ionicons
                        name="calendar"
                        size={16}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityDate}>
                        {activity.date} at {activity.time}
                      </Text>
                      <Text style={styles.activityDescription}>
                        {activity.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

          {/* Equipment */}
          {trip.equipment &&
            Array.isArray(trip.equipment) &&
            trip.equipment.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Required Equipment</Text>
                {trip.equipment.map((item: string, index: number) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.success}
                    />
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

          {/* Gear Checklist */}
          {trip.gearChecklist &&
            Array.isArray(trip.gearChecklist) &&
            trip.gearChecklist.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gear Checklist</Text>
                {trip.gearChecklist.map((item: string, index: number) => (
                  <View key={index} style={styles.checklistItem}>
                    <Ionicons
                      name="square-outline"
                      size={18}
                      color={colors.gray}
                    />
                    <Text style={styles.checklistText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

          {/* Participants */}
          {trip.participants &&
            Array.isArray(trip.participants) &&
            trip.participants.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Participants ({trip.participants.length})
                </Text>
                {trip.participants.map((participant: any, index: number) => (
                  <View key={index} style={styles.participantItem}>
                    <Image
                      source={{
                        uri:
                          participant.picture ||
                          `https://ui-avatars.com/api/?name=${participant.username}&background=2D5016&color=fff`,
                      }}
                      style={styles.participantAvatar}
                    />
                    <View>
                      <Text style={styles.participantName}>
                        {participant.first_name} {participant.last_name}
                      </Text>
                      <Text style={styles.participantUsername}>
                        @{participant.username}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
        </View>
      </ScrollView>

      {/* Join Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.joinButton,
            (isFull || isLoading) && styles.joinButtonDisabled,
          ]}
          onPress={handleJoinActivity}
          disabled={(isFull && !isJoined) || isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              isJoined
                ? [colors.success, "#3A6B1F"]
                : isFull
                ? [colors.gray, colors.grayLight]
                : [colors.primary, colors.primaryDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.joinButtonGradient}
          >
            {isLoading ? (
              <>
                <ActivityIndicator color="#fff" size={20} />
                <Text style={styles.joinButtonText}>Processing...</Text>
              </>
            ) : isJoined ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.joinButtonText}>Youre In!</Text>
              </>
            ) : isFull ? (
              <>
                <Ionicons name="lock-closed" size={20} color="#fff" />
                <Text style={styles.joinButtonText}>Trip Full</Text>
              </>
            ) : (
              <>
                <Ionicons name="bonfire" size={20} color="#fff" />
                <Text style={styles.joinButtonText}>Join This Trip</Text>
              </>
            )}
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollView: {
    flex: 1,
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

  tripName: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 28,
    color: "#fff",
    letterSpacing: -0.5,
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

  content: {
    padding: 20,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },

  infoBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
    marginTop: 8,
    marginBottom: 4,
  },

  infoValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: colors.dark,
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

  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 24,
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

  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
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

  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  equipmentText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: colors.dark,
  },

  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  checklistText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: colors.dark,
  },

  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
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

  participantUsername: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
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
