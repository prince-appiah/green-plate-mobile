import React from "react";
import { View } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { clsx } from "clsx";
import { withUniwind } from "uniwind";

interface CustomSafeAreaViewProps extends SafeAreaViewProps {
  useSafeArea?: boolean;
  children: React.ReactNode;
}

const StyledSafeArea = withUniwind(SafeAreaView);

const CustomSafeAreaView = ({
  children,
  useSafeArea = false,
  className,
  style,
  ...props
}: CustomSafeAreaViewProps) => {
  const insets = useSafeAreaInsets();

  if (!useSafeArea) {
    return (
      <View className="bg-white flex-1" {...props}>
        {children}
      </View>
    );
  }

  return (
    <StyledSafeArea
      className={clsx("grow bg-white pt-4 px-4", className)}
      style={[
        {
          // paddingTop: insets.top,
          // paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
    >
      {/*<StatusBar translucent />*/}
      {children}
    </StyledSafeArea>
  );
};

export default CustomSafeAreaView;
