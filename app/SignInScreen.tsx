import { useAuth } from "@/hooks/useAuth";
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
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

// Sign In Screen
export function SignInScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const { signIn, signUp } = useAuth();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (isSignUp && !fullName.trim()) {
      Alert.alert("Validation Error", "Please enter your full name");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }

    if (!password) {
      Alert.alert("Validation Error", "Please enter your password");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await signIn(email.trim().toLowerCase(), password);

      if (!result.ok) {
        Alert.alert("Login Failed", result.message || "Invalid credentials");
      }
      // If successful, AuthGate will automatically navigate to (tabs)
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Split full name into first and last name
      const nameParts = fullName.trim().split(" ");
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(" ") || nameParts[0];

      const userData = {
        first_name,
        last_name,
        email: email.trim().toLowerCase(),
        password,
        gender: "prefer not to say",
        birthdate: new Date().toISOString(),
      };

      const result = await signUp(userData);

      if (!result.ok) {
        Alert.alert(
          "Registration Failed",
          result.message || "Could not create account"
        );
      } else {
        Alert.alert("Success!", "Your account has been created successfully", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section with Background */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          {/* Background Pattern */}
          <View style={styles.heroPattern}>
            <Text style={styles.patternIcon}>🏕️</Text>
            <Text style={styles.patternIcon}>🌲</Text>
            <Text style={styles.patternIcon}>⛰️</Text>
            <Text style={styles.patternIcon}>🔥</Text>
            <Text style={styles.patternIcon}>🌲</Text>
          </View>

          {/* Logo & Title */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>⛺</Text>
            </View>
            <Text style={styles.appName}>CampConnect</Text>
            <Text style={styles.appTagline}>Your Adventure Starts Here</Text>
          </View>
        </LinearGradient>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, !isSignUp && styles.tabActive]}
              onPress={() => {
                setIsSignUp(false);
                setFullName("");
              }}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isSignUp && styles.tabActive]}
              onPress={() => setIsSignUp(true)}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              {isSignUp ? "Create Account" : "Welcome Back!"}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {isSignUp
                ? "Join our camping community today"
                : "Sign in to continue your adventure"}
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={colors.gray}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.grayLight}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.gray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.grayLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.gray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.grayLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {!isSignUp && (
              <TouchableOpacity
                style={styles.forgotPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              loading && styles.actionButtonDisabled,
            ]}
            onPress={isSignUp ? handleSignUp : handleSignIn}
            activeOpacity={0.8}
            disabled={loading}
          >
            <LinearGradient
              colors={
                loading
                  ? [colors.gray, colors.grayLight]
                  : [colors.primary, colors.primaryDark]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.actionButtonText}>
                    {isSignUp ? "Create Account" : "Sign In"}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign In */}
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Ionicons name="logo-google" size={24} color={colors.danger} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Ionicons name="logo-apple" size={24} color={colors.dark} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>

          {/* Terms */}
          {isSignUp && (
            <Text style={styles.termsText}>
              By signing up, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          )}
        </View>

        {/* Bottom Decoration */}
        <View style={styles.bottomDecoration}>
          <Text style={styles.decorationIcon}>🌲</Text>
          <Text style={styles.decorationIcon}>⛺</Text>
          <Text style={styles.decorationIcon}>🔥</Text>
          <Text style={styles.decorationIcon}>⛰️</Text>
          <Text style={styles.decorationIcon}>🌲</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================================================================ */
/*  Styles - Camping Themed Auth                                   */
/* ================================================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Hero Section
  heroSection: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 80,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: "relative",
    overflow: "hidden",
  },
  heroPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    opacity: 0.1,
    transform: [{ rotate: "-15deg" }],
  },
  patternIcon: {
    fontSize: 40,
  },

  // Logo
  logoContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  logoIcon: {
    fontSize: 50,
  },
  appName: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 36,
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 8,
  },
  appTagline: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
  },

  // Form Card
  formCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: -50,
    padding: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.light,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.cardBg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: colors.gray,
  },
  tabTextActive: {
    fontFamily: "Inter_700Bold",
    color: colors.primary,
  },

  // Welcome
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 28,
    color: colors.dark,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: colors.gray,
  },

  // Form
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: colors.dark,
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  forgotPasswordText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: colors.primary,
  },

  // Action Button
  actionButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginBottom: 24,
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  actionButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: "#fff",
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: colors.gray,
    marginHorizontal: 16,
  },

  // Social Buttons
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Terms
  termsText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: colors.gray,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    fontFamily: "Inter_600SemiBold",
    color: colors.primary,
  },

  // Bottom Decoration
  bottomDecoration: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 30,
    opacity: 0.3,
  },
  decorationIcon: {
    fontSize: 30,
  },
});

export default SignInScreen;
