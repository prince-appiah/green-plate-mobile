# Complexity Reduction Patterns

This document provides patterns for reducing cognitive complexity in Green Plate React Native components.

## Understanding Complexity

### SonarJS Cognitive Complexity

The `pnpm analyze-component` tool uses SonarJS cognitive complexity metrics:

- **Total Complexity**: Sum of all functions' complexity in the file
- **Max Complexity**: Highest single function complexity

### What Increases Complexity

| Pattern             | Complexity Impact    |
| ------------------- | -------------------- | -------- | --------------- |
| `if/else`           | +1 per branch        |
| Nested conditions   | +1 per nesting level |
| `switch/case`       | +1 per case          |
| `for/while/do`      | +1 per loop          |
| `&&`/`              |                      | ` chains | +1 per operator |
| Nested callbacks    | +1 per nesting level |
| `try/catch`         | +1 per catch         |
| Ternary expressions | +1 per nesting       |

## Pattern 1: Replace Conditionals with Lookup Tables

**Before** (complexity: ~15):

```typescript
const ReservationStatus = useMemo(() => {
  if (reservation?.status === 'confirmed') {
    switch (userRole) {
      case 'consumer':
        return <ConsumerConfirmedView reservation={reservation} />
      case 'restaurant':
        return <RestaurantConfirmedView reservation={reservation} />
      default:
        return <GuestConfirmedView reservation={reservation} />
    }
  }
  if (reservation?.status === 'pending') {
    switch (userRole) {
      case 'consumer':
        return <ConsumerPendingView reservation={reservation} />
      case 'restaurant':
        return <RestaurantPendingView reservation={reservation} />
      default:
        return <GuestPendingView reservation={reservation} />
    }
  }
  if (reservation?.status === 'cancelled') {
    switch (userRole) {
      case 'consumer':
        return <ConsumerCancelledView reservation={reservation} />
      case 'restaurant':
        return <RestaurantCancelledView reservation={reservation} />
      default:
        return <GuestCancelledView reservation={reservation} />
    }
  }
  return null
}, [reservation, userRole])
```

**After** (complexity: ~3):

```typescript
// Define lookup table outside component
const STATUS_VIEW_MAP: Record<ReservationStatus, Record<UserRole, FC<StatusViewProps>>> = {
  confirmed: {
    consumer: ConsumerConfirmedView,
    restaurant: RestaurantConfirmedView,
    guest: GuestConfirmedView,
  },
  pending: {
    consumer: ConsumerPendingView,
    restaurant: RestaurantPendingView,
    guest: GuestPendingView,
  },
  cancelled: {
    consumer: ConsumerCancelledView,
    restaurant: RestaurantCancelledView,
    guest: GuestCancelledView,
  },
}

// Clean component logic
const ReservationStatus = useMemo(() => {
  if (!reservation?.status) return null

  const views = STATUS_VIEW_MAP[reservation.status]
  if (!views) return null

  const StatusView = views[userRole] ?? views.guest
  return <StatusView reservation={reservation} />
}, [reservation, userRole])
```

## Pattern 2: Use Early Returns

**Before** (complexity: ~10):

```typescript
const canCompleteBooking = () => {
  if (isValid) {
    if (hasAvailability) {
      if (isConnected) {
        submitBooking();
      } else {
        showConnectionError();
      }
    } else {
      showUnavailableError();
    }
  } else {
    showValidationError();
  }
};
```

**After** (complexity: ~4):

```typescript
const canCompleteBooking = () => {
  if (!isValid) {
    showValidationError();
    return;
  }

  if (!hasAvailability) {
    showUnavailableError();
    return;
  }

  if (!isConnected) {
    showConnectionError();
    return;
  }

  submitBooking();
};
```

## Pattern 3: Extract Complex Conditions

**Before** (complexity: high):

```typescript
const canCreateListing = (() => {
  if (restaurantMode !== ListingMode.STANDARD) {
    if (!isPremiumUser) return true;

    if (listingType === ListingType.premium) {
      if (!hasCompletedProfile || !hasVerifiedPhotos) return false;
      return true;
    }
    return true;
  }
  return !hasMissingInfo;
})();
```

**After** (complexity: lower):

```typescript
// Extract to named functions
const canCreateStandardListing = () => !hasMissingInfo;

const canCreatePremiumListing = () => {
  if (!isPremiumUser) return true;
  if (listingType !== ListingType.premium) return true;
  return hasCompletedProfile && hasVerifiedPhotos;
};

// Clean main logic
const canCreateListing =
  restaurantMode === ListingMode.STANDARD ? canCreateStandardListing() : canCreatePremiumListing();
```

## Pattern 4: Replace Chained Ternaries

**Before** (complexity: ~5):

```typescript
const reservationStatusText = isConfirmed
  ? t("status.confirmed")
  : isPending
    ? t("status.pending")
    : isCancelled
      ? t("status.cancelled")
      : t("status.unknown");
```

**After** (complexity: ~2):

```typescript
const getReservationStatusText = () => {
  if (isConfirmed) return t("status.confirmed");
  if (isPending) return t("status.pending");
  if (isCancelled) return t("status.cancelled");
  return t("status.unknown");
};

const reservationStatusText = getReservationStatusText();
```

Or use lookup:

```typescript
const RESERVATION_STATUS_MAP = {
  confirmed: "status.confirmed",
  pending: "status.pending",
  cancelled: "status.cancelled",
  unknown: "status.unknown",
} as const;

const getStatusKey = (): keyof typeof RESERVATION_STATUS_MAP => {
  if (isConfirmed) return "confirmed";
  if (isPending) return "pending";
  if (isCancelled) return "cancelled";
  return "unknown";
};

const reservationStatusText = t(RESERVATION_STATUS_MAP[getStatusKey()]);
```

## Pattern 5: Flatten Nested Loops

**Before** (complexity: high):

```typescript
const processRestaurantListings = (restaurants: Restaurant[]) => {
  const results: ListingCard[] = [];

  for (const restaurant of restaurants) {
    if (restaurant.isActive) {
      for (const menu of restaurant.menus) {
        if (menu.isPublished) {
          for (const item of menu.items) {
            if (item.available) {
              results.push({
                restaurantId: restaurant.id,
                menuId: menu.id,
                itemName: item.name,
                price: item.price,
              });
            }
          }
        }
      }
    }
  }

  return results;
};
```

**After** (complexity: lower):

```typescript
// Use functional approach
const processRestaurantListings = (restaurants: Restaurant[]) => {
  return restaurants
    .filter((restaurant) => restaurant.isActive)
    .flatMap((restaurant) =>
      restaurant.menus
        .filter((menu) => menu.isPublished)
        .flatMap((menu) =>
          menu.items
            .filter((item) => item.available)
            .map((item) => ({
              restaurantId: restaurant.id,
              menuId: menu.id,
              itemName: item.name,
              price: item.price,
            })),
        ),
    );
};
```

## Pattern 6: Extract Event Handler Logic

**Before** (complexity: high in component):

```typescript
const ReservationCard = () => {
  const handleSelectRestaurant = (data: Restaurant[]) => {
    if (isEqual(data.map(item => item.id), selectedRestaurants.map(item => item.id))) {
      closeRestaurantModal()
      return
    }

    triggerAnalytics()
    let newRestaurants = data
    if (data.find(item => !item.name)) {
      const newSelected = produce(data, (draft) => {
        data.forEach((item, index) => {
          if (!item.name) {
            const existing = selectedRestaurants.find(i => i.id === item.id)
            if (existing)
              draft[index] = existing
          }
        })
      })
      setSelectedRestaurants(newSelected)
      newRestaurants = newSelected
    }
    else {
      setSelectedRestaurants(data)
    }
    closeRestaurantModal()

    // 40 more lines of logic...
  }

  return <View>...</View>
}
```

**After** (complexity: lower):

```typescript
// Extract to hook
const useRestaurantSelection = (selectedRestaurants: Restaurant[], setSelectedRestaurants: SetState<Restaurant[]>) => {
  const normalizeSelection = (data: Restaurant[]) => {
    const hasUnloadedItem = data.some(item => !item.name)
    if (!hasUnloadedItem) return data

    return produce(data, (draft) => {
      data.forEach((item, index) => {
        if (!item.name) {
          const existing = selectedRestaurants.find(i => i.id === item.id)
          if (existing) draft[index] = existing
        }
      })
    })
  }

  const hasSelectionChanged = (newData: Restaurant[]) => {
    return !isEqual(
      newData.map(item => item.id),
      selectedRestaurants.map(item => item.id)
    )
  }

  return { normalizeSelection, hasSelectionChanged }
}

// Component becomes cleaner
const ReservationCard = () => {
  const { normalizeSelection, hasSelectionChanged } = useRestaurantSelection(selectedRestaurants, setSelectedRestaurants)

  const handleSelectRestaurant = (data: Restaurant[]) => {
    if (!hasSelectionChanged(data)) {
      closeRestaurantModal()
      return
    }

    triggerAnalytics()
    const normalized = normalizeSelection(data)
    setSelectedRestaurants(normalized)
    closeRestaurantModal()
  }

  return <View>...</View>
}
```

## Pattern 7: Reduce Boolean Logic Complexity

**Before** (complexity: ~8):

```typescript
const canConfirmBooking =
  hasPermissions ||
  bookingCreated ||
  restaurantAvailable ||
  paymentProcessed ||
  (isPremium && !restaurantBooked?.capacity) ||
  (isStandard && !bookingDetails.updated_at);
```

**After** (complexity: ~3):

```typescript
// Extract meaningful boolean functions
const isBookingReady = () => {
  if (isPremium) return !!restaurantBooked?.capacity;
  return !!bookingDetails.updated_at;
};

const hasRequiredPermissions = () => {
  return isUserAuthenticated && hasPermissions;
};

const canConfirmBooking = () => {
  if (!hasRequiredPermissions()) return false;
  if (!isBookingReady()) return false;
  if (!restaurantAvailable) return false;
  if (!paymentProcessed) return false;
  return true;
};
```

## Pattern 8: Simplify useMemo/useCallback Dependencies

**Before** (complexity: multiple recalculations):

```typescript
const filteredListings = useMemo(() => {
  let results: Listing[] = [];
  let stats: ListingStats = { total: 0, available: 0 };

  if (!published) {
    results = (listings || []).map((item) => ({
      id: item.id,
      name: item.name,
      status: "draft",
      rating: 0,
    }));
    stats = { total: results.length, available: 0 };
  } else if (detail && detail.restaurant) {
    results = (listings || []).map((item) => ({
      id: item.id,
      name: item.name,
      status: detail.restaurant.verified ? "verified" : "pending",
      rating: detail.restaurant.ratings?.average || 0,
    }));
    stats = { total: results.length, available: results.filter((r) => r.status === "verified").length };
  }

  return {
    icon: detail?.icon || icon,
    title: detail?.title || name,
    listings: results,
    stats,
    // ...more fields
  };
}, [detail, published, restaurantId, icon, name, description, listings, stats]);
```

**After** (complexity: separated concerns):

```typescript
// Separate transformations
const useListingTransform = (listings: Listing[], detail?: RestaurantDetail, published?: boolean) => {
  return useMemo(() => {
    if (!published) {
      return listings.map((item) => ({
        id: item.id,
        name: item.name,
        status: "draft",
        rating: 0,
      }));
    }

    if (!detail?.restaurant) return [];

    return listings.map((item) => ({
      id: item.id,
      name: item.name,
      status: detail.restaurant.verified ? "verified" : "pending",
      rating: detail.restaurant.ratings?.average || 0,
    }));
  }, [listings, detail, published]);
};

// Component uses hook
const transformedListings = useListingTransform(listings, detail, published);
const listingStats = useMemo(
  () => ({
    total: transformedListings.length,
    available: transformedListings.filter((r) => r.status === "verified").length,
  }),
  [transformedListings],
);

const payload = useMemo(
  () => ({
    icon: detail?.icon || icon,
    title: detail?.title || name,
    listings: transformedListings,
    stats: listingStats,
    // ...
  }),
  [detail, icon, name, transformedListings, listingStats],
);
```

## Target Metrics After Refactoring

| Metric                  | Target         |
| ----------------------- | -------------- |
| Total Complexity        | < 50           |
| Max Function Complexity | < 30           |
| Function Length         | < 30 lines     |
| Nesting Depth           | ≤ 3 levels     |
| Conditional Chains      | ≤ 3 conditions |
