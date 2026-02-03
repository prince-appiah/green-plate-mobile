# Component Splitting Patterns

This document provides detailed guidance on splitting large components into smaller, focused components in Green Plate.

## When to Split Components

Split a component when you identify:

1. **Multiple UI sections** - Distinct visual areas with minimal coupling that can be composed independently
1. **Conditional rendering blocks** - Large `{condition && <JSX />}` blocks
1. **Repeated patterns** - Similar UI structures used multiple times
1. **300+ lines** - Component exceeds manageable size
1. **Modal clusters** - Multiple modals rendered in one component

## Splitting Strategies

### Strategy 1: Section-Based Splitting

Identify visual sections and extract each as a component.

```typescript
// ❌ Before: Monolithic component (500+ lines)
const RestaurantDetailScreen = () => {
  return (
    <ScrollView>
      {/* Header Section - 50 lines */}
      <View className="header">
        <Image source={{uri: restaurant.image}} />
        <Text>{restaurant.name}</Text>
        <Rating value={restaurant.rating} />
      </View>

      {/* Menu Section - 200 lines */}
      <View className="menu">
        <MenuList items={menu} onSelect={handleSelect} />
      </View>

      {/* Booking Section - 150 lines */}
      <View className="booking">
        <BookingForm onSubmit={handleBook} />
      </View>

      {/* Modals Section - 100 lines */}
      {showReservation && <ReservationModal ... />}
      {showMap && <MapModal ... />}
      {showConfirm && <ConfirmModal ... />}
    </ScrollView>
  )
}

// ✅ After: Split into focused components
// restaurant-detail/
//   ├── index.tsx              (orchestration)
//   ├── restaurant-header.tsx
//   ├── restaurant-menu.tsx
//   ├── restaurant-booking.tsx
//   └── restaurant-modals.tsx

// restaurant-header.tsx
interface RestaurantHeaderProps {
  restaurant: Restaurant
  onViewMap: () => void
}

const RestaurantHeader: FC<RestaurantHeaderProps> = ({
  restaurant,
  onViewMap,
}) => {
  return (
    <View className="header">
      <Image source={{uri: restaurant.image}} />
      <Text>{restaurant.name}</Text>
      <Rating value={restaurant.rating} />
      <Button onPress={onViewMap}>View Location</Button>
    </View>
  )
}

// index.tsx (orchestration only)
const RestaurantDetailScreen = () => {
  const { bookingState, updateBooking } = useReservationBooking(restaurantId)
  const { activeModal, openModal, closeModal } = useReservationModals()

  return (
    <ScrollView>
      <RestaurantHeader
        restaurant={restaurant}
        onViewMap={() => openModal('map')}
      />
      <RestaurantMenu
        items={menu}
        onSelect={updateBooking}
      />
      <RestaurantBooking
        booking={bookingState}
        onBook={handleBooking}
      />
      <RestaurantModals
        activeModal={activeModal}
        onClose={closeModal}
      />
    </ScrollView>
  )
}
```

### Strategy 2: Conditional Block Extraction

Extract large conditional rendering blocks.

```typescript
// ❌ Before: Large conditional blocks
const ReservationCard = () => {
  return (
    <View>
      {isExpanded ? (
        <View className="expanded">
          {/* 100 lines of expanded view */}
        </View>
      ) : (
        <View className="collapsed">
          {/* 50 lines of collapsed view */}
        </View>
      )}
    </View>
  )
}

// ✅ After: Separate view components
const ReservationCardExpanded: FC<ReservationCardViewProps> = ({ reservation, onAction }) => {
  return (
    <View className="expanded">
      {/* Clean, focused expanded view */}
    </View>
  )
}

const ReservationCardCollapsed: FC<ReservationCardViewProps> = ({ reservation, onAction }) => {
  return (
    <View className="collapsed">
      {/* Clean, focused collapsed view */}
    </View>
  )
}

const AppInfo = () => {
  return (
    <div>
      {expand
      {isExpanded
        ? <ReservationCardExpanded reservation={reservation} onAction={handleAction} />
        : <ReservationCardCollapsed reservation={reservation} onAction={handleAction} />
      }
    </View>
  )
}
```

### Strategy 3: Modal Extraction

Extract modals with their trigger logic.

```typescript
// ❌ Before: Multiple modals in one component
const ReservationScreen = () => {
  const [showEditReservation, setShowEditReservation] = useState(false)
  const [showCancelReservation, setShowCancelReservation] = useState(false)
  const [showSelectRestaurant, setShowSelectRestaurant] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const onEdit = async (data) => { /* 20 lines */ }
  const onCancel = async (data) => { /* 20 lines */ }
  const onSelectRestaurant = async () => { /* 15 lines */ }

  return (
    <View>
      {/* Main content */}

      {showEditReservation && <EditReservationModal onConfirm={onEdit} onClose={() => setShowEditReservation(false)} />}
      {showCancelReservation && <CancelReservationModal onConfirm={onCancel} onClose={() => setShowCancelReservation(false)} />}
      {showSelectRestaurant && <SelectRestaurantModal onConfirm={onSelectRestaurant} onClose={() => setShowSelectRestaurant(false)} />}
      {showConfirm && <ConfirmModal ... />}
    </View>
  )
}

// ✅ After: Modal manager component
// reservation-modals.tsx
type ModalType = 'editReservation' | 'cancelReservation' | 'selectRestaurant' | 'confirm' | null

interface ReservationModalsProps {
  reservation: Reservation
  activeModal: ModalType
  onClose: () => void
  onSuccess: () => void
}

const ReservationModals: FC<ReservationModalsProps> = ({
  reservation,
  activeModal,
  onClose,
  onSuccess,
}) => {
  const handleEdit = async (data) => { /* logic */ }
  const handleCancel = async (data) => { /* logic */ }
  const handleSelectRestaurant = async () => { /* logic */ }

  return (
    <>
      {activeModal === 'editReservation' && (
        <EditReservationModal
          reservation={reservation}
          onConfirm={handleEdit}
          onClose={onClose}
        />
      )}
      {activeModal === 'cancelReservation' && (
        <CancelReservationModal
          reservation={reservation}
          onConfirm={handleCancel}
          onClose={onClose}
        />
      )}
      {activeModal === 'selectRestaurant' && (
        <SelectRestaurantModal
          onConfirm={handleSelectRestaurant}
          onClose={onClose}
        />
      )}
      {activeModal === 'confirm' && (
        <ConfirmModal
          reservation={reservation}
          onClose={onClose}
        />
      )}
    </>
  )
}

// Parent component
const ReservationScreen = () => {
  const { activeModal, openModal, closeModal } = useReservationModals()

  return (
    <View>
      {/* Main content with openModal triggers */}
      <Button onPress={() => openModal('editReservation')}>Edit</Button>

      <ReservationModals
        reservation={reservation}
        activeModal={activeModal}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </View>
  )
}
```

### Strategy 4: List Item Extraction

Extract repeated item rendering.

```typescript
// ❌ Before: Inline item rendering
const RestaurantsList = () => {
  return (
    <ScrollView>
      {restaurants.map(restaurant => (
        <View key={restaurant.id} className="restaurant-item">
          <Image source={{uri: restaurant.image}} />
          <Text>{restaurant.name}</Text>
          <Text>{restaurant.cuisine}</Text>
          <Button onPress={() => restaurant.onPress()}>
            {restaurant.buttonLabel}
          </Button>
          {restaurant.badge && <Badge>{restaurant.badge}</Badge>}
          {/* More complex rendering... */}
        </View>
      ))}
    </ScrollView>
  )
}

// ✅ After: Extracted item component
interface RestaurantItemProps {
  restaurant: Restaurant
  onPress: (id: string) => void
}

const RestaurantItem: FC<RestaurantItemProps> = ({ restaurant, onPress }) => {
  return (
    <View className="restaurant-item">
      <Image source={{uri: restaurant.image}} />
      <Text>{restaurant.name}</Text>
      <Text>{restaurant.cuisine}</Text>
      <Button onPress={() => onPress(restaurant.id)}>
        {restaurant.buttonLabel}
      </Button>
      {restaurant.badge && <Badge>{restaurant.badge}</Badge>}
    </View>
  )
}

const RestaurantsList = () => {
  const handlePress = useCallback((id: string) => {
    const restaurant = restaurants.find(r => r.id === id)
    restaurant?.onPress()
  }, [restaurants])

  return (
    <ScrollView>
      {restaurants.map(restaurant => (
        <RestaurantItem
          key={restaurant.id}
          restaurant={restaurant}
          onPress={handlePress}
        />
      ))}
    </ScrollView>
  )
}
```

## Directory Structure Patterns

### Pattern A: Flat Structure (Simple Components)

For components with 2-3 sub-components:

```
component-name/
  ├── index.tsx           # Main component
  ├── sub-component-a.tsx
  ├── sub-component-b.tsx
  └── types.ts            # Shared types
```

### Pattern B: Nested Structure (Complex Components)

For components with many sub-components:

```
component-name/
  ├── index.tsx           # Main orchestration
  ├── types.ts            # Shared types
  ├── hooks/
  │   ├── use-feature-a.ts
  │   └── use-feature-b.ts
  ├── components/
  │   ├── header/
  │   │   └── index.tsx
  │   ├── content/
  │   │   └── index.tsx
  │   └── modals/
  │       └── index.tsx
  └── utils/
      └── helpers.ts
```

### Pattern C: Feature-Based Structure (Green Plate Standard)

Following Green Plate's existing patterns:

```
features/reservations/
  ├── index.ts           # Feature exports
  ├── hooks/             # Custom hooks
  │   ├── use-reservation-booking.ts
  │   ├── use-reservation-modals.ts
  │   └── use-reservation-filters.ts
  ├── services/          # API services
  │   ├── reservations.service.ts
  │   └── reservations-types.ts
  ├── components/        # Feature-specific components
  │   ├── reservation-card.tsx
  │   ├── reservation-modals.tsx
  │   └── reservation-form.tsx
  └── types/
      └── reservations.ts
```

## Props Design

### Minimal Props Principle

Pass only what's needed:

```typescript
// ❌ Bad: Passing entire objects when only some fields needed
<ReservationHeader reservation={reservation} restaurant={restaurant} />

// ✅ Good: Destructure to minimum required
<ReservationHeader
  reservationTime={reservation.time}
  restaurantName={restaurant.name}
  onModify={handleModify}
/>
```

### Callback Props Pattern

Use callbacks for child-to-parent communication:

```typescript
// Parent
const Parent = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <DatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      onConfirm={handleConfirm}
    />
  )
}

// Child
interface DatePickerProps {
  value: Date | null
  onChange: (date: Date) => void
  onConfirm: () => void
}

const DatePicker: FC<DatePickerProps> = ({ value, onChange, onConfirm }) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onChange(new Date())}>
        <Text>{value?.toDateString()}</Text>
      </TouchableOpacity>
      <Button onPress={onConfirm}>Confirm</Button>
    </View>
  )
}
```

### Render Props for Flexibility

When sub-components need parent context:

```typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  renderEmpty?: () => React.ReactNode
}

function List<T>({ items, renderItem, renderEmpty }: ListProps<T>) {
  if (items.length === 0 && renderEmpty) {
    return <>{renderEmpty()}</>
  }

  return (
    <div>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  )
}

// Usage
<List
  items={operations}
  renderItem={(op, i) => <OperationItem key={i} operation={op} />}
  renderEmpty={() => <EmptyState message="No operations" />}
/>
```
