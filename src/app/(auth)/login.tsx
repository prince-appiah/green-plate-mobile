import { useGoogleSignin } from "@/features/auth/hooks/use-google-signin";
import React from "react";
import {
  ImageBackground,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// @ts-ignore
import loginBg from "@/assets/images/login-bg.png";

export default function LoginScreen() {
  const { isPending, handleGoogleAuthInit } = useGoogleSignin();

  return (
    <ImageBackground source={loginBg} className="grow justify-end">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Bottom Sheet Container */}
      <View className="bg-white rounded-t-3xl px-8 pt-10 pb-12 w-full items-center shadow-xl min-h-[40%]">
        {/* Header Text */}
        <Text className="text-2xl font-bold text-[#1a2e1f] mb-2 text-center">
          Let&apos;s help you reduce food waste
        </Text>
        <Text className="text-base text-[#657c69] text-center mb-10 px-4">
          By tracking your food waste and meal planning, you can make a positive impact on the environment and save
          money.
        </Text>

        {/* Google Login Button - React Native Google Sign-In */}
        <TouchableOpacity
          onPress={handleGoogleAuthInit}
          disabled={isPending}
          className="bg-[#5c5c99] rounded-2xl h-14 w-full items-center justify-center"
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">Sign in with Google</Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
