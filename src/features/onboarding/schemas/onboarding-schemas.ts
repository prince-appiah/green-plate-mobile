import { z } from "zod";

// Personal Info Schema
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s\-\+\(\)]+$/, "Please enter a valid phone number"),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Location Schema
export const locationSchema = z.object({
  address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z
    .string()
    .min(1, "Zip code is required")
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid zip code"),
});

export type LocationFormData = z.infer<typeof locationSchema>;

// Dietary preferences options
export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Halal",
  "Kosher",
  "None",
] as const;

// Cuisine options
export const CUISINE_OPTIONS = [
  "Italian",
  "Mexican",
  "Chinese",
  "Indian",
  "Japanese",
  "Thai",
  "American",
  "Mediterranean",
  "French",
  "Korean",
] as const;

// Budget range options
export const BUDGET_RANGE_OPTIONS = ["low", "medium", "high"] as const;

// Preferences Schema
export const preferencesSchema = z.object({
  dietaryPreferences: z
    .array(z.string())
    .min(1, "Please select at least one dietary preference or 'None'")
    .refine(
      (arr) => {
        // If "None" is selected, it should be the only option
        if (arr.includes("None")) {
          return arr.length === 1;
        }
        // Otherwise, at least one preference must be selected
        return arr.length > 0;
      },
      {
        message:
          "If 'None' is selected, it must be the only option. Otherwise, select at least one preference.",
      }
    ),
  favoriteCuisines: z.array(z.string()).optional(),
  budgetRange: z.enum(BUDGET_RANGE_OPTIONS, {
    required_error: "Budget range is required",
    invalid_type_error: "Please select a valid budget range",
  }),
  radiusKm: z
    .number()
    .min(1, "Radius must be at least 1 km")
    .max(100, "Radius cannot exceed 100 km")
    .default(10),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;

