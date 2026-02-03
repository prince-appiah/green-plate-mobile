import { CategoryPicker } from "@/components/CategoryPicker/category-picker";
import MapPicker, { AddressData } from "@/components/MapPicker";
import { TimePicker } from "@/components/TimePicker/time-picker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/text";
import { getImageUri } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Controller } from "react-hook-form";
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useCreateListingForm } from "./use-create-listing-form";

export const CreateListingForm = () => {
  const [locationData, setLocationData] = useState<AddressData | null>(null);

  const { form, handlePhotoPress, isPickingImage, handleCreateListing, isPending } = useCreateListingForm();

  const handleLocationSelect = useCallback((addressData: AddressData) => {
    setLocationData(addressData);
  }, []);

  return (
    <ScrollView>
      {/* Photo Section */}
      <View className="mb-6">
        <Typography className="text-sm text-[#1a2e1f] font-medium mb-2">Photo</Typography>
        <TouchableOpacity
          onPress={handlePhotoPress}
          className="bg-[#f9fafb] border-2 border-dashed border-[#e5e7eb] rounded-lg h-48 items-center justify-center relative"
        >
          {isPickingImage ? (
            <ActivityIndicator size="large" color="#16a34a" />
          ) : getImageUri(form.watch("photo")) ? (
            <Image
              source={{ uri: getImageUri(form.watch("photo"))! }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <>
              <Ionicons name="camera-outline" size={48} color="#9ca3af" />
              <Typography className="text-sm text-[#9ca3af] mt-2">Tap to add photo</Typography>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Input control={form.control} name="title" label="Title" placeholder="e.g., Mediterranean Lunch Box" required />

      <Input
        control={form.control}
        name="description"
        label="Description"
        placeholder="Describe what's included in this listing..."
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        className="min-h-25"
      />

      <Controller
        control={form.control}
        name="category"
        render={({ field }) => <CategoryPicker label="Category" required {...field} />}
      />

      <Input
        control={form.control}
        name="quantity"
        keyboardType="number-pad"
        label="Quantity"
        placeholder="e.g., 10"
        required
      />

      <Input
        control={form.control}
        name="maxPerUser"
        keyboardType="number-pad"
        label="Max per user"
        placeholder="This limits how many items a single user can claim"
        required
      />

      <View className="flex-row flex gap-3  ">
        <Input
          control={form.control}
          name="originalPrice"
          keyboardType="number-pad"
          label="Original Price (GHS)"
          placeholder="e.g., 10"
          wrapperClassName="flex-1"
          required
        />
        <Input
          control={form.control}
          name="salePrice"
          keyboardType="number-pad"
          label="Sale Price (GHS)"
          placeholder="e.g., 5"
          wrapperClassName="flex-1"
          required
        />
      </View>

      <View className="flex-row gap-4">
        <Controller
          control={form.control}
          name="pickupStart"
          render={({ field }) => (
            <TimePicker className="flex-1" required placeholder="08:00 AM" label="Time to pick up" {...field} />
          )}
        />
        <Controller
          control={form.control}
          name="pickupEnd"
          render={({ field }) => (
            <TimePicker className="flex-1" required placeholder="05:00 PM" label="Time to pick up" {...field} />
          )}
        />
      </View>

      <View className="mb-4">
        <Typography className="text-sm text-[#1a2e1f] font-medium mb-2">
          Pickup Location <Typography className="text-red-500">*</Typography>
        </Typography>
        {!locationData && (
          <Typography className="text-xs text-red-500 mb-2">Please select a pickup location</Typography>
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

      <Input
        control={form.control}
        name="pickupInstructions"
        label="Pickup Instructions"
        placeholder="Describe any special instructions for pickup..."
        multiline
        required
        numberOfLines={6}
        textAlignVertical="top"
        className="min-h-20"
      />

      <Button onPress={() => handleCreateListing(locationData)} isLoading={isPending}>
        Submit Listing
      </Button>
    </ScrollView>
  );
};
