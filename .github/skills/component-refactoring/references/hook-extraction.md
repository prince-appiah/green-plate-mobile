# Hook Extraction Patterns

This document provides detailed guidance on extracting custom hooks from complex components in Green Plate.

## When to Extract Hooks

Extract a custom hook when you identify:

1. **Coupled state groups** - Multiple `useState` hooks that are always used together
1. **Complex effects** - `useEffect` with multiple dependencies or cleanup logic
1. **Business logic** - Data transformations, validations, or calculations
1. **Reusable patterns** - Logic that appears in multiple components

## Extraction Process

### Step 1: Identify State Groups

Look for state variables that are logically related:

```typescript
// ❌ These belong together - extract to hook
const [bookingDetails, setBookingDetails] = useState<BookingDetails>(...)
const [reservationTime, setReservationTime] = useState<Date | null>(null)
const [partySize, setPartySize] = useState<number>(1)
const [selectedItems, setSelectedItems] = useState<MenuItem[]>([])

// These are reservation-related state that should be in useReservationBooking()
```

### Step 2: Identify Related Effects

Find effects that modify the grouped state:

```typescript
// ❌ These effects belong with the state above
useEffect(() => {
  if (restaurantLoaded && !selectedItems.length) {
    const defaultItems = restaurant?.defaultMenuItems || [];
    setSelectedItems(defaultItems);
  }
}, [restaurantLoaded, restaurant?.id]);
```

### Step 3: Create the Hook

```typescript
// features/reservations/hooks/use-reservation-booking.ts
import type { BookingDetails, MenuItem, Restaurant } from "@/types/reservations";
import { produce } from "immer";
import { useEffect, useState } from "react";

interface UseReservationBookingParams {
  initialBooking?: Partial<BookingDetails>;
  restaurant?: Restaurant;
  restaurantLoaded: boolean;
}

interface UseReservationBookingReturn {
  bookingDetails: BookingDetails;
  setBookingDetails: (details: BookingDetails) => void;
  reservationTime: Date | null;
  setReservationTime: (time: Date | null) => void;
  partySize: number;
  setPartySize: (size: number) => void;
  selectedItems: MenuItem[];
  setSelectedItems: (items: MenuItem[]) => void;
}

export const useReservationBookingModel = ({
  initialBooking,
  restaurant,
  restaurantLoaded,
}: UseReservationBookingParams): UseReservationBookingReturn => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    restaurantId: restaurant?.id || "",
    // ... default values
    ...initialBooking,
  });

  const [reservationTime, setReservationTime] = useState<Date | null>(null);
  const [partySize, setPartySize] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

  // Initialize menu items from restaurant
  useEffect(() => {
    if (restaurantLoaded && !selectedItems.length) {
      const defaultItems = restaurant?.defaultMenuItems || [];
      setSelectedItems(defaultItems);
    }
  }, [restaurantLoaded, restaurant?.id]);

  return {
    bookingDetails,
    setBookingDetails,
    reservationTime,
    setReservationTime,
    partySize,
    setPartySize,
    selectedItems,
    setSelectedItems,
  };
};
```

### Step 4: Update Component

```typescript
// Before: 50+ lines of state management
const ReservationCard: FC = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(...)
  // ... lots of related state and effects
}

// After: Clean component
const ReservationCard: FC = () => {
  const {
    bookingDetails,
    setBookingDetails,
    reservationTime,
    setReservationTime,
    partySize,
    setPartySize,
    selectedItems,
    setSelectedItems,
  } = useReservationBookingModel({
    restaurant,
    restaurantLoaded,
  })

  // Component now focuses on UI
}
```

## Naming Conventions

### Hook Names

- Use `use` prefix: `useReservationBookingModel`, `useRestaurantDetailsModel`
- Be specific: `useReservationFilters` not `useFilters`
- Include domain: `useBookingValidation`, `useLocationTracking`

### File Names

- Kebab-case: `use-reservation-booking.ts`
- Place in `src/features/[feature]/hooks/` directory when multiple hooks exist
- Place alongside component for single-use hooks

### Return Type Names

- Suffix with `Return`: `UseReservationBookingReturn`
- Suffix params with `Params`: `UseReservationBookingParams`

## Common Hook Patterns in Green Plate

### 1. Data Fetching Hook (React Query)

```typescript
// Pattern: Use @tanstack/react-query for data fetching
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from '@/lib/axios'

const NAME_SPACE = 'reservations'

// Query keys for cache management
export const reservationQueryKeys = {
  detail: (id: string) => [NAME_SPACE, 'detail', id] as const,
  list: (restaurantId: string) => [NAME_SPACE, 'list', restaurantId] as const,
}

// Main data hook
export const useReservationDetail = (reservationId: string) => {
  return useQuery({
    enabled: !!reservationId,
    queryKey: reservationQueryKeys.detail(reservationId),
    queryFn: () => axios.get(`/reservations/${reservationId}`),
    select: data => data?.data || null,
  })
}

// Invalidation hook for refreshing data
export const useInvalidateReservations = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: [NAME_SPACE] })
}

// Usage in component
const ReservationScreen = () => {
  const { data: reservation, isLoading, error, refetch } = useReservationDetail(reservationId)
  const invalidateReservations = useInvalidateReservations()

  const handleRefresh = () => {
    invalidateReservations() // Invalidates cache and triggers refetch
  }

  return <View>...</View>
}
```

### 2. Form State Hook

```typescript
// Pattern: Form state + validation + submission
export const useBookingForm = (initialValues: BookingFormValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!values.restaurantId) newErrors.restaurantId = "Restaurant is required";
    if (!values.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  const handleChange = useCallback((field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (onSubmit: (values: BookingFormValues) => Promise<void>) => {
      if (!validate()) return;
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate],
  );

  return { values, errors, isSubmitting, handleChange, handleSubmit };
};
```

### 3. Modal State Hook

```typescript
// Pattern: Multiple modal management
type ModalType = "editReservation" | "cancelReservation" | "selectRestaurant" | null;

export const useReservationModals = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = useCallback((type: ModalType, data?: any) => {
    setActiveModal(type);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  return {
    activeModal,
    modalData,
    openModal,
    closeModal,
    isOpen: useCallback((type: ModalType) => activeModal === type, [activeModal]),
  };
};
```

### 4. Toggle/Boolean Hook

```typescript
// Pattern: Boolean state with convenience methods
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse, set: setValue }] as const;
};

// Usage
const [isExpanded, { toggle, setTrue: expand, setFalse: collapse }] = useToggle();
```

## Testing Extracted Hooks

After extraction, test hooks in isolation:

```typescript
// use-reservation-booking.spec.ts
import { renderHook, act } from "@testing-library/react";
import { useReservationBooking } from "./use-reservation-booking";

describe("useReservationBooking", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() =>
      useReservationBooking({
        restaurantLoaded: false,
      }),
    );

    expect(result.current.partySize).toBe(1);
    expect(result.current.selectedItems).toEqual([]);
  });

  it("should update party size", () => {
    const { result } = renderHook(() =>
      useReservationBooking({
        restaurantLoaded: true,
      }),
    );

    act(() => {
      result.current.setPartySize(4);
    });

    expect(result.current.partySize).toBe(4);
  });
});
```

    })

    expect(result.current.modelConfig.model_id).toBe('gpt-4')

})
})

```

```
