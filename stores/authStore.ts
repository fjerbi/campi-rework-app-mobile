// stores/authStore.ts
import { authAPI } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// ----- TYPES -----
export type User = {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    picture?: string;
    verified?: boolean;
    userInvitationId?: string;
};

type AuthState = {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;

    // ACTIONS
    signIn: (
        email: string,
        password: string
    ) => Promise<{ ok: boolean; message?: string; user?: User; expirationInMinutes?: number }>;

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

    verifyStoredAuth: () => Promise<void>;
};

// ----- STORE -----
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: true,
            isAuthenticated: false,

            // LOAD STORED TOKEN → VERIFY
            verifyStoredAuth: async () => {
                try {
                    const token = get().token;
                    const user = get().user;

                    if (!token || !user) {
                        set({ loading: false, isAuthenticated: false });
                        return;
                    }

                    const verification = await authAPI.verifyToken();

                    if (verification.success) {
                        set({
                            isAuthenticated: true,
                            loading: false,
                        });
                    } else {
                        // remove invalid token
                        await AsyncStorage.multiRemove(["auth-storage"]);
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            loading: false,
                        });
                    }
                } catch (err) {
                    console.error("verifyStoredAuth error:", err);
                    set({ loading: false, isAuthenticated: false });
                }
            },

            // LOGIN
            signIn: async (email, password) => {
                try {
                    const result = await authAPI.login(email, password);

                    if (!result.success) {
                        return { ok: false, message: result.message };
                    }

                    const { user, token, expirationInMinutes } = result.data;

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                    });

                    return { ok: true, user, expirationInMinutes };
                } catch (err) {
                    console.error("signIn error:", err);
                    return { ok: false, message: "An unexpected error occurred" };
                }
            },

            // REGISTER
            signUp: async (userData) => {
                try {
                    const result = await authAPI.register(userData);

                    if (!result.success) {
                        return { ok: false, message: result.message };
                    }

                    const { user, token } = result.data;

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                    });

                    return { ok: true, user };
                } catch (err) {
                    console.error("signUp error:", err);
                    return { ok: false, message: "An unexpected error occurred" };
                }
            },

            // LOGOUT
            signOut: async () => {
                try {
                    await AsyncStorage.multiRemove(["auth-storage"]);
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                    });
                } catch (err) {
                    console.error("signOut error:", err);
                }
            },

            // UPDATE USER
            updateUser: (updatedUser) => {
                set({ user: updatedUser });
            },
        }),

        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
