import MapPicker, { AddressData } from "@/components/MapPicker";
import { Input } from "@/components/ui/Input/input";
import { useGetListingById, useUpdateListing } from "@/features/listings";
import { formatTime24Hour, ListingCategories, useImagePicker } from "@/features/shared";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { CategoryPicker } from "./CategoryPicker/category-picker";
import { TimePicker } from "./TimePicker/time-picker";

// Zod schema for form validation (same as create listing)
const editListingSchema = z.object({
  photo: z.string().optional(),
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

type EditListingFormData = z.infer<typeof editListingSchema>;

interface EditListingBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  listingId: string;
  onSuccess?: () => void;
}

export default function EditListingBottomSheet({
  visible,
  onClose,
  listingId,
  onSuccess,
}: EditListingBottomSheetProps) {
  const { data: listingResponse, isPending: isLoadingListing } = useGetListingById(listingId, visible);
  const listing = listingResponse?.success ? listingResponse.data : null;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<EditListingFormData>({
    resolver: zodResolver(editListingSchema),
    mode: "onChange",
  });

  const [locationData, setLocationData] = useState<AddressData | null>(null);
  const updateListingMutation = useUpdateListing();
  const photo = watch("photo");

  // Use the image picker hook
  const { pickImage, isLoading: isPickingImage } = useImagePicker({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    maxWidth: 800,
    compress: 0.8,
  });

  // Pre-fill form when listing data is loaded
  useEffect(() => {
    if (listing && visible) {
      const startTime = formatTime24Hour(
        typeof listing.pickup.startTime === "string" ? new Date(listing.pickup.startTime) : listing.pickup.startTime,
      );
      const endTime = formatTime24Hour(
        typeof listing.pickup.endTime === "string" ? new Date(listing.pickup.endTime) : listing.pickup.endTime,
      );

      reset({
        photo: listing.photoUrls[0] || "",
        title: listing.title,
        description: listing.description,
        category: listing.category,
        quantity: listing.quantityTotal.toString(),
        maxPerUser: listing.maxPerUser.toString(),
        originalPrice: listing.originalPrice.toString(),
        salePrice: listing.discountedPrice.toString(),
        pickupStart: startTime,
        pickupEnd: endTime,
        pickupInstructions: listing.pickup.instructions,
      });

      // Set location data
      if (listing.pickup.location?.coordinates) {
        setLocationData({
          coordinates: listing.pickup.location.coordinates,
        });
      }
    }
  }, [listing, visible, reset]);

  const handlePhotoPress = async () => {
    const result = await pickImage(true);
    if (result?.base64) {
      setValue("photo", result.base64, { shouldValidate: true });
    }
  };

  const getImageUri = () => {
    if (!photo) return null;
    if (photo.startsWith("data:")) {
      return photo;
    }
    return photo;
  };

  const handleLocationSelect = (addressData: AddressData) => {
    setLocationData(addressData);
  };

  const onSubmit = async (data: EditListingFormData) => {
    if (!locationData) {
      Alert.alert("Error", "Please select a pickup location");
      return;
    }

    const originalPriceNum = Number(data.originalPrice);
    const salePriceNum = Number(data.salePrice);
    if (salePriceNum >= originalPriceNum) {
      Alert.alert("Error", "Sale price must be less than original price");
      return;
    }

    // Format time strings from "HH:mm" to "HH:mm:ss" format
    const formatTimeString = (timeString: string): string => {
      // If already in HH:mm:ss format, return as is
      if (timeString.split(":").length === 3) {
        return timeString;
      }
      // Otherwise, add ":00" for seconds
      return `${timeString}:00`;
    };

    const pickupStartTime = formatTimeString(data.pickupStart);
    const pickupEndTime = formatTimeString(data.pickupEnd);

    const payload = {
      listingId,
      title: data.title,
      description: data.description,
      category: data.category,
      originalPrice: originalPriceNum,
      discountedPrice: salePriceNum,
      currency: listing?.currency || "USD",
      quantityTotal: Number(data.quantity),
      maxPerUser: Number(data.maxPerUser),
      pickup: {
        startTime: pickupStartTime, // Send as time string
        endTime: pickupEndTime, // Send as time string
        location: {
          coordinates: locationData.coordinates,
        },
        instructions: data.pickupInstructions,
      },
      isVisible: listing?.isVisible ?? true,
    };

    try {
      const response = await updateListingMutation.mutateAsync(payload);

      if (response.success && response.data) {
        Alert.alert("Success", "Listing updated successfully!", [
          {
            text: "OK",
            onPress: () => {
              onClose();
              onSuccess?.();
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to update listing. Please try again.");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to update listing. Please try again.");
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-[90%]">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 py-4 border-b border-[#e5e7eb]">
              <Text className="text-xl font-bold text-[#1a2e1f]">Edit Listing</Text>
              <TouchableOpacity onPress={onClose} disabled={updateListingMutation.isPending} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#657c69" />
              </TouchableOpacity>
            </View>

            {isLoadingListing ? (
              <View className="py-12 items-center justify-center">
                <ActivityIndicator size="large" color="#16a34a" />
                <Text className="text-sm text-[#657c69] mt-4">Loading listing...</Text>
              </View>
            ) : !listing ? (
              <View className="py-12 items-center justify-center">
                <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                <Text className="text-sm text-[#657c69] mt-4">Failed to load listing</Text>
              </View>
            ) : (
              <ScrollView
                className="px-4 py-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {/* Photo Section */}
                <View className="mb-6">
                  <Text className="text-sm text-[#1a2e1f] font-medium mb-2">Photo</Text>
                  <TouchableOpacity
                    onPress={handlePhotoPress}
                    disabled={isPickingImage}
                    className="bg-[#f9fafb] border-2 border-dashed border-[#e5e7eb] rounded-lg h-48 items-center justify-center relative"
                  >
                    {isPickingImage ? (
                      <ActivityIndicator size="large" color="#16a34a" />
                    ) : getImageUri() ? (
                      <Image source={{ uri: getImageUri()! }} className="w-full h-full rounded-lg" resizeMode="cover" />
                    ) : (
                      <>
                        <Ionicons name="camera-outline" size={48} color="#9ca3af" />
                        <Text className="text-sm text-[#9ca3af] mt-2">Tap to change photo</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Title */}
                <Input
                  control={control}
                  name="title"
                  label={
                    <Text>
                      Title <Text className="text-red-500">*</Text>
                    </Text>
                  }
                  placeholder="e.g., Mediterranean Lunch Box"
                  className="bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-4 py-3 text-base text-[#1a2e1f]"
                  labelClassName="text-sm text-[#1a2e1f] font-medium"
                />

                {/* Description */}
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="mb-4">
                      <Text className="text-sm font-medium mb-2">
                        Description <Text className="text-red-500">*</Text>
                      </Text>
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Describe what's included..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        className={`bg-[#f9fafb] rounded-lg border px-4 py-3 text-base text-[#1a2e1f] min-h-[100px] ${
                          errors.description ? "border-red-500" : "border-[#e5e7eb]"
                        }`}
                      />
                      {errors.description && (
                        <Text className="mt-1 text-sm text-red-500">{errors.description.message}</Text>
                      )}
                    </View>
                  )}
                />

                {/* Category */}
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="mb-4">
                      <CategoryPicker
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        label={
                          <>
                            Category <Text className="text-red-500">*</Text>
                          </>
                        }
                        error={errors.category?.message}
                      />
                    </View>
                  )}
                />

                {/* Quantity Available */}
                <Input
                  control={control}
                  name="quantity"
                  label={
                    <>
                      Quantity Available <Text className="text-red-500">*</Text>
                    </>
                  }
                  placeholder="1"
                  keyboardType="numeric"
                  className="bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-4 py-3 text-base text-[#1a2e1f]"
                  labelClassName="text-sm text-[#1a2e1f] font-medium"
                />

                {/* Max Per User */}
                <Input
                  control={control}
                  name="maxPerUser"
                  label={
                    <>
                      Max Per User <Text className="text-red-500">*</Text>
                    </>
                  }
                  placeholder="1"
                  keyboardType="numeric"
                  className="bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-4 py-3 text-base text-[#1a2e1f]"
                  labelClassName="text-sm text-[#1a2e1f] font-medium"
                />

                {/* Price Section - Side by Side */}
                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1">
                    <Controller
                      control={control}
                      name="originalPrice"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <Text className="text-sm text-[#1a2e1f] font-medium mb-2">
                            Original Price <Text className="text-red-500">*</Text>
                          </Text>
                          <View
                            className={`flex-row items-center bg-[#f9fafb] rounded-lg border px-4 py-3 ${
                              errors.originalPrice ? "border-red-500" : "border-[#e5e7eb]"
                            }`}
                          >
                            <Text className="text-base text-[#1a2e1f] mr-2">$</Text>
                            <TextInput
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="0.00"
                              placeholderTextColor="#9ca3af"
                              keyboardType="decimal-pad"
                              className="flex-1 text-base text-[#1a2e1f]"
                            />
                          </View>
                          {errors.originalPrice && (
                            <Text className="mt-1 text-sm text-red-500">{errors.originalPrice.message}</Text>
                          )}
                        </View>
                      )}
                    />
                  </View>
                  <View className="flex-1">
                    <Controller
                      control={control}
                      name="salePrice"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                          <Text className="text-sm text-[#1a2e1f] font-medium mb-2">
                            Sale Price <Text className="text-red-500">*</Text>
                          </Text>
                          <View
                            className={`flex-row items-center bg-[#f9fafb] rounded-lg border px-4 py-3 ${
                              errors.salePrice ? "border-red-500" : "border-[#e5e7eb]"
                            }`}
                          >
                            <Text className="text-base text-[#1a2e1f] mr-2">$</Text>
                            <TextInput
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="0.00"
                              placeholderTextColor="#9ca3af"
                              keyboardType="decimal-pad"
                              className="flex-1 text-base text-[#1a2e1f]"
                            />
                          </View>
                          {errors.salePrice && (
                            <Text className="mt-1 text-sm text-red-500">{errors.salePrice.message}</Text>
                          )}
                        </View>
                      )}
                    />
                  </View>
                </View>

                {/* Pickup Time Section - Side by Side */}
                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1">
                    <Controller
                      control={control}
                      name="pickupStart"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TimePicker
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          placeholder="Select time"
                          label={
                            <>
                              Pickup Start <Text className="text-red-500">*</Text>
                            </>
                          }
                          error={errors.pickupStart?.message}
                        />
                      )}
                    />
                  </View>
                  <View className="flex-1">
                    <Controller
                      control={control}
                      name="pickupEnd"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TimePicker
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          placeholder="Select time"
                          label={
                            <>
                              Pickup End <Text className="text-red-500">*</Text>
                            </>
                          }
                          error={errors.pickupEnd?.message}
                        />
                      )}
                    />
                  </View>
                </View>

                {/* Pickup Location */}
                <View className="mb-4">
                  <Text className="text-sm text-[#1a2e1f] font-medium mb-2">
                    Pickup Location <Text className="text-red-500">*</Text>
                  </Text>
                  {!locationData && <Text className="text-xs text-red-500 mb-2">Please select a pickup location</Text>}
                  <MapPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={
                      locationData
                        ? {
                            latitude: locationData.coordinates[1],
                            longitude: locationData.coordinates[0],
                          }
                        : undefined
                    }
                  />
                </View>

                {/* Pickup Instructions */}
                <Controller
                  control={control}
                  name="pickupInstructions"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="mb-4">
                      <Text className="text-sm font-medium mb-2">
                        Pickup Instructions <Text className="text-red-500">*</Text>
                      </Text>
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="e.g., Enter through the side door, ask for John"
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        className={`bg-[#f9fafb] rounded-lg border px-4 py-3 text-base text-[#1a2e1f] min-h-[80px] ${
                          errors.pickupInstructions ? "border-red-500" : "border-[#e5e7eb]"
                        }`}
                      />
                      {errors.pickupInstructions && (
                        <Text className="mt-1 text-sm text-red-500">{errors.pickupInstructions.message}</Text>
                      )}
                    </View>
                  )}
                />
              </ScrollView>
            )}

            {/* Footer with Save Button */}
            {listing && (
              <View className="px-4 py-4 border-t border-[#e5e7eb] bg-white">
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isValid || updateListingMutation.isPending || !locationData || isLoadingListing}
                  className={`bg-[#16a34a] rounded-2xl py-4 items-center justify-center ${
                    isValid && !updateListingMutation.isPending && locationData && !isLoadingListing ? "" : "opacity-50"
                  }`}
                  activeOpacity={0.8}
                >
                  {updateListingMutation.isPending ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text className="text-white text-lg font-bold">Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
