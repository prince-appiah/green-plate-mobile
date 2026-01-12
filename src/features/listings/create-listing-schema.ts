import z from "zod";
import { ListingCategories } from "../shared";

export const createListingSchema = z.object({
  photo: z.string().min(1, "Photo is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(ListingCategories),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "Quantity must be at least 1",
    }),
  maxPerUser: z
    .string()
    .min(1, "Max per user is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "Max per user must be at least 1",
    }),
  originalPrice: z
    .string()
    .min(1, "Original price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Original price must be greater than 0",
    }),
  salePrice: z
    .string()
    .min(1, "Sale price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Sale price must be greater than 0",
    }),
  pickupStart: z.string().min(1, "Pickup start time is required"),
  pickupEnd: z.string().min(1, "Pickup end time is required"),
  pickupInstructions: z.string().min(1, "Pickup instructions are required"),
});

export type CreateListingFormData = z.infer<typeof createListingSchema>;
