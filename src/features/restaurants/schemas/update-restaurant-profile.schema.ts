import z from "zod";

export type UpdateRestaurantProfileFormSchema = z.infer<typeof updateRestaurantProfileSchema>;

export const updateRestaurantProfileSchema = z.object({
  name: z.string().min(1, "Restaurant name is required").min(2, "Restaurant name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s+\-()]+$/, "Invalid phone number format"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z.string().optional(),
  //   cuisineType: z.string().min(1, "Cuisine type is required"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
  coordinates: z.tuple([z.number(), z.number()]).optional(), // [longitude, latitude]
});
