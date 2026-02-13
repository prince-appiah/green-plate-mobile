import { BackButton } from "@/components/back-button";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { CreateListingForm } from "@/features/listings/components/create-listing-form/create-listing-form";
import React from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

export default function CreateListingScreen() {
  return (
    <CustomSafeAreaView useSafeArea>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-row items-center justify-between mb-6">
          <BackButton />
          <Text className="text-xl font-bold text-[#1a2e1f]">Create Listing</Text>
          <View className="w-10" />
        </View>
        <CreateListingForm />
      </KeyboardAvoidingView>
    </CustomSafeAreaView>
  );
}
