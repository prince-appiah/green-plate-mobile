import MapPicker, { AddressData } from "@/components/MapPicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { SkeletonInput, SkeletonMap, SkeletonText } from "@/components/ui/SkeletonLoader";
import { Typography } from "@/components/ui/text";
import { useGetMyRestaurantProfile, useUpdateRestaurantProfile } from "@/features/restaurants";
import {
  UpdateRestaurantProfileFormSchema,
  updateRestaurantProfileSchema,
} from "@/features/restaurants/schemas/update-restaurant-profile.schema";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, RefreshControl, ScrollView, View } from "react-native";

const CUISINE_TYPES = [
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
  "Fast Food",
  "Cafe",
  "Bakery",
  "Pizza",
  "Seafood",
  "Vegetarian",
  "Vegan",
  "Other",
];

export default function RestaurantProfileScreen() {
  const { user } = useAuthStore();
  const { data, isPending, refetch } = useGetMyRestaurantProfile();
  const { mutateAsync: updateProfile, isPending: isSubmitting } = useUpdateRestaurantProfile();
  const [locationData, setLocationData] = useState<AddressData | null>(null);
  console.log("Restaurant:  ", JSON.stringify(data?.data, null, 2));
  const form = useForm<UpdateRestaurantProfileFormSchema>({
    resolver: zodResolver(updateRestaurantProfileSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      description: "",
      //   cuisineType: "",
      address: {
        street: "",
        city: "",
        postalCode: "",
        country: "",
      },
      coordinates: undefined,
    },
  });

  // Populate form with data when it loads
  useEffect(() => {
    if (data?.data) {
      const restaurantData = data.data;
      form.reset({
        name: restaurantData.name || "",
        email: restaurantData?.email || "",
        phone: restaurantData?.phone || "",
        website: restaurantData.website || "",
        description: restaurantData.description || "",
        address: {
          street: restaurantData.address?.street || "",
          city: restaurantData.address?.city || "",
          postalCode: restaurantData.address?.postalCode?.toString() || "",
          country: restaurantData.address?.country || "",
        },
        coordinates: restaurantData.address?.location?.coordinates,
      });

      // Set location data for the map
      if (restaurantData.address?.location?.coordinates) {
        setLocationData({
          coordinates: restaurantData.address.location.coordinates,
          street: restaurantData.address.street,
          city: restaurantData.address.city,
          country: restaurantData.address.country,
          postalCode: restaurantData.address.postalCode,
        });
      }
    }
  }, [data?.data, form]);

  const handleLocationSelect = (addressData: AddressData) => {
    setLocationData(addressData);
    form.setValue("coordinates", addressData.coordinates, { shouldValidate: true });
    form.setValue("address", {
      street: addressData.street || "",
      city: addressData.city || "",
      postalCode: addressData.postalCode?.toString() || "",
      country: addressData.country || "",
    });
  };

  const handleUpdateProfile = form.handleSubmit(async (formData) => {
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        // description: formData.description,
        // address: formData.address,
        //   coordinates: formData.coordinates,
      });

      Alert.alert("Success", "Restaurant profile updated successfully!", [
        {
          text: "OK",
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update restaurant profile. Please try again.",
      );
    }
  });

  if (isPending) {
    return (
      <CustomSafeAreaView useSafeArea>
        <ScrollView className="flex-1">
          <View className="px-4 py-6">
            {/* Header Skeleton */}
            <View className="mb-6">
              <SkeletonText width="60%" height={24} />
            </View>

            {/* Restaurant Info Section */}
            <View className="mb-6">
              <View className="mb-4">
                <SkeletonText width="40%" height={16} />
              </View>
              <SkeletonInput />
              <SkeletonInput />
              <SkeletonInput />
            </View>

            {/* Contact Details Section */}
            <View className="mb-6">
              <View className="mb-4">
                <SkeletonText width="40%" height={16} />
              </View>
              <SkeletonInput />
              <SkeletonInput />
            </View>

            {/* Location Section */}
            <View className="mb-6">
              <View className="mb-4">
                <SkeletonText width="40%" height={16} />
              </View>
              <SkeletonInput />
              <SkeletonInput />
              <SkeletonInput />
              <SkeletonMap height={300} />
            </View>

            {/* Cuisine Type Skeleton */}
            <View className="mb-6">
              <View className="mb-4">
                <SkeletonText width="40%" height={16} />
              </View>
              <View className="flex-row flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <View key={i} className="h-10 w-20 rounded-full bg-gray-200" />
                ))}
              </View>
            </View>

            {/* Button Skeleton */}
            <View className="mt-4">
              <SkeletonInput height={50} label={false} />
            </View>
          </View>
        </ScrollView>
      </CustomSafeAreaView>
    );
  }

  return (
    <CustomSafeAreaView useSafeArea>
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#16a34a" />}>
          <View className="py-6">
            <Typography className="text-2xl font-bold text-[#1a2e1f] mb-6">Restaurant Profile</Typography>

            {/* Restaurant Info Section */}
            <View className="mb-6">
              <Typography className="text-lg font-semibold text-[#1a2e1f] mb-4">Restaurant Information</Typography>

              <Input
                control={form.control}
                name="name"
                label="Restaurant Name"
                placeholder="e.g., Bella Italia"
                required
              />

              <Input
                control={form.control}
                name="website"
                label="Website"
                placeholder="https://yourwebsite.com"
                keyboardType="url"
              />

              <Input
                control={form.control}
                name="description"
                label="Description"
                placeholder="Tell customers about your restaurant..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="min-h-20"
              />
            </View>

            {/* Contact Details Section */}
            <View className="mb-6">
              <Typography className="text-lg font-semibold text-[#1a2e1f] mb-4">Contact Details</Typography>

              <Input
                control={form.control}
                name="email"
                label="Email"
                placeholder="restaurant@example.com"
                readOnly
                disabled
                keyboardType="email-address"
                required
              />

              <Input
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
                required
              />
            </View>

            {/* Location Section */}
            <View className="mb-6">
              <Typography className="text-lg font-semibold text-[#1a2e1f] mb-4">Location</Typography>

              <Input
                control={form.control}
                name="address.street"
                readOnly
                label="Street Address"
                placeholder="123 Main St"
              />

              <View className="flex-row gap-3">
                <Input
                  control={form.control}
                  name="address.city"
                  label="City"
                  placeholder="New York"
                  wrapperClassName="flex-1"
                  readOnly
                />
                <Input
                  control={form.control}
                  name="address.postalCode"
                  label="Postal Code"
                  placeholder="10001"
                  wrapperClassName="flex-1"
                  readOnly
                />
              </View>

              <Input control={form.control} name="address.country" label="Country" placeholder="United States" />

              <View className="mb-4">
                <Typography className="text-sm text-[#1a2e1f] font-medium mb-2">
                  Restaurant Location <Typography className="text-red-500">*</Typography>
                </Typography>
                <Typography className="text-xs text-[#657c69] mb-2">
                  Select your restaurant location on the map or update address fields above
                </Typography>
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
            </View>

            {/* Cuisine Type Section */}
            {/* <View className="mb-6">
            <Typography className="text-lg font-semibold text-[#1a2e1f] mb-4">Cuisine Type</Typography>
            <Controller
              control={form.control}
              name="cuisineType"
              render={({ field }) => (
                <View className="flex-row flex-wrap gap-2">
                  {CUISINE_TYPES.map((cuisine) => (
                    <TouchableOpacity
                      key={cuisine}
                      onPress={() => field.onChange(cuisine)}
                      className={`px-4 py-2 rounded-full border ${
                        field.value === cuisine ? "bg-[#16a34a] border-[#16a34a]" : "bg-white border-[#e5e7eb]"
                      }`}
                    >
                      <Typography
                        className={`text-sm font-medium ${field.value === cuisine ? "text-white" : "text-[#1a2e1f]"}`}
                      >
                        {cuisine}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {form.formState.errors.cuisineType && (
              <Typography className="text-xs text-red-500 mt-2">{form.formState.errors.cuisineType.message}</Typography>
            )}
          </View> */}

            {/* Submit Button */}
            <Button onPress={handleUpdateProfile} isLoading={isSubmitting} className="mt-4 mb-8">
              Update Profile
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomSafeAreaView>
  );
}
