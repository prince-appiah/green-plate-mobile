import { router } from "expo-router";
import { Alert } from "react-native";

export const promptLoginForProtectedAction = (message?: string) => {
  Alert.alert("Login Required", message ?? "Please log in to continue.", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Log in",
      onPress: () => {
        router.push("/(auth)/login");
      },
    },
  ]);
};
