import { useGoogleSignin } from "@/features/auth/hooks/use-google-signin";
import React from "react";
import { ImageBackground, StatusBar, Text, View } from "react-native";

// @ts-ignore
import loginBg from "@/assets/images/login-bg.png";

import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

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

        {/* Google Login Button */}
        <GoogleSigninButton
          onPress={handleGoogleAuthInit}
          size={GoogleSigninButton.Size.Wide}
          disabled={isPending}
          color={GoogleSigninButton.Color.Light}
          style={{
            backgroundColor: "#5c5c99",
            borderRadius: 16,
            height: 56,
          }}
        />
      </View>
    </ImageBackground>
  );
}
