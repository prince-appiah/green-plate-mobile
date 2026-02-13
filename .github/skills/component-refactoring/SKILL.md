---
name: component-refactoring
description: Refactor high-complexity React components in Dify frontend. Use when `pnpm analyze-component --json` shows complexity > 50 or lineCount > 300, when the user asks for code splitting, hook extraction, or complexity reduction, or when `pnpm analyze-component` warns to refactor before testing; avoid for simple/well-structured components, third-party wrappers, or when the user explicitly wants testing without refactoring.
---

# Green Plate Mobile Component Refactoring Skill

Refactor high-complexity React Native components in the Green Plate mobile app codebase with the patterns and workflow below.

> **Complexity Threshold**: Components with complexity > 50 (measured by `pnpm analyze-component`) should be refactored before testing.

## Quick Reference

### Commands (run from project root)

Use paths relative to `src/` (e.g., `components/...`, `features/auth/hooks/...`).
For component analysis, use standard linting and type-checking tools available in the project.

```bash
# Check for TypeScript errors
pnpm tsc

# Run linting
pnpm lint

# Run tests (if applicable)
pnpm test
```

### Complexity Analysis

Use these heuristics to assess component complexity:

```bash
# Key metrics to check manually:
# - useState calls: target ≤ 5 (group related state)
# - useEffect calls: target ≤ 3 (consolidate effects)
# - Function nesting depth: target ≤ 3 levels
# - Component line count: target < 300 lines
# - Conditional branches: target ≤ 3 (use early returns)
```

### Complexity Level Interpretation

| Indicator                                           | Level           | Action                      |
| --------------------------------------------------- | --------------- | --------------------------- |
| <200 lines, <5 useState, <3 effects                 | 🟢 Simple       | Ready for development       |
| 200-300 lines, 5-7 useState, 3-4 effects            | 🟡 Medium       | Consider minor refactoring  |
| 300+ lines, 7+ useState, 4+ effects                 | 🟠 Complex      | **Refactor before testing** |
| Deep nesting, complex conditionals, multiple modals | 🔴 Very Complex | **Must refactor**           |

## Core Refactoring Patterns

### Pattern 1: Extract Custom Hooks

**When**: Component has complex state management, multiple `useState`/`useEffect`, or business logic mixed with UI.

**Dify Convention**: Place hooks in a `hooks/` subdirectory or alongside the component as `use-<feature>.ts`.

```typescript
// ❌ Before: Complex state logic in component
const ReservationCard: FC = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(...)
  const [reservationTime, setReservationTime] = useState<Date | null>(null)
  const [partySize, setPartySize] = useState<number>(1)
  const [isConfirming, setIsConfirming] = useState(false)

  // 50+ lines of state management logic...

  return <View>...</View>
}

// ✅ After: Extract to custom hook
// features/reservations/hooks/use-reservation-booking.ts
export const useReservationBooking = (restaurantId: string) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(...)
  const [reservationTime, setReservationTime] = useState<Date | null>(null)
  const [partySize, setPartySize] = useState<number>(1)
  const [isConfirming, setIsConfirming] = useState(false)

  // Related state management logic here

  return { bookingDetails, setBookingDetails, reservationTime, setReservationTime, partySize, setPartySize, isConfirming, setIsConfirming }
}

// Component becomes cleaner
const ReservationCard: FC = () => {
  const { bookingDetails, setBookingDetails, reservationTime } = useReservationBooking(restaurantId)
  return <View>...</View>
}
```

**Green Plate Examples**:

- `src/features/auth/hooks/use-auth.tsx`
- `src/features/shared/hooks/use-location.ts`
- `src/features/reservations/hooks/` (custom hooks directory)

### Pattern 2: Extract Sub-Components

**When**: Single component has multiple UI sections, conditional rendering blocks, or repeated patterns.

**Dify Convention**: Place sub-components in subdirectories or as separate files in the same directory.

```typescript
// ❌ Before: Monolithic JSX with multiple sections
const AppInfo = () => {
  return (
    <div>
      {/* 100 lines of header UI */}
      {/* 100 lines of operations UI */}
      {/* 100 lines of modals */}
    </div>
  )
}

// ✅ After: Split into focused components
// app-info/
//   ├── index.tsx           (orchestration only)
//   ├── app-header.tsx      (header UI)
//   ├── app-operations.tsx  (operations UI)
//   └── app-modals.tsx      (modal management)

const AppInfo = () => {
  const { showModal, setShowModal } = useAppInfoModals()

  return (
    <div>
      <AppHeader appDetail={appDetail} />
      <AppOperations onAction={handleAction} />
      <AppModals show={showModal} onClose={() => setShowModal(null)} />
    </div>
  )
}
```

**Dify Examples**:

- `web/app/components/app/configuration/` directory structure
- `web/app/components/workflow/nodes/` per-node organization

### Pattern 3: Simplify Conditional Logic

**When**: Deep nesting (> 3 levels), complex ternaries, or multiple `if/else` chains.

```typescript
// ❌ Before: Deeply nested conditionals
const Template = useMemo(() => {
  if (appDetail?.mode === AppModeEnum.CHAT) {
    switch (locale) {
      case LanguagesSupported[1]:
        return <TemplateChatZh />
      case LanguagesSupported[7]:
        return <TemplateChatJa />
      default:
        return <TemplateChatEn />
    }
  }
  if (appDetail?.mode === AppModeEnum.ADVANCED_CHAT) {
    // Another 15 lines...
  }
  // More conditions...
}, [appDetail, locale])

// ✅ After: Use lookup tables + early returns
const TEMPLATE_MAP = {
  [AppModeEnum.CHAT]: {
    [LanguagesSupported[1]]: TemplateChatZh,
    [LanguagesSupported[7]]: TemplateChatJa,
    default: TemplateChatEn,
  },
  [AppModeEnum.ADVANCED_CHAT]: {
    [LanguagesSupported[1]]: TemplateAdvancedChatZh,
    // ...
  },
}

const Template = useMemo(() => {
  const modeTemplates = TEMPLATE_MAP[appDetail?.mode]
  if (!modeTemplates) return null

  const TemplateComponent = modeTemplates[locale] || modeTemplates.default
  return <TemplateComponent appDetail={appDetail} />
}, [appDetail, locale])
```

### Pattern 4: Extract API/Data Logic

**When**: Component directly handles API calls, data transformation, or complex async operations.

**Dify Convention**: Use `@tanstack/react-query` hooks from `web/service/use-*.ts` or create custom data hooks.

```typescript
// ❌ Before: API logic in component
const MCPServiceCard = () => {
  const [basicAppConfig, setBasicAppConfig] = useState({});

  useEffect(() => {
    if (isBasicApp && appId) {
      (async () => {
        const res = await fetchAppDetail({ url: "/apps", id: appId });
        setBasicAppConfig(res?.model_config || {});
      })();
    }
  }, [appId, isBasicApp]);

  // More API-related logic...
};

// ✅ After: Extract to data hook using React Query
// use-app-config.ts
import { useQuery } from "@tanstack/react-query";
import { get } from "@/service/base";

const NAME_SPACE = "appConfig";

export const useAppConfig = (appId: string, isBasicApp: boolean) => {
  return useQuery({
    enabled: isBasicApp && !!appId,
    queryKey: [NAME_SPACE, "detail", appId],
    queryFn: () => get<AppDetailResponse>(`/apps/${appId}`),
    select: (data) => data?.model_config || {},
  });
};

// Component becomes cleaner
const MCPServiceCard = () => {
  const { data: config, isLoading } = useAppConfig(appId, isBasicApp);
  // UI only
};
```

**React Query Best Practices in Dify**:

- Define `NAME_SPACE` for query key organization
- Use `enabled` option for conditional fetching
- Use `select` for data transformation
- Export invalidation hooks: `useInvalidXxx`

**Dify Examples**:

- `web/service/use-workflow.ts`
- `web/service/use-common.ts`
- `web/service/knowledge/use-dataset.ts`
- `web/service/knowledge/use-document.ts`

### Pattern 5: Extract Modal/Dialog Management

**When**: Component manages multiple modals with complex open/close states.

**Dify Convention**: Modals should be extracted with their state management.

```typescript
// ❌ Before: Multiple modal states in component
const AppInfo = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showImportDSLModal, setShowImportDSLModal] = useState(false);
  // 5+ more modal states...
};

// ✅ After: Extract to modal management hook
type ModalType = "edit" | "duplicate" | "delete" | "switch" | "import" | null;

const useAppInfoModals = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = useCallback((type: ModalType) => setActiveModal(type), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  return {
    activeModal,
    openModal,
    closeModal,
    isOpen: (type: ModalType) => activeModal === type,
  };
};
```

### Pattern 6: Extract Form Logic

**When**: Complex form validation, submission handling, or field transformation.

**Dify Convention**: Use `@tanstack/react-form` patterns from `web/app/components/base/form/`.

```typescript
// ✅ Use existing form infrastructure
import { useAppForm } from '@/app/components/base/form'

const ConfigForm = () => {
  const form = useAppForm({
    defaultValues: { name: '', description: '' },
    onSubmit: handleSubmit,
  })

  return <form.Provider>...</form.Provider>
}
```

## Green Plate-Specific Refactoring Guidelines

### 0. Expo Router: Component Colocation & Route Patterns ⚠️

**CRITICAL**: The `app` directory is exclusively for defining routes. Non-route files in the `app` directory will be treated as routes by Expo Router, causing errors or unexpected behavior.

#### Correct Directory Structure

**Green Plate Pattern: Top-level directories (Recommended)**

```
src/
├── app/                    # Route definitions ONLY
│   ├── (consumers)/
│   │   ├── bookings.tsx    # Route
│   │   ├── bookings/
│   │   │   └── [id].tsx    # Route
│   │   └── listing/
│   │       └── [id].tsx    # Route
│   └── (restaurants)/
│       └── listings/
│           └── [id].tsx    # Route
├── components/             # UI components (organized by scope)
│   ├── screens/            # Screen-specific: Extracted from routes
│   │   ├── consumers/
│   │   │   ├── bookings/   # Extracted from bookings/[id]
│   │   │   │   ├── reservation-header.tsx
│   │   │   │   ├── reservation-info-card.tsx
│   │   │   │   ├── pickup-dates-card.tsx
│   │   │   │   ├── pickup-qr-code.tsx
│   │   │   │   ├── listing-details-card.tsx
│   │   │   │   └── reservation-actions.tsx
│   │   │   └── listings/   # Extracted from listing/[id]
│   │   │       └── ...
│   │   └── restaurants/
│   │       └── ...
│   ├── reservation-bottom-sheet/  # Feature modal (reusable)
│   │   ├── listing-info-section.tsx
│   │   ├── quantity-selector.tsx
│   │   ├── price-summary.tsx
│   │   └── pickup-info-section.tsx
│   ├── ReservationCard.tsx # Shared/reusable components
│   └── ui/                 # UI primitives
├── features/               # Feature modules (hooks, logic)
│   ├── reservations/
│   │   ├── hooks/          # Business logic
│   │   │   ├── use-reservation-details.ts
│   │   │   ├── use-reservation-form.ts
│   │   │   └── use-bookings-list.ts
│   │   ├── services/
│   │   └── components/     # Feature-specific components
│   └── listings/
└── lib/                    # Utilities, helpers
```

#### Rules for Route vs Non-Route Files

| Placement         | File Type           | Allowed? | Reason                          |
| ----------------- | ------------------- | -------- | ------------------------------- |
| `src/app/`        | Route (page/layout) | ✅ YES   | Define navigation structure     |
| `src/app/`        | Component           | ❌ NO    | Expo Router treats as route     |
| `src/app/`        | Hook/utility        | ❌ NO    | Expo Router treats as route     |
| `src/components/` | Component           | ✅ YES   | Not traversed by Expo Router    |
| `src/features/`   | Hook/service        | ✅ YES   | Feature-specific business logic |

#### ✅ Best Practice: Screen-Specific vs Feature Components

**Screen-Specific Components**: Extracted from a route screen, organized by screen name

```
✅ CORRECT:
src/
├── app/(consumers)/bookings/[id].tsx       # Route
└── components/screens/consumers/bookings/  # Screen-specific sub-components
    ├── reservation-header.tsx
    ├── reservation-info-card.tsx
    ├── pickup-dates-card.tsx
    └── ...

❌ WRONG (will cause routing errors):
src/app/(consumers)/bookings/
├── [id].tsx                      # Route
├── reservation-header.tsx        # ❌ Expo Router treats as route!
├── reservation-info-card.tsx     # ❌ Error!
└── pickup-qr-code.tsx            # ❌ Error!
```

**Feature Components**: Reusable modals, shared components, feature-specific UI

```
✅ CORRECT:
src/components/reservation-bottom-sheet/
├── listing-info-section.tsx
├── quantity-selector.tsx
├── price-summary.tsx
└── pickup-info-section.tsx
```

#### Implementation Checklist

- ✅ All route files (pages/layouts) go in `src/app/[route]/`
- ✅ All non-route components go in `src/components/`
- ✅ Use **screen-specific subdirectories** in `src/components/screens/` for router-related components that have been extracted
- ✅ Group modal/feature components in feature-specific subdirectories (e.g., `src/components/reservation-bottom-sheet/`)
- ✅ All hooks/business logic go in `src/features/[feature]/hooks/`
- ✅ Never create component files directly under `src/app/[route]/` - use `src/components/screens/[route-type]/[screen-name]/` instead

#### Real Example: Bookings Refactoring

**Before**: Mixed concerns in route directory

```
src/app/(consumers)/bookings/[id].tsx      # 325 lines - route + UI + logic
```

**After**: Separated by concern

```
src/app/(consumers)/bookings/[id].tsx               # Route + orchestration
src/components/screens/consumers/bookings/
├── reservation-header.tsx
├── reservation-info-card.tsx
├── pickup-dates-card.tsx
├── pickup-qr-code.tsx
├── listing-details-card.tsx
└── reservation-actions.tsx
src/features/reservations/hooks/
├── use-reservation-details.ts             # Data & business logic
└── use-bookings-list.ts                   # List logic
```

### 1. Context Provider Extraction

**When**: Component provides complex context values with multiple states.

```typescript
// ❌ Before: Large context value object
const value = {
  user, isAuthenticated, userRole, userPoints, reservationHistory,
  favoriteRestaurants, bookmarks, preferences, settings,
  // 50+ more properties...
}
return <AuthContext.Provider value={value}>...</AuthContext.Provider>

// ✅ After: Split into domain-specific contexts
<AuthProvider value={authValue}>
  <UserPreferencesProvider value={preferencesValue}>
    <ReservationProvider value={reservationValue}>
      {children}
    </ReservationProvider>
  </UserPreferencesProvider>
</AuthProvider>
```

**Green Plate Reference**: `src/contexts/` directory structure

### 2. Screen/Feature Components

**When**: Refactoring feature screens (`src/app/(consumers)/`, `src/app/(restaurants)/`).

**Conventions**:

- Keep navigation logic in `useRoleNavigation()` hook
- Extract section components to separate files
- Use feature-based hooks from `src/features/[feature]/hooks/`

```
feature-name/
  ├── index.tsx              # Main screen/page
  ├── feature-header.tsx     # Header section
  ├── feature-content.tsx    # Main content
  ├── feature-modals.tsx     # Modal management
  └── use-feature-logic.ts   # Feature-specific hook
```

### 3. Modal/Bottom Sheet Components

**When**: Refactoring modal or bottom sheet components.

**Conventions**:

- Keep modals in `src/components/` for reusable modals
- Feature-specific modals in `src/features/[feature]/components/`
- Use feature hooks from `src/features/[feature]/hooks/`
- Examples: `ReservationBottomSheet.tsx`, `EditListingBottomSheet.tsx`, `QRScannerModal.tsx`

### 4. Booking/Reservation Logic Components

**When**: Refactoring reservation or booking related components.

**Conventions**:

- Follow patterns from `src/features/reservations/`
- Use service hooks from `src/features/reservations/services/`
- Keep booking state in custom hooks
- Extract modals for confirmation, time selection, etc.

## Refactoring Workflow

### Step 1: Generate Refactoring Prompt

```bash
pnpm refactor-component <path>
```

This command will:

- Analyze component complexity and features
- Identify specific refactoring actions needed
- Generate a prompt for AI assistant (auto-copied to clipboard on macOS)
- Provide detailed requirements based on detected patterns

### Step 2: Analyze Details

```bash
pnpm analyze-component <path> --json
```

Identify:

- Total complexity score
- Max function complexity
- Line count
- Features detected (state, effects, API, etc.)

### Step 3: Plan

Create a refactoring plan based on detected features:

| Detected Feature                      | Refactoring Action         |
| ------------------------------------- | -------------------------- |
| `hasState: true` + `hasEffects: true` | Extract custom hook        |
| `hasAPI: true`                        | Extract data/service hook  |
| `hasEvents: true` (many)              | Extract event handlers     |
| `lineCount > 300`                     | Split into sub-components  |
| `maxComplexity > 50`                  | Simplify conditional logic |

### Step 4: Execute Incrementally

1. **Extract one piece at a time**
2. **Run type-check and lint after each extraction**
3. **Verify functionality before next step**

```
For each extraction:
  ┌────────────────────────────────────────┐
  │ 1. Extract code                        │
  │ 2. Run: pnpm tsc                       │
  │ 3. Run: pnpm lint                      │
  │ 4. Test functionality manually         │
  │ 5. PASS? → Next extraction             │
  │    FAIL? → Fix before continuing       │
  └────────────────────────────────────────┘
```

### Step 5: Verify

After refactoring, verify improvements:

```bash
# Type-check the refactored code
pnpm tsc

# Run linting
pnpm lint

# Target metrics:
# - Lines of code < 300
# - useState calls ≤ 5
# - useEffect calls ≤ 3
# - Conditional nesting ≤ 3 levels
# - No TypeScript errors
```

## Common Mistakes to Avoid

### ❌ Over-Engineering

```typescript
// ❌ Too many tiny hooks
const useButtonText = () => useState("Click");
const useButtonDisabled = () => useState(false);
const useButtonLoading = () => useState(false);

// ✅ Cohesive hook with related state
const useButtonState = () => {
  const [text, setText] = useState("Click");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  return { text, setText, disabled, setDisabled, loading, setLoading };
};
```

### ❌ Breaking Existing Patterns

- Follow existing directory structures
- Maintain naming conventions
- Preserve export patterns for compatibility

### ❌ Premature Abstraction

- Only extract when there's clear complexity benefit
- Don't create abstractions for single-use code
- Keep refactored code in the same domain area

## References

### Green Plate Codebase Examples

- **Hook extraction**: `src/features/auth/hooks/`, `src/features/shared/hooks/`
- **Component splitting**: `src/components/screens/`, `src/features/[feature]/components/`
- **Service hooks**: `src/features/[feature]/services/`
- **Feature patterns**: `src/features/reservations/`, `src/features/restaurants/`
- **Form patterns**: React Hook Form + Zod (no dedicated form folder)
- **Context management**: `src/contexts/AuthContext.tsx`, `src/contexts/OnboardingContext.tsx`

### Key Folders

- **Components**: `src/components/` (reusable UI components)
- **Features**: `src/features/` (domain-specific logic)
- **Contexts**: `src/contexts/` (global state with Context API)
- **Screens**: `src/app/` (Expo Router screens)
