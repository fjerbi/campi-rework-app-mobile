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
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import * as Geolib from "geolib";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const colors = {
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  secondary: "#8B5CF6",
  accent: "#EC4899",
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

export default function Run() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [pace, setPace] = useState("0'00''");
  const [avgSpeed, setAvgSpeed] = useState(0);

  const startTime = useRef<number | null>(null);
  const lastLocation = useRef<any>(null);
  const pedometerSub = useRef<any>(null);
  const locationSub = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatPace = (distKm: number, secs: number) => {
    if (distKm === 0) return "0'00''";
    const paceMinPerKm = secs / 60 / distKm;
    const mins = Math.floor(paceMinPerKm);
    const sec = Math.round((paceMinPerKm - mins) * 60);
    return `${mins}'${sec.toString().padStart(2, "0")}''`;
  };

  const estimateCalories = (steps: number, distKm: number) => {
    return Math.round(steps * 0.04 + distKm * 60);
  };

  const calculateAvgSpeed = (distKm: number, secs: number) => {
    if (secs === 0) return 0;
    return (distKm / (secs / 3600)).toFixed(1);
  };

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Location access is needed for accurate distance."
      );
      return;
    }

    const pedometerAvailable = await Pedometer.isAvailableAsync();
    if (!pedometerAvailable) {
      Alert.alert("Pedometer not available on this device.");
      return;
    }

    setIsTracking(true);
    setSteps(0);
    setDistance(0);
    setCalories(0);
    setDuration(0);
    setPace("0'00''");
    setAvgSpeed(0);
    startTime.current = Date.now();
    lastLocation.current = null;

    pedometerSub.current = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
      const estimatedDist = (result.steps * 0.762) / 1000;
      setDistance(estimatedDist);
      setCalories(estimateCalories(result.steps, estimatedDist));
    });

    locationSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) => {
        if (lastLocation.current && location.coords) {
          const dist =
            Geolib.getDistance(
              {
                latitude: lastLocation.current.coords.latitude,
                longitude: lastLocation.current.coords.longitude,
              },
              {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }
            ) / 1000;
          setDistance((prev) => prev + dist);
        }
        lastLocation.current = location;
      }
    );

    intervalRef.current = setInterval(() => {
      if (startTime.current) {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        setDuration(elapsed);
        setPace(formatPace(distance, elapsed));
        setAvgSpeed(parseFloat(calculateAvgSpeed(distance, elapsed)));
      }
    }, 1000);
  };

  const stopTracking = () => {
    setIsTracking(false);
    pedometerSub.current?.remove();
    locationSub.current?.remove();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  if (!fontsLoaded) return null;

  const circleSize = width * 0.7;
  const strokeWidth = 20;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = (steps / 10000) * 100; // Goal: 10,000 steps
  const strokeDashoffset =
    circumference - (circumference * progressPercentage) / 100;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.circleContainer}>
          <Svg width={circleSize} height={circleSize}>
            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke={colors.border}
              strokeWidth={strokeWidth}
              fill="none"
            />

            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke={colors.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${circleSize / 2}, ${circleSize / 2}`}
            />
          </Svg>

          <View style={styles.centerContent}>
            <Text style={styles.mainValue}>{steps.toLocaleString()}</Text>
            <Text style={styles.mainLabel}>Steps</Text>
            <View style={styles.goalIndicator}>
              <Ionicons name="flag-outline" size={14} color={colors.gray} />
              <Text style={styles.goalText}>Goal: 10,000</Text>
            </View>
          </View>
        </View>
        <View style={styles.primaryStatsRow}>
          <View style={styles.primaryStatCard}>
            <View style={styles.primaryStatHeader}>
              <View
                style={[
                  styles.statIconCircle,
                  { backgroundColor: colors.secondary + "15" },
                ]}
              >
                <Ionicons name="navigate" size={22} color={colors.secondary} />
              </View>
              <Text style={styles.primaryStatLabel}>Distance</Text>
            </View>
            <Text style={styles.primaryStatValue}>{distance.toFixed(2)}</Text>
            <Text style={styles.primaryStatUnit}>kilometers</Text>
          </View>

          <View style={styles.primaryStatCard}>
            <View style={styles.primaryStatHeader}>
              <View
                style={[
                  styles.statIconCircle,
                  { backgroundColor: colors.warning + "15" },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={22}
                  color={colors.warning}
                />
              </View>
              <Text style={styles.primaryStatLabel}>Duration</Text>
            </View>
            <Text style={styles.primaryStatValue}>
              {formatDuration(duration)}
            </Text>
            <Text style={styles.primaryStatUnit}>time elapsed</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="flame"
            label="Calories"
            value={calories.toString()}
            unit="kcal"
            color={colors.danger}
            gradient={["#FEE2E2", "#FECACA"]}
          />
          <StatCard
            icon="speedometer-outline"
            label="Pace"
            value={pace}
            unit="min/km"
            color={colors.accent}
            gradient={["#FCE7F3", "#FBCFE8"]}
          />
          <StatCard
            icon="rocket-outline"
            label="Avg Speed"
            value={avgSpeed.toString()}
            unit="km/h"
            color={colors.secondary}
            gradient={["#EEF2FF", "#E0E7FF"]}
          />
          <StatCard
            icon="heart-outline"
            label="Heart Rate"
            value="102"
            unit="bpm"
            color="#EC4899"
            gradient={["#FCE7F3", "#FBCFE8"]}
          />
        </View>

        <View style={styles.actionButtons}>
          {isTracking ? (
            <>
              <TouchableOpacity style={styles.pauseButton} activeOpacity={0.8}>
                <Ionicons name="pause" size={24} color={colors.warning} />
                <Text style={styles.pauseButtonText}>Pause</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stopButton}
                onPress={stopTracking}
                activeOpacity={0.8}
              >
                <Ionicons name="stop" size={24} color="#fff" />
                <Text style={styles.stopButtonText}>Stop Workout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startTracking}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.startButtonGradient}
              >
                <Ionicons name="play" size={28} color="#fff" />
                <Text style={styles.startButtonText}>Start Workout</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const StatCard = ({ icon, label, value, unit, color, gradient }: any) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statCardGradient}
    >
      <View style={[styles.statCardIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
      <Text style={styles.statCardLabel}>{label}</Text>
      <Text style={styles.statCardUnit}>{unit}</Text>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: "#fff",
    letterSpacing: -0.3,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  liveText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#fff",
    letterSpacing: 0.5,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  circleContainer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
  },
  centerContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  mainValue: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 56,
    color: colors.dark,
    letterSpacing: -2,
  },
  mainLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: colors.gray,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  goalIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
    gap: 6,
  },
  goalText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.gray,
  },

  primaryStatsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  primaryStatCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryStatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryStatLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.gray,
  },
  primaryStatValue: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 32,
    color: colors.dark,
    letterSpacing: -1,
    marginBottom: 2,
  },
  primaryStatUnit: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: colors.grayLight,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  statCardGradient: {
    padding: 16,
  },
  statCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statCardValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: colors.dark,
    marginBottom: 2,
  },
  statCardLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: colors.darkLight,
    marginBottom: 2,
  },
  statCardUnit: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: colors.grayLight,
  },

  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  startButton: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  startButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: "#fff",
  },
  pauseButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    paddingVertical: 18,
    gap: 8,
    borderWidth: 2,
    borderColor: colors.warning,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  pauseButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: colors.warning,
  },
  stopButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.danger,
    borderRadius: 20,
    paddingVertical: 18,
    gap: 8,
    elevation: 6,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  stopButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
  },
});
