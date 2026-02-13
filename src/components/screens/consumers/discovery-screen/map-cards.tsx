import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOTTOM_SHEET_MIN_HEIGHT = 200;
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.7;

interface MapViewListing {
  id: string;
  latitude: number;
  longitude: number;
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
  imageUrl: string;
  isFavorited: boolean;
  isSoldOut: boolean;
}

interface MapCardsProps {
  listings: MapViewListing[];
  favorites: string[];
  tabBarHeight: number;
  onToggleFavorite: (id: string) => void;
  selectedListingId?: string | null;
}

export function MapCards({ listings, favorites, tabBarHeight, onToggleFavorite, selectedListingId }: MapCardsProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(BOTTOM_SHEET_MIN_HEIGHT);
  const animatedHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;
  const startHeight = useRef(BOTTOM_SHEET_MIN_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical gestures
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        startHeight.current = bottomSheetHeight;
        animatedHeight.setValue(bottomSheetHeight);
      },
      onPanResponderMove: (_, gestureState) => {
        const newHeight = Math.max(
          BOTTOM_SHEET_MIN_HEIGHT,
          Math.min(BOTTOM_SHEET_MAX_HEIGHT, startHeight.current - gestureState.dy),
        );
        animatedHeight.setValue(newHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentHeight = startHeight.current - gestureState.dy;
        let newHeight = currentHeight;

        // Snap to min or max height based on gesture
        if (gestureState.dy > 50) {
          // Dragging down
          newHeight = BOTTOM_SHEET_MIN_HEIGHT;
        } else if (gestureState.dy < -50) {
          // Dragging up
          newHeight = BOTTOM_SHEET_MAX_HEIGHT;
        } else {
          // Snap to nearest
          const midPoint = (BOTTOM_SHEET_MIN_HEIGHT + BOTTOM_SHEET_MAX_HEIGHT) / 2;
          newHeight = currentHeight < midPoint ? BOTTOM_SHEET_MIN_HEIGHT : BOTTOM_SHEET_MAX_HEIGHT;
        }

        // Clamp between min and max
        newHeight = Math.max(BOTTOM_SHEET_MIN_HEIGHT, Math.min(BOTTOM_SHEET_MAX_HEIGHT, newHeight));

        setBottomSheetHeight(newHeight);

        Animated.spring(animatedHeight, {
          toValue: newHeight,
          useNativeDriver: false, // Height animation doesn't support native driver
          tension: 50,
          friction: 8,
        }).start();
      },
    }),
  ).current;

  // Sync animated value with state
  useEffect(() => {
    animatedHeight.setValue(bottomSheetHeight);
  }, [bottomSheetHeight]);

  // Scroll to selected listing when marker is pressed
  useEffect(() => {
    if (selectedListingId && scrollViewRef.current) {
      const index = listings.findIndex((listing) => listing.id === selectedListingId);
      if (index !== -1) {
        // Small delay to ensure the sheet is rendered
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: index * 100, // Approximate item height
            animated: true,
          });
        }, 100);
      }
    }
  }, [selectedListingId, listings]);

  if (listings.length === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: animatedHeight,
        },
      ]}
    >
      {/* Handle indicator - draggable area */}
      <View style={styles.handleContainer} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: tabBarHeight + 16,
          },
        ]}
        style={styles.scrollView}
      >
        {listings.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/(consumers)/listing/${item.id}`)}
            style={[styles.card, selectedListingId === item.id && styles.selectedCard]}
          >
            {/* Square Image on Left */}
            <View style={styles.imageContainer}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="restaurant" size={24} color="#9ca3af" />
                </View>
              )}

              {/* Discount Badge */}
              {!item.isSoldOut && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{item.discount}</Text>
                </View>
              )}

              {/* Sold Out Overlay */}
              {item.isSoldOut && (
                <View style={styles.soldOutOverlay}>
                  <Text style={styles.soldOutText}>Sold Out</Text>
                </View>
              )}
            </View>

            {/* Content on Right */}
            <View style={styles.contentContainer}>
              <View style={styles.contentHeader}>
                <View style={styles.contentHeaderLeft}>
                  <Text style={styles.restaurantName} numberOfLines={1}>
                    {item.restaurantName}
                  </Text>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.itemName}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  style={styles.favoriteButton}
                >
                  <Ionicons
                    name={item.isFavorited ? "heart" : "heart-outline"}
                    size={18}
                    color={item.isFavorited ? "#ef4444" : "#9ca3af"}
                  />
                </TouchableOpacity>
              </View>

              {/* Info Row */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="location-outline" size={12} color="#6b7280" />
                  <Text style={styles.infoText}>{item.distance}</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={12} color="#6b7280" />
                  <Text style={styles.infoText} numberOfLines={1}>
                    {item.timeRange}
                  </Text>
                </View>
              </View>

              {/* Price Row */}
              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>{item.currentPrice}</Text>
                <Text style={styles.originalPrice}>{item.originalPrice}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: "#16a34a",
    borderWidth: 2,
    backgroundColor: "#f0fdf4",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    position: "relative",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  discountBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#16a34a",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  soldOutOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  soldOutText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  contentHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  favoriteButton: {
    padding: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    fontSize: 11,
    color: "#6b7280",
    marginLeft: 4,
  },
  infoDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#d1d5db",
    marginHorizontal: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#16a34a",
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },
});
