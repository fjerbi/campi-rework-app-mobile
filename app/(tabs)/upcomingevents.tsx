import { tripsAPI } from "@/services/api";
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
import React, { useState, useEffect } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateObject } from "react-native-calendars";

// window width not required here

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

// Helper: map trip -> event shape used in UI
const mapTripToEvent = (trip: any) => {
  const startDate = trip.startDate || trip.date || trip.createdAt;
  const dateISO = startDate
    ? new Date(startDate).toISOString().split("T")[0]
    : null;
  const title = trip.name || trip.title || "Untitled Trip";
  const description = trip.description || trip.summary || "";
  const time = trip.time || trip.startTime || "09:00 AM";
  const location =
    trip.location || trip.campingSite?.location || trip.campingSite?.name || "";
  const participants = Array.isArray(trip.participants)
    ? trip.participants.length
    : trip.participants || 0;
  const maxParticipants = trip.maxParticipants || trip.capacity || 30;
  const organizerName =
    trip.organizer?.name ||
    trip.owner?.username ||
    trip.owner?.first_name ||
    "Organizer";
  const organizerAvatar =
    trip.organizer?.avatar ||
    trip.owner?.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(organizerName)}`;

  return {
    id: trip._id || trip.id,
    title,
    description,
    date: dateISO,
    time,
    location,
    participants,
    maxParticipants,
    organizer: { name: organizerName, avatar: organizerAvatar },
    image: trip.image || trip.coverImage || trip.campingSite?.image || null,
    category: trip.category || trip.type || "Camping",
    difficulty: trip.difficulty || "All Levels",
  };
};

const UpcomingEvents = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchTripsAsEvents = async () => {
      try {
        const res = await tripsAPI.getTrips();
        const trips = Array.isArray(res.data)
          ? res.data
          : res.data?.trips || [];

        // map trips -> events and keep future/upcoming ones
        const today = new Date().toISOString().split("T")[0];
        const mapped = trips
          .map(mapTripToEvent)
          .filter((e: any) => e.date && e.date >= today);

        if (mapped.length > 0) {
          setEvents(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch trips for events:", err);
      }
    };

    fetchTripsAsEvents();
  }, []);

  // Get marked dates for calendar
  const getMarkedDates = () => {
    const marked: any = {};
    events.forEach((event) => {
      marked[event.date] = {
        marked: true,
        dotColor: colors.accent,
        selectedColor: colors.primary,
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marked;
  };

  // Filter events by selected date
  const filteredEvents = selectedDate
    ? events.filter((event) => event.date === selectedDate)
    : events;

  const onDayPress = (day: DateObject) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  const clearFilter = () => {
    setSelectedDate("");
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
            <Text style={styles.headerTitle}>Upcoming Events</Text>
            <Text style={styles.headerSubtitle}>
              {filteredEvents.length} events found
            </Text>
          </View>
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={() => setShowCalendar(!showCalendar)}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Selected Date Filter */}
        {selectedDate && (
          <View style={styles.filterBadge}>
            <Ionicons name="calendar" size={16} color="#fff" />
            <Text style={styles.filterBadgeText}>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <TouchableOpacity onPress={clearFilter} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Calendar */}
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={getMarkedDates()}
            onDayPress={onDayPress}
            theme={{
              backgroundColor: colors.cardBg,
              calendarBackground: colors.cardBg,
              textSectionTitleColor: colors.dark,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: "#ffffff",
              todayTextColor: colors.accent,
              dayTextColor: colors.dark,
              textDisabledColor: colors.grayLight,
              dotColor: colors.accent,
              selectedDotColor: "#ffffff",
              arrowColor: colors.primary,
              monthTextColor: colors.dark,
              textMonthFontFamily: "Inter_700Bold",
              textDayFontFamily: "Inter_500Medium",
              textDayHeaderFontFamily: "Inter_600SemiBold",
            }}
          />
        </View>
      )}

      {/* Events List */}
      <ScrollView
        style={styles.eventsList}
        contentContainerStyle={styles.eventsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEvents.map((event, index) => (
          <EventCard key={event.id} event={event} isFirst={index === 0} />
        ))}

        {/* No Events */}
        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptyText}>
              No events scheduled for{" "}
              {new Date(selectedDate).toLocaleDateString()}
            </Text>
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={clearFilter}
            >
              <Text style={styles.clearFilterText}>View all events</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Event Card Component
const EventCard = ({ event, isFirst }: any) => {
  const isFull = event.participants >= event.maxParticipants;
  const spotsLeft = event.maxParticipants - event.participants;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return colors.success;
      case "Intermediate":
        return colors.warning;
      case "Advanced":
        return colors.danger;
      default:
        return colors.gray;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.eventCard, isFirst && styles.eventCardFirst]}
      activeOpacity={0.9}
    >
      {/* Event Image */}
      <View style={styles.eventImageContainer}>
        <Image source={{ uri: event.image }} style={styles.eventImage} />
        <LinearGradient
          colors={["transparent", "rgba(26,40,16,0.8)"]}
          style={styles.imageGradient}
        />

        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>

        {/* Difficulty Badge */}
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(event.difficulty) },
          ]}
        >
          <Text style={styles.difficultyText}>{event.difficulty}</Text>
        </View>
      </View>

      {/* Event Content */}
      <View style={styles.eventContent}>
        {/* Date & Time */}
        <View style={styles.dateTimeRow}>
          <View style={styles.dateBox}>
            <Text style={styles.dateMonth}>
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
              })}
            </Text>
            <Text style={styles.dateDay}>{new Date(event.date).getDate()}</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle} numberOfLines={1}>
              {event.title}
            </Text>
            <View style={styles.timeLocation}>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={14} color={colors.gray} />
                <Text style={styles.timeText}>{event.time}</Text>
              </View>
              <View style={styles.locationContainer}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.gray}
                />
                <Text style={styles.locationText} numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>

        {/* Organizer */}
        <View style={styles.organizerRow}>
          <Image
            source={{ uri: event.organizer.avatar }}
            style={styles.organizerAvatar}
          />
          <View style={styles.organizerInfo}>
            <Text style={styles.organizerLabel}>Organized by</Text>
            <Text style={styles.organizerName}>{event.organizer.name}</Text>
          </View>
        </View>

        {/* Participants & Action */}
        <View style={styles.cardFooter}>
          <View style={styles.participantsInfo}>
            <View style={styles.participantsAvatars}>
              <View
                style={[styles.miniAvatar, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="person" size={10} color="#fff" />
              </View>
              <View
                style={[
                  styles.miniAvatar,
                  { backgroundColor: colors.accent, marginLeft: -6 },
                ]}
              >
                <Ionicons name="person" size={10} color="#fff" />
              </View>
              <View
                style={[
                  styles.miniAvatar,
                  { backgroundColor: colors.success, marginLeft: -6 },
                ]}
              >
                <Ionicons name="person" size={10} color="#fff" />
              </View>
            </View>
            <Text style={styles.participantsText}>
              {event.participants}/{event.maxParticipants}
            </Text>
            {!isFull && (
              <Text style={styles.spotsText}>{spotsLeft} spots left</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.joinButton, isFull && styles.joinButtonDisabled]}
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
                name={isFull ? "lock-closed" : "checkmark-circle"}
                size={18}
                color="#fff"
              />
              <Text style={styles.joinButtonText}>
                {isFull ? "Full" : "Join"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
    marginBottom: 16,
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
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Filter Badge
  filterBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 8,
  },
  filterBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
  clearButton: {
    marginLeft: 4,
  },

  // Calendar
  calendarContainer: {
    backgroundColor: colors.cardBg,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Events List
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Event Card
  eventCard: {
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
  eventCardFirst: {
    marginTop: 0,
  },

  // Event Image
  eventImageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "#fff",
  },
  difficultyBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "#fff",
  },

  // Event Content
  eventContent: {
    padding: 16,
  },
  dateTimeRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  dateBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  dateMonth: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
  },
  dateDay: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 24,
    color: "#fff",
    lineHeight: 28,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: colors.dark,
    marginBottom: 6,
  },
  timeLocation: {
    gap: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.gray,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  locationText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.gray,
    flex: 1,
  },

  // Description
  eventDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
    marginBottom: 12,
  },

  // Organizer
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    gap: 10,
  },
  organizerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.border,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: colors.grayLight,
    marginBottom: 2,
  },
  organizerName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.dark,
  },

  // Card Footer
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantsInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  participantsAvatars: {
    flexDirection: "row",
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.cardBg,
  },
  participantsText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: colors.dark,
  },
  spotsText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: colors.success,
  },
  joinButton: {
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
  },
  joinButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#fff",
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
    marginBottom: 20,
  },
  clearFilterButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearFilterText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#fff",
  },
});

export default UpcomingEvents;
