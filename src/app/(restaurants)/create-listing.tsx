import MapPicker, { AddressData } from "@/components/MapPicker";
import { CategoryPicker } from "@/components/screens/restaurants/CategoryPicker/category-picker";
import { TimePicker } from "@/components/screens/restaurants/TimePicker/time-picker";
import { Input } from "@/components/ui/Input/input";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { useCreateListing } from "@/features/listings";
import {
  CreateListingFormData,
  createListingSchema,
} from "@/features/listings/create-listing-schema";
import { ListingCategories, useImagePicker } from "@/features/shared";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateListingScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
    mode: "onChange",
    defaultValues: {
      photo: "",
      title: "",
      description: "",
      category: ListingCategories[0],
      quantity: "1",
      maxPerUser: "1",
      originalPrice: "",
      salePrice: "",
      pickupStart: "",
      pickupEnd: "",
      pickupInstructions: "",
    },
  });

  const [locationData, setLocationData] = useState<AddressData | null>(null);
  const createListingMutation = useCreateListing();

  const photo = watch("photo");

  // Use the image picker hook with custom options
  const { pickImage, isLoading: isPickingImage } = useImagePicker({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    maxWidth: 800,
    compress: 0.8,
  });

  const handlePhotoPress = async () => {
    // Pick image and automatically convert to base64
    const result = await pickImage(true); // true = include base64

    if (result?.base64) {
      setValue("photo", result.base64, { shouldValidate: true });
    }
  };

  // Get image URI for display (either from base64 or direct URI)
  const getImageUri = () => {
    if (!photo) return null;
    // If it's already a base64 data URI, use it directly
    if (photo.startsWith("data:")) {
      return photo;
    }
    // Otherwise, it's a regular URI
    return photo;
  };

  const handleLocationSelect = (addressData: AddressData) => {
    setLocationData(addressData);
  };

  const onSubmit = async (data: CreateListingFormData) => {
    // Format time strings from "HH:mm" to "HH:mm:ss" format
    // The form stores times as "HH:mm", we'll add ":00" for seconds
    const formatTimeString = (timeString: string): string => {
      // If already in HH:mm:ss format, return as is
      if (timeString.split(":").length === 2) {
        return timeString;
      }
      // Otherwise, add ":00" for seconds
      return `${timeString}`;
    };

    console.log("data.pickupStart", data.pickupStart);
    console.log("data.pickupEnd", data.pickupEnd);
    // Validate location is selected
    if (!locationData) {
      Alert.alert("Error", "Please select a pickup location");
      return;
    }

    // Validate sale price is less than original price
    const originalPriceNum = Number(data.originalPrice);
    const salePriceNum = Number(data.salePrice);
    if (salePriceNum >= originalPriceNum) {
      Alert.alert("Error", "Sale price must be less than original price");
      return;
    }

    const pickupStartTime = formatTimeString(data.pickupStart);
    const pickupEndTime = formatTimeString(data.pickupEnd);

    // Prepare photo URLs array
    const photoUrls = data.photo ? [data.photo] : [];

    // Transform form data to API payload
    const payload = {
      title: data.title,
      description: data.description,
      category: data.category,
      photoUrls,
      originalPrice: originalPriceNum,
      discountedPrice: salePriceNum,
      currency: "USD", // Default currency
      quantityTotal: Number(data.quantity),
      maxPerUser: Number(data.maxPerUser),
      pickup: {
        startTime: pickupStartTime, // Send as time string "HH:mm:ss"
        endTime: pickupEndTime, // Send as time string "HH:mm:ss"
        location: {
          coordinates: locationData.coordinates,
        },
        instructions: data.pickupInstructions,
      },
      isVisible: true, // Default to visible
    };

    try {
      const response = await createListingMutation.mutateAsync(payload);

      if (response.success && response.data) {
        Alert.alert("Success", "Listing created successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.message || "Failed to create listing. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      // Alert.alert("Error", error instanceof Error ? error.message : "Failed to create listing. Please try again.");
    }
  };

  return (
    <CustomSafeAreaView useSafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1a2e1f" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#1a2e1f]">
            Create Listing
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Photo Section */}
          <View className="mb-6">
            <Text className="text-sm text-[#1a2e1f] font-medium mb-2">
              Photo
            </Text>
            <TouchableOpacity
              onPress={handlePhotoPress}
              className="bg-[#f9fafb] border-2 border-dashed border-[#e5e7eb] rounded-lg h-48 items-center justify-center relative"
            >
              {isPickingImage ? (
                <ActivityIndicator size="large" color="#16a34a" />
              ) : getImageUri() ? (
                <Image
                  source={{ uri: getImageUri()! }}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={48} color="#9ca3af" />
                  <Text className="text-sm text-[#9ca3af] mt-2">
                    Tap to add photo
                  </Text>
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
                <Text className="text-sm  font-medium mb-2">
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
                  <Text className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </Text>
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
                        errors.originalPrice
                          ? "border-red-500"
                          : "border-[#e5e7eb]"
                      }`}
                    >
                      <Text className="text-base text-[#1a2e1f] mr-2">GHS</Text>
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
                      <Text className="mt-1 text-sm text-red-500">
                        {errors.originalPrice.message}
                      </Text>
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
                      <Text className="text-base text-[#1a2e1f] mr-2">GHS</Text>
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
                      <Text className="mt-1 text-sm text-red-500">
                        {errors.salePrice.message}
                      </Text>
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
            {!locationData && (
              <Text className="text-xs text-red-500 mb-2">
                Please select a pickup location
              </Text>
            )}
            <MapPicker
              onLocationSelect={handleLocationSelect}
              inline
              height={300}
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
                    errors.pickupInstructions
                      ? "border-red-500"
                      : "border-[#e5e7eb]"
                  }`}
                />
                {errors.pickupInstructions && (
                  <Text className="mt-1 text-sm text-red-500">
                    {errors.pickupInstructions.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={
              !isValid || createListingMutation.isPending || !locationData
            }
            className={`rounded-2xl p-4 items-center justify-center ${
              isValid && !createListingMutation.isPending && locationData
                ? "bg-[#16a34a]"
                : "bg-[#9ca3af]"
            }`}
          >
            {createListingMutation.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Create Listing
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomSafeAreaView>
  );
}
