import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateObject } from "react-native-calendars";

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

interface Activity {
  id: string;
  date: Date;
  time: string;
  description: string;
}

interface CampingData {
  name: string;
  participants: string;
  startDate: Date;
  endDate: Date;
  equipment: string;
  meetingPoint: string;
  description: string;
  terrain: string;
  gearChecklist: string;
}

interface CreateCampingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CampingData, activities: Activity[]) => void;
}

export default function CreateCampingModal({
  visible,
  onClose,
  onSubmit,
}: CreateCampingModalProps) {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [showActivityCalendar, setShowActivityCalendar] = useState(false);

  // Form state
  const [campingData, setCampingData] = useState<CampingData>({
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
    onSubmit(campingData, activities);
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Plan Your Camp</Text>
              <Text style={styles.modalSubtitle}>Create a new adventure</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Camping Name */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="bonfire" size={16} color={colors.primary} />{" "}
                Camp Details
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Camping Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Mountain Vista Escape 2025"
                  placeholderTextColor={colors.grayLight}
                  value={campingData.name}
                  onChangeText={(text) =>
                    setCampingData({ ...campingData, name: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Max Participants *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 10"
                  placeholderTextColor={colors.grayLight}
                  keyboardType="numeric"
                  value={campingData.participants}
                  onChangeText={(text) =>
                    setCampingData({ ...campingData, participants: text })
                  }
                />
              </View>
            </View>

            {/* Dates */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="calendar" size={16} color={colors.primary} />{" "}
                Trip Dates
              </Text>

              <View style={styles.dateRow}>
                <View style={styles.dateColumn}>
                  <Text style={styles.label}>Start Date *</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowStartCalendar(!showStartCalendar)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={colors.gray}
                    />
                    <Text style={styles.dateText}>
                      {campingData.startDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.dateColumn}>
                  <Text style={styles.label}>End Date *</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowEndCalendar(!showEndCalendar)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={colors.gray}
                    />
                    <Text style={styles.dateText}>
                      {campingData.endDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showStartCalendar && (
                <View style={styles.calendarContainer}>
                  <Calendar
                    current={campingData.startDate.toISOString().split("T")[0]}
                    onDayPress={(day: DateObject) => {
                      setCampingData({
                        ...campingData,
                        startDate: new Date(day.timestamp),
                      });
                      setShowStartCalendar(false);
                    }}
                    markedDates={{
                      [campingData.startDate.toISOString().split("T")[0]]: {
                        selected: true,
                        selectedColor: colors.primary,
                      },
                    }}
                    theme={{
                      backgroundColor: colors.cardBg,
                      calendarBackground: colors.cardBg,
                      textSectionTitleColor: colors.dark,
                      selectedDayBackgroundColor: colors.primary,
                      selectedDayTextColor: "#ffffff",
                      todayTextColor: colors.accent,
                      dayTextColor: colors.dark,
                      textDisabledColor: colors.grayLight,
                      arrowColor: colors.primary,
                      monthTextColor: colors.dark,
                      textMonthFontFamily: "Inter_700Bold",
                      textDayFontFamily: "Inter_500Medium",
                      textDayHeaderFontFamily: "Inter_600SemiBold",
                    }}
                  />
                </View>
              )}

              {showEndCalendar && (
                <View style={styles.calendarContainer}>
                  <Calendar
                    current={campingData.endDate.toISOString().split("T")[0]}
                    onDayPress={(day: DateObject) => {
                      setCampingData({
                        ...campingData,
                        endDate: new Date(day.timestamp),
                      });
                      setShowEndCalendar(false);
                    }}
                    markedDates={{
                      [campingData.endDate.toISOString().split("T")[0]]: {
                        selected: true,
                        selectedColor: colors.primary,
                      },
                    }}
                    theme={{
                      backgroundColor: colors.cardBg,
                      calendarBackground: colors.cardBg,
                      textSectionTitleColor: colors.dark,
                      selectedDayBackgroundColor: colors.primary,
                      selectedDayTextColor: "#ffffff",
                      todayTextColor: colors.accent,
                      dayTextColor: colors.dark,
                      textDisabledColor: colors.grayLight,
                      arrowColor: colors.primary,
                      monthTextColor: colors.dark,
                      textMonthFontFamily: "Inter_700Bold",
                      textDayFontFamily: "Inter_500Medium",
                      textDayHeaderFontFamily: "Inter_600SemiBold",
                    }}
                  />
                </View>
              )}
            </View>

            {/* Terrain Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="trail-sign" size={16} color={colors.primary} />{" "}
                Terrain Type
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.terrainContainer}
              >
                {terrainTypes.map((terrain) => (
                  <TouchableOpacity
                    key={terrain}
                    style={[
                      styles.terrainPill,
                      campingData.terrain === terrain &&
                        styles.terrainPillActive,
                    ]}
                    onPress={() => setCampingData({ ...campingData, terrain })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.terrainText,
                        campingData.terrain === terrain &&
                          styles.terrainTextActive,
                      ]}
                    >
                      {terrain}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Meeting Point */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="location" size={16} color={colors.primary} />{" "}
                Meeting Point
              </Text>
              <View style={styles.formGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Lakeview Trailhead Parking"
                  placeholderTextColor={colors.grayLight}
                  value={campingData.meetingPoint}
                  onChangeText={(text) =>
                    setCampingData({ ...campingData, meetingPoint: text })
                  }
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons
                  name="document-text"
                  size={16}
                  color={colors.primary}
                />{" "}
                Description
              </Text>
              <View style={styles.formGroup}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your camping trip, terrain, difficulty level..."
                  placeholderTextColor={colors.grayLight}
                  multiline
                  numberOfLines={4}
                  value={campingData.description}
                  onChangeText={(text) =>
                    setCampingData({ ...campingData, description: text })
                  }
                />
              </View>
            </View>

            {/* Equipment */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="construct" size={16} color={colors.primary} />{" "}
                Required Equipment
              </Text>
              <View style={styles.formGroup}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tent, sleeping bag, cooking gear, flashlight..."
                  placeholderTextColor={colors.grayLight}
                  multiline
                  numberOfLines={3}
                  value={campingData.equipment}
                  onChangeText={(text) =>
                    setCampingData({ ...campingData, equipment: text })
                  }
                />
              </View>
            </View>

            {/* Gear Checklist */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="checkbox" size={16} color={colors.primary} />{" "}
                Gear Checklist
              </Text>
              <View style={styles.formGroup}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Water bottles, first aid kit, map, compass..."
                  placeholderTextColor={colors.grayLight}
                  multiline
                  numberOfLines={3}
                  value={campingData.gearChecklist}
                  onChangeText={(text) =>
                    setCampingData({ ...campingData, gearChecklist: text })
                  }
                />
              </View>
            </View>

            {/* Activity Timeline */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="list" size={16} color={colors.primary} />{" "}
                Activity Timeline
              </Text>

              <View style={styles.activityInputContainer}>
                <View style={styles.activityInputRow}>
                  <TouchableOpacity
                    style={styles.activityDateButton}
                    onPress={() =>
                      setShowActivityCalendar(!showActivityCalendar)
                    }
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={colors.gray}
                    />
                    <Text style={styles.activityDateText}>
                      {newActivity.date.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>

                  <TextInput
                    style={[styles.input, styles.timeInput]}
                    placeholder="Time"
                    placeholderTextColor={colors.grayLight}
                    value={newActivity.time}
                    onChangeText={(t) =>
                      setNewActivity({ ...newActivity, time: t })
                    }
                  />
                </View>

                {showActivityCalendar && (
                  <View style={styles.calendarContainer}>
                    <Calendar
                      current={newActivity.date.toISOString().split("T")[0]}
                      onDayPress={(day: DateObject) => {
                        setNewActivity({
                          ...newActivity,
                          date: new Date(day.timestamp),
                        });
                        setShowActivityCalendar(false);
                      }}
                      markedDates={{
                        [newActivity.date.toISOString().split("T")[0]]: {
                          selected: true,
                          selectedColor: colors.success,
                        },
                      }}
                      theme={{
                        backgroundColor: colors.cardBg,
                        calendarBackground: colors.cardBg,
                        textSectionTitleColor: colors.dark,
                        selectedDayBackgroundColor: colors.success,
                        selectedDayTextColor: "#ffffff",
                        todayTextColor: colors.accent,
                        dayTextColor: colors.dark,
                        textDisabledColor: colors.grayLight,
                        arrowColor: colors.success,
                        monthTextColor: colors.dark,
                        textMonthFontFamily: "Inter_700Bold",
                        textDayFontFamily: "Inter_500Medium",
                        textDayHeaderFontFamily: "Inter_600SemiBold",
                      }}
                    />
                  </View>
                )}

                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  placeholder="Activity description"
                  placeholderTextColor={colors.grayLight}
                  value={newActivity.description}
                  onChangeText={(d) =>
                    setNewActivity({ ...newActivity, description: d })
                  }
                />

                <TouchableOpacity
                  onPress={addActivity}
                  style={styles.addActivityButton}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.addActivityText}>Add Activity</Text>
                </TouchableOpacity>
              </View>

              {/* Activities List */}
              {activities.length > 0 && (
                <View style={styles.activitiesList}>
                  {activities.map((activity) => (
                    <View key={activity.id} style={styles.activityItem}>
                      <View style={styles.activityIcon}>
                        <Ionicons
                          name="calendar"
                          size={16}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityDate}>
                          {activity.date.toLocaleDateString()} - {activity.time}
                        </Text>
                        <Text style={styles.activityDescription}>
                          {activity.description}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeActivity(activity.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color={colors.danger}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
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
                <Text style={styles.submitButtonText}>Create Camping Trip</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});
