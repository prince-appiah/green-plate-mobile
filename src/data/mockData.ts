import { capitalizeFirstLetter, ListingCategories } from "@/features/shared";

// Mock data for the home screen
export const IMAGE_URLS = {
  food1:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  food2:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  food3:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  food4:
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop",
};

export const categories = [
  { label: "All", value: "" },
  ...ListingCategories.map((category) => ({
    label: capitalizeFirstLetter(category),
    value: category,
  })),
];

export interface FoodItem {
  id: number;
  imageUrl: string;
  restaurantName: string;
  distance: string;
  rating: string;
  reviews: string;
  categories: string[];
  itemName: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  timeRange: string;
  itemsLeft: string;
  isFavorited: boolean;
  latitude: number;
  longitude: number;
}

export const foodItems: FoodItem[] = [
  {
    id: 1,
    imageUrl: IMAGE_URLS.food1,
    restaurantName: "Green Eats Cafe",
    distance: "0.4 mi",
    rating: "4.8",
    reviews: "120",
    categories: ["Salads", "Sandwiches", "Pastries"],
    itemName: "Magic Bag",
    currentPrice: "$4.99",
    originalPrice: "$10.00",
    discount: "-50%",
    timeRange: "8-9 PM",
    itemsLeft: "2",
    isFavorited: false,
    latitude: 37.7849,
    longitude: -122.4094,
  },
  {
    id: 2,
    imageUrl: IMAGE_URLS.food2,
    restaurantName: "Daily Bread Bakery",
    distance: "1.2 mi",
    rating: "4.5",
    reviews: "85",
    categories: ["Croissants", "Muffins", "Bread"],
    itemName: "Pastry Box",
    currentPrice: "$3.99",
    originalPrice: "$8.00",
    discount: "-30%",
    timeRange: "9-10 PM",
    itemsLeft: "5",
    isFavorited: true,
    latitude: 37.7649,
    longitude: -122.4294,
  },
  {
    id: 3,
    imageUrl: IMAGE_URLS.food3,
    restaurantName: "Urban Bites",
    distance: "0.8 mi",
    rating: "4.6",
    reviews: "240",
    categories: ["Burgers", "Pizza", "Sides"],
    itemName: "Surprise Bag",
    currentPrice: "$5.99",
    originalPrice: "$12.00",
    discount: "-40%",
    timeRange: "7-8 PM",
    itemsLeft: "3",
    isFavorited: false,
    latitude: 37.7749,
    longitude: -122.4094,
  },
  {
    id: 4,
    imageUrl: IMAGE_URLS.food4,
    restaurantName: "Zen Sushi Bar",
    distance: "1.5 mi",
    rating: "4.9",
    reviews: "310",
    categories: ["Sushi", "Ramen", "Dumplings"],
    itemName: "Chef's Selection",
    currentPrice: "$6.99",
    originalPrice: "$15.00",
    discount: "-60%",
    timeRange: "8:30-9:30 PM",
    itemsLeft: "1",
    isFavorited: false,
    latitude: 37.7849,
    longitude: -122.4294,
  },
];

// Transaction type
export interface Transaction {
  id: string;
  listing: {
    id: string;
    title: string;
    restaurant: {
      name: string;
    };
    photoUrl: string;
  };
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "expired" | "cancelled";
  createdAt: string;
}

// Mock transaction data
export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    listing: {
      id: "l1",
      title: "Mediterranean Lunch Box",
      restaurant: { name: "Green Eats Cafe" },
      photoUrl: IMAGE_URLS.food1,
    },
    quantity: 1,
    totalPrice: 5.99,
    status: "confirmed",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "t2",
    listing: {
      id: "l2",
      title: "Assorted Pastry Bag",
      restaurant: { name: "Daily Bread Bakery" },
      photoUrl: IMAGE_URLS.food2,
    },
    quantity: 1,
    totalPrice: 3.99,
    status: "pending",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: "t3",
    listing: {
      id: "l3",
      title: "Organic Veggie Box",
      restaurant: { name: "Urban Bites" },
      photoUrl: IMAGE_URLS.food3,
    },
    quantity: 1,
    totalPrice: 6.99,
    status: "completed",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "t4",
    listing: {
      id: "l4",
      title: "Chef's Surprise Bowl",
      restaurant: { name: "Zen Sushi Bar" },
      photoUrl: IMAGE_URLS.food4,
    },
    quantity: 1,
    totalPrice: 4.99,
    status: "completed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
];

// Mock user data
export interface UserPoints {
  totalPoints: number;
  transactionCount: number;
  currentBadge: "none" | "bronze" | "silver" | "gold";
}

export interface ImpactMetrics {
  mealsSaved: number;
  co2PreventedKg: number;
  transactions: Transaction[];
}

export const mockUserPoints: UserPoints = {
  totalPoints: 1250,
  transactionCount: 8,
  currentBadge: "bronze",
};

export const mockImpact: ImpactMetrics = {
  mealsSaved: 8,
  co2PreventedKg: 12.5,
  transactions: mockTransactions,
};

// Restaurant-specific types and data
export interface RestaurantListing {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  quantity: number;
  quantitySold: number;
  pickupTime: string;
  status: "active" | "paused" | "sold_out" | "expired";
  createdAt: string;
  category: string;
}

export interface RestaurantOrder {
  id: string;
  listing: {
    id: string;
    title: string;
    imageUrl: string;
  };
  customer: {
    name: string;
    phone?: string;
  };
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "ready" | "completed" | "cancelled";
  pickupTime: string;
  createdAt: string;
}

export interface RestaurantAnalytics {
  totalRevenue: number;
  totalListings: number;
  totalOrders: number;
  activeListings: number;
  mealsSaved: number;
  co2PreventedKg: number;
  averageRating: number;
  totalReviews: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
}

// Mock restaurant listings
export const mockRestaurantListings: RestaurantListing[] = [
  {
    id: "rl1",
    title: "Mediterranean Lunch Box",
    description: "Fresh salads, hummus, pita bread, and falafel",
    imageUrl: IMAGE_URLS.food1,
    originalPrice: 10.0,
    currentPrice: 4.99,
    discount: 50,
    quantity: 5,
    quantitySold: 3,
    pickupTime: "8:00 PM - 9:00 PM",
    status: "active",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: "Lunch",
  },
  {
    id: "rl2",
    title: "Pastry Assortment",
    description: "Croissants, muffins, and fresh bread",
    imageUrl: IMAGE_URLS.food2,
    originalPrice: 8.0,
    currentPrice: 3.99,
    discount: 50,
    quantity: 10,
    quantitySold: 5,
    pickupTime: "9:00 PM - 10:00 PM",
    status: "active",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    category: "Bakery",
  },
  {
    id: "rl3",
    title: "Surprise Burger Box",
    description: "Burgers, fries, and sides",
    imageUrl: IMAGE_URLS.food3,
    originalPrice: 12.0,
    currentPrice: 5.99,
    discount: 50,
    quantity: 0,
    quantitySold: 8,
    pickupTime: "7:00 PM - 8:00 PM",
    status: "sold_out",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    category: "Dinner",
  },
  {
    id: "rl4",
    title: "Chef's Selection Sushi",
    description: "Fresh sushi rolls and sashimi",
    imageUrl: IMAGE_URLS.food4,
    originalPrice: 15.0,
    currentPrice: 6.99,
    discount: 53,
    quantity: 2,
    quantitySold: 1,
    pickupTime: "8:30 PM - 9:30 PM",
    status: "active",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    category: "Dinner",
  },
];

// Mock restaurant orders
export const mockRestaurantOrders: RestaurantOrder[] = [
  {
    id: "ro1",
    listing: {
      id: "rl1",
      title: "Mediterranean Lunch Box",
      imageUrl: IMAGE_URLS.food1,
    },
    customer: {
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
    },
    quantity: 1,
    totalPrice: 4.99,
    status: "pending",
    pickupTime: "8:00 PM - 9:00 PM",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "ro2",
    listing: {
      id: "rl2",
      title: "Pastry Assortment",
      imageUrl: IMAGE_URLS.food2,
    },
    customer: {
      name: "Mike Chen",
      phone: "+1 (555) 234-5678",
    },
    quantity: 2,
    totalPrice: 7.98,
    status: "confirmed",
    pickupTime: "9:00 PM - 10:00 PM",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ro3",
    listing: {
      id: "rl4",
      title: "Chef's Selection Sushi",
      imageUrl: IMAGE_URLS.food4,
    },
    customer: {
      name: "Emma Davis",
      phone: "+1 (555) 345-6789",
    },
    quantity: 1,
    totalPrice: 6.99,
    status: "ready",
    pickupTime: "8:30 PM - 9:30 PM",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ro4",
    listing: {
      id: "rl3",
      title: "Surprise Burger Box",
      imageUrl: IMAGE_URLS.food3,
    },
    customer: {
      name: "David Wilson",
    },
    quantity: 1,
    totalPrice: 5.99,
    status: "completed",
    pickupTime: "7:00 PM - 8:00 PM",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock restaurant analytics
export const mockRestaurantAnalytics: RestaurantAnalytics = {
  totalRevenue: 1245.5,
  totalListings: 24,
  totalOrders: 48,
  activeListings: 2,
  mealsSaved: 48,
  co2PreventedKg: 72.5,
  averageRating: 4.7,
  totalReviews: 32,
  revenueThisWeek: 156.75,
  revenueThisMonth: 489.2,
  ordersThisWeek: 12,
  ordersThisMonth: 38,
};
