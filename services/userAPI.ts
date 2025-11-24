import api from "./api";

interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    picture?: string;
    verified?: boolean;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// Cache for storing users to reduce API calls
let userCache: User[] = [];

// Get users from trip participants
async function fetchUsersFromTrips(): Promise<User[]> {
    try {
        const tripsRes = await api.get('/trips');
        if (!tripsRes.data || !Array.isArray(tripsRes.data)) return [];

        const users = new Map<string, User>();

        tripsRes.data.forEach((trip: any) => {
            if (trip.participants && Array.isArray(trip.participants)) {
                trip.participants.forEach((user: any) => {
                    if (user && user.id) {
                        users.set(user.id, user);
                    }
                });
            }
        });

        return Array.from(users.values());
    } catch (error) {
        console.error('Error fetching users from trips:', error);
        return [];
    }
}

// Fetch all users from backend
const fetchAllUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/allUsers');

        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data?.users && Array.isArray(response.data.users)) {
            return response.data.users;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        console.warn('Unexpected API response format:', response.data);
        return [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const userAPI = {
    /**
     * Search users
     */
    searchUsers: async (query: string): Promise<ApiResponse<User[]>> => {
        try {
            if (!query.trim()) {
                return { success: true, data: [] };
            }

            const allUsers = await fetchAllUsers();
            if (allUsers.length === 0) {
                return {
                    success: true,
                    data: [],
                    message: 'No users found in the database'
                };
            }

            const searchLower = query.toLowerCase();
            const filteredUsers = allUsers.filter(user =>
                user &&
                (
                    user.first_name?.toLowerCase().includes(searchLower) ||
                    user.last_name?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.username?.toLowerCase().includes(searchLower)
                )
            );

            return {
                success: true,
                data: filteredUsers,
                message: filteredUsers.length === 0 ? 'No matching users found' : undefined
            };
        } catch (error) {
            console.error('Search error:', error);
            return {
                success: false,
                data: [],
                message: 'Failed to search users'
            };
        }
    },

    /**
     * Get a user by ID
     */
    getUserById: async (userId: string): Promise<ApiResponse<User>> => {
        try {
            // Check cache
            const cachedUser = userCache.find(u => u.id === userId);
            if (cachedUser) {
                return { success: true, data: cachedUser };
            }

            // Load from trips
            const users = await fetchUsersFromTrips();
            const user = users.find(u => u.id === userId);

            if (user) {
                userCache = [...new Set([...userCache, ...users])];
                return { success: true, data: user };
            }

            throw new Error('User not found');
        } catch (err: any) {
            console.error(`Error fetching user ${userId}:`, err);
            return {
                success: false,
                message: err.response?.data?.message || err.message || "Failed to fetch user"
            };
        }
    },

    /**
     * Get multiple users by IDs
     */
    getUsersByIds: async (userIds: string[]): Promise<ApiResponse<User[]>> => {
        try {
            const cachedUsers = userCache.filter(u => userIds.includes(u.id));
            const missingIds = userIds.filter(id => !cachedUsers.some(u => u.id === id));

            if (missingIds.length === 0) {
                return { success: true, data: cachedUsers };
            }

            const users = await fetchUsersFromTrips();
            userCache = [...new Set([...userCache, ...users])];

            const result = users.filter(u => userIds.includes(u.id));

            return { success: true, data: result };
        } catch (err: any) {
            console.error('Error fetching users by IDs:', err);
            return {
                success: false,
                message: err.response?.data?.message || err.message || "Failed to fetch users"
            };
        }
    },

    /**
     * Clear cached users
     */
    clearCache: () => {
        userCache = [];
    }
};
