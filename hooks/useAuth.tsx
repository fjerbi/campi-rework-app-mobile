import { authAPI } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  picture?: string;
  verified?: boolean;
  userInvitationId?: string;
  // Add other fields from your backend User model as needed
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    ok: boolean;
    message?: string;
    user?: User;
    expirationInMinutes?: number;
  }>;
  signUp: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    gender?: string;
    birthdate?: string;
  }) => Promise<{ ok: boolean; message?: string; user?: User }>;
  signOut: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      const storedUserData = await AsyncStorage.getItem("userData");

      if (storedToken && storedUserData) {
        const parsedUser = JSON.parse(storedUserData);

        // Verify token is still valid
        const verification = await authAPI.verifyToken();

        if (verification.success) {
          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Token expired, clear storage
          await clearAuth();
        }
      }
    } catch (error) {
      console.error("Error loading auth:", error);
      await clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = async () => {
    try {
      await AsyncStorage.multiRemove(["authToken", "userData"]);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error clearing auth:", error);
    }
  };

  async function signIn(
    email: string,
    password: string
  ): Promise<{
    ok: boolean;
    message?: string;
    user?: User;
    expirationInMinutes?: number;
  }> {
    try {
      const result = await authAPI.login(email, password);

      if (result.success) {
        const { user, token: authToken, expirationInMinutes } = result.data;

        // Store auth data
        await AsyncStorage.setItem("authToken", authToken);
        await AsyncStorage.setItem("userData", JSON.stringify(user));

        setToken(authToken);
        setUser(user);
        setIsAuthenticated(true);

        return { ok: true, user, expirationInMinutes };
      } else {
        return { ok: false, message: result.message };
      }
    } catch (error) {
      console.error("Sign in error:", error);
      return { ok: false, message: "An unexpected error occurred" };
    }
  }

  async function signUp(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    gender?: string;
    birthdate?: string;
  }): Promise<{ ok: boolean; message?: string; user?: User }> {
    try {
      const result = await authAPI.register(userData);

      if (result.success) {
        const { user, token: authToken } = result.data;

        // Store auth data
        await AsyncStorage.setItem("authToken", authToken);
        await AsyncStorage.setItem("userData", JSON.stringify(user));

        setToken(authToken);
        setUser(user);
        setIsAuthenticated(true);

        return { ok: true, user };
      } else {
        return { ok: false, message: result.message };
      }
    } catch (error) {
      console.error("Sign up error:", error);
      return { ok: false, message: "An unexpected error occurred" };
    }
  }

  async function signOut() {
    await clearAuth();
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default useAuth;
