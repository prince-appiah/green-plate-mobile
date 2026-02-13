import { AddressData } from "@/components/MapPicker";
import { ListingCategories, useImagePicker } from "@/features/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { useCreateListing } from "../../hooks";
import { CreateListingFormSchema, createListingSchema } from "../../schemas/create-listing-schema";

export const useCreateListingForm = () => {
  const { mutateAsync, isPending } = useCreateListing();
  const { pickImage, isLoading: isPickingImage } = useImagePicker({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    maxWidth: 800,
    compress: 0.8,
  });
  const form = useForm<CreateListingFormSchema>({
    resolver: zodResolver(createListingSchema),
    mode: "onBlur",
    defaultValues: {
      photo: "",
      title: "",
      description: "",
      category: ListingCategories[0],
      quantity: "",
      maxPerUser: "",
      originalPrice: "",
      salePrice: "",
      pickupStart: "",
      pickupEnd: "",
      pickupInstructions: "",
    },
  });

  const handlePhotoPress = async () => {
    const result = await pickImage(true); // true = include base64

    if (result?.base64) {
      form.setValue("photo", result.base64, { shouldValidate: true });
    }
  };

  const handleCreateListing = useCallback(
    async (locationData: AddressData | null) => {
      const submit = form.handleSubmit(async (data) => {
        // Validate additional constraints not covered by zod
        const originalPriceNum = Number(data.originalPrice);
        const salePriceNum = Number(data.salePrice);

        if (salePriceNum >= originalPriceNum) {
          Alert.alert("Error", "Sale price must be less than original price");
          return;
        }

        if (!locationData) {
          Alert.alert("Error", "Please select a pickup location");
          return;
        }

        const payload = {
          title: data.title,
          description: data.description,
          category: data.category,
          photoUrls: data.photo ? [data.photo] : [],
          originalPrice: originalPriceNum,
          discountedPrice: salePriceNum,
          currency: "GHS",
          quantityTotal: Number(data.quantity),
          maxPerUser: Number(data.maxPerUser),
          pickup: {
            startTime: data.pickupStart,
            endTime: data.pickupEnd,
            location: {
              coordinates: locationData.coordinates,
            },
            instructions: data.pickupInstructions,
          },
          isVisible: true,
        };

        const res = await mutateAsync(payload);
        Alert.alert("Success", "Listing created successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      });

      await submit();
    },
    [form, mutateAsync],
  );

  return { handleCreateListing, form, isPending, handlePhotoPress, isPickingImage };
};
