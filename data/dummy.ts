export const feedData = [
    {
        id: 1,
        user: {
            name: "Firas JERBI",
            avatar:
                "https://ui-avatars.com/api/?name=Alex+Rivers&background=2D5016&color=fff&bold=true&size=128",
            level: "Wilderness Expert",
        },
        activity: {
            type: "Mountain Camping",
            icon: "trail-sign",
            distance: "15.2 km",
            duration: "3 nights",
            elevation: "2,400m",
        },
        location: "Camping Cap Serrat, Tunisia",
        image:
            "https://nextjs-crud-testing.vercel.app/images/subserrat3.jpg",
        time: "2 days ago",
        likes: 187,
        participants: 6,
        maxParticipants: 10,
        isLiked: false,
        tags: ["Mountain", "Intermediate"],
    },
    {
        id: 2,
        user: {
            name: "John Doe",
            avatar:
                "https://ui-avatars.com/api/?name=Maya+Forest&background=D4772C&color=fff&bold=true&size=128",
            level: "Trail Seeker",
        },
        activity: {
            type: "Forest Camping",
            icon: "leaf",
            distance: "8.5 km",
            duration: "2 nights",
            elevation: "1,200m",
        },
        location: "Sequoia National Park, CA",
        image:
            "https://nextjs-crud-testing.vercel.app/images/subserrat1.jpg",
        time: "5 days ago",
        likes: 142,
        participants: 8,
        maxParticipants: 12,
        isLiked: true,
        tags: ["Forest", "Beginner Friendly"],
    },
    {
        id: 3,
        user: {
            name: "Jake Summit",
            avatar:
                "https://ui-avatars.com/api/?name=Jake+Summit&background=4A7C2C&color=fff&bold=true&size=128",
            level: "Peak Explorer",
        },
        activity: {
            type: "Lakeside Camp",
            icon: "water",
            distance: "6.8 km",
            duration: "1 night",
            elevation: "800m",
        },
        location: "Lake Tahoe, NV",
        image:
            "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=800&q=80",
        time: "1 week ago",
        likes: 203,
        participants: 10,
        maxParticipants: 15,
        isLiked: false,
        tags: ["Lake", "Family Friendly"],
    },
    {
        id: 4,
        user: {
            name: "Sarah Wild",
            avatar:
                "https://ui-avatars.com/api/?name=Sarah+Wild&background=8B7355&color=fff&bold=true&size=128",
            level: "Backpacker",
        },
        activity: {
            type: "Desert Camping",
            icon: "sunny",
            distance: "12.0 km",
            duration: "2 nights",
            elevation: "500m",
        },
        location: "Joshua Tree National Park, CA",
        image:
            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
        time: "2 weeks ago",
        likes: 156,
        participants: 12,
        maxParticipants: 12,
        isLiked: true,
        tags: ["Desert", "Advanced"],
    },
];

export const gearListings = [
    {
        id: 1,
        user: {
            name: "Alex Johnson",
            avatar:
                "https://ui-avatars.com/api/?name=Alex+Johnson&background=2E8B57&color=fff&bold=true&size=128",
            rating: 4.8,
            exchangeCount: 23,
        },
        gear: {
            name: "Coleman 4-Person Tent",
            description:
                "Barely used camping tent, perfect for family trips. Waterproof and easy to set up.",
            image:
                "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
            condition: "Like New",
            category: "Tent",
        },
        location: "Denver, CO",
        status: "public",
        postedTime: "2 days ago",
        isBookmarked: false,
    },
    {
        id: 2,
        user: {
            name: "Sarah Martinez",
            avatar:
                "https://ui-avatars.com/api/?name=Sarah+Martinez&background=FFB347&color=fff&bold=true&size=128",
            rating: 4.9,
            exchangeCount: 34,
        },
        gear: {
            name: "MSR Backpacking Stove",
            description:
                "Compact camping stove with fuel canister. Great condition, used only 3 times.",
            image:
                "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
            condition: "Excellent",
            category: "Cooking",
        },
        location: "Portland, OR",
        status: "public",
        postedTime: "5 days ago",
        isBookmarked: true,
    },
    {
        id: 3,
        user: {
            name: "Mike Chen",
            avatar:
                "https://ui-avatars.com/api/?name=Mike+Chen&background=4F7942&color=fff&bold=true&size=128",
            rating: 4.7,
            exchangeCount: 18,
        },
        gear: {
            name: "Sleeping Bag -15°C",
            description:
                "Heavy-duty winter sleeping bag. Perfect for cold weather camping. Clean and well-maintained.",
            image:
                "https://images.unsplash.com/photo-1520095972714-909e91b038e5?w=800&q=80",
            condition: "Good",
            category: "Sleeping",
        },
        location: "Seattle, WA",
        status: "public",
        postedTime: "1 week ago",
        isBookmarked: false,
    },
];
