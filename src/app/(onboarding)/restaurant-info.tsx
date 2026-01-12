import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import OpeningHours, { DayHours } from "../../components/OpeningHours";
import MapPicker, { AddressData } from "../../components/MapPicker";
import {
  useCompleteRestaurantOnboarding,
  useGetOnboardingStatus,
} from "@/features/onboarding";

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

const initializeOpeningHours = (): DayHours[] => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days.map((day) => ({
    dayOfWeek: day,
    open: null,
    close: null,
  }));
};

export default function RestaurantInfoScreen() {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const { mutate: completeRestaurantOnboarding, isPending } =
    useCompleteRestaurantOnboarding();
  const { data: onboardingStatus } = useGetOnboardingStatus();

  // RestaurantOnboardingPayload fields
  const [name, setName] = useState(onboardingData.restaurantName || "");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState(onboardingData.phoneNumber || "");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [openingHours, setOpeningHours] = useState<DayHours[]>(
    initializeOpeningHours()
  );
  const [addressData, setAddressData] = useState<AddressData | null>(() => {
    if (onboardingData.restaurantAddress) {
      try {
        return JSON.parse(onboardingData.restaurantAddress) as AddressData;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Cuisine type (not in payload yet)
  const [cuisineType, setCuisineType] = useState(
    onboardingData.cuisineType || ""
  );

  const handleLocationSelect = (data: AddressData) => {
    setAddressData(data);
  };

  const handleNext = () => {
    // Store restaurant data in onboarding context

    completeRestaurantOnboarding({
      name: name.trim(),
      description: description.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      address: addressData
        ? {
            street: addressData.street,
            city: addressData.city,
            country: addressData.country,
            coordinates: addressData.coordinates,
            postalCode: "0",
          }
        : {
            street: "123 Main St",
            city: "New York",
            country: "United States",
            coordinates: [40.7128, -74.006],
            postalCode: "0",
          },
      openingHours: openingHours.map((day) => ({
        dayOfWeek: day.dayOfWeek.toLowerCase(),
        open: day.open === "" || day.open === null ? null : day.open,
        close: day.close === "" || day.close === null ? null : day.close,
      })),
    });

    if (
      onboardingStatus?.data.profileCompleted &&
      onboardingStatus?.data.onboardingCompleted
    ) {
      router.push("/(onboarding)/complete");
    }
  };

  const isValid =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    phone.trim().length > 0 &&
    email.trim().length > 0 &&
    website.trim().length > 0 &&
    openingHours.some((day) => day.open !== null && day.close !== null) &&
    cuisineType.trim().length > 0 &&
    addressData !== null;

  return (
    <SafeAreaView className="flex-1 bg-[#eff2f0]">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-8">
            {/* Header */}
            <View className="mb-8">
              <TouchableOpacity onPress={() => router.back()} className="mb-4">
                <Ionicons name="arrow-back" size={24} color="#1a2e1f" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold text-[#1a2e1f] mb-2">
                Restaurant Information
              </Text>
              <Text className="text-base text-[#657c69]">
                Tell us about your restaurant
              </Text>
            </View>

            {/* Form */}
            <View className="flex-1">
              <View className="mb-6">
                <Text className="text-sm font-semibold text-[#1a2e1f] mb-2">
                  Restaurant Name *
                </Text>
                <View className="bg-white rounded-xl border border-[#e5e7eb] px-4 h-14 flex-row items-center">
                  <Ionicons
                    name="restaurant-outline"
                    size={20}
                    color="#657c69"
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    className="flex-1 text-[#1a2e1f] text-base"
                    placeholder="Enter your restaurant name"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-[#1a2e1f] mb-2">
                  Description *
                </Text>
                <View className="bg-white rounded-xl border border-[#e5e7eb] px-4 py-3 min-h-[100px]">
                  <TextInput
                    className="flex-1 text-[#1a2e1f] text-base"
                    placeholder="Describe your restaurant..."
                    placeholderTextColor="#9ca3af"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-[#1a2e1f] mb-2">
                  Phone Number *
                </Text>
                <View className="bg-white rounded-xl border border-[#e5e7eb] px-4 h-14 flex-row items-center">
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color="#657c69"
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    className="flex-1 text-[#1a2e1f] text-base"
                    placeholder="Enter phone number"
                    placeholderTextColor="#9ca3af"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-[#1a2e1f] mb-2">
                  Email *
                </Text>
                <View className="bg-white rounded-xl border border-[#e5e7eb] px-4 h-14 flex-row items-center">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#657c69"
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    className="flex-1 text-[#1a2e1f] text-base"
                    placeholder="Enter email address"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-[#1a2e1f] mb-2">
                  Website *
                </Text>
                <View className="bg-white rounded-xl border border-[#e5e7eb] px-4 h-14 flex-row items-center">
                  <Ionicons
                    name="globe-outline"
                    size={20}
                    color="#657c69"
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    className="flex-1 text-[#1a2e1f] text-base"
                    placeholder="https://yourwebsite.com"
                    placeholderTextColor="#9ca3af"
                    value={website}
                    onChangeText={setWebsite}
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-[#1a2e1f] mb-2">
                  Restaurant Location *
                </Text>
                <Text className="text-xs text-[#657c69] mb-2">
                  Select your restaurant location on the map
                </Text>
                <MapPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={
                    addressData
                      ? {
                          latitude: addressData.coordinates[1],
                          longitude: addressData.coordinates[0],
                        }
                      : undefined
                  }
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-[#1a2e1f] mb-2">
                  Cuisine Type
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-2"
                >
                  <View className="flex-row flex-wrap">
                    {CUISINE_TYPES.map((cuisine) => (
                      <TouchableOpacity
                        key={cuisine}
                        onPress={() => setCuisineType(cuisine)}
                        className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                          cuisineType === cuisine
                            ? "bg-[#16a34a] border-[#16a34a]"
                            : "bg-white border-[#e5e7eb]"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            cuisineType === cuisine
                              ? "text-white"
                              : "text-[#1a2e1f]"
                          }`}
                        >
                          {cuisine}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-[#1a2e1f] mb-2">
                  Opening Hours *
                </Text>
                <Text className="text-xs text-[#657c69] mb-3">
                  Set your operating hours for each day of the week
                </Text>
                <OpeningHours hours={openingHours} onChange={setOpeningHours} />
              </View>
            </View>

            {/* Next Button */}
            <View className="pb-8">
              <TouchableOpacity
                onPress={handleNext}
                disabled={!isValid || isPending}
                className={`rounded-full h-14 flex-row items-center justify-center ${
                  isValid ? "bg-[#16a34a]" : "bg-[#9ca3af]"
                }`}
              >
                {isPending ? (
                  <ActivityIndicator
                    size="small"
                    color={isValid ? "#ffffff" : "#9ca3af"}
                  />
                ) : (
                  <Text className="text-white font-semibold text-base mr-2">
                    Complete
                  </Text>
                )}
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={isPending ? "#ffffff" : "#ffffff"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
