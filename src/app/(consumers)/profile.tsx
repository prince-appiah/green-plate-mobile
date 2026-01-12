import ImpactCard from "@/components/ImpactCard";
import PointsCard, { UserPoints } from "@/components/PointsCard";
import CustomSafeAreaView from "@/components/ui/SafeAreaView/safe-area-view";
import { mockImpact } from "@/data/mockData";
import { useGetProfile, useGetProfileSuspense } from "@/features/accounts";
import { useGetUserInfo } from "@/features/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  View as RNView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ProfileView = "main" | "achievements" | "history";

export default function ProfileScreen() {
  const [currentView, setCurrentView] = useState<ProfileView>("main");
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const { data: userInfo, isPending: isLoadingUser } = useGetUserInfo();
  const { data: profileResponse, refetch, isPending } = useGetProfile();
  const profile = profileResponse?.data;

  const displayUser = user || userInfo?.data;
  const tabBarHeight = 60 + Math.max(insets.bottom, 8);

  const userPoints = useMemo<UserPoints>(
    () => ({
      totalPoints: profile?.points.totalPoints ?? 0,
      transactionCount: profile?.points.reservationCount ?? 0,
      currentBadge: (profile?.points.currentBadge as UserPoints["currentBadge"]) ?? "none",
    }),
    [profile?.points.totalPoints, profile?.points.reservationCount, profile?.points.currentBadge]
  );

  if (isLoadingUser) {
    return (
      <CustomSafeAreaView useSafeArea>
        <RNView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#16a34a" />
        </RNView>
      </CustomSafeAreaView>
    );
  }

  const allBadges = [
    { badge: "bronze" as const, threshold: 3, label: "Bronze - 3 rescues" },
    { badge: "silver" as const, threshold: 10, label: "Silver - 10 rescues" },
    { badge: "gold" as const, threshold: 25, label: "Gold - 25 rescues" },
  ];

  const badgeEmojis = {
    none: "",
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
  };

  return (
    <CustomSafeAreaView useSafeArea>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} tintColor="#16a34a" />}
      >
        {/* User Info */}
        <View className="flex-row items-center gap-4 mb-5">
          <View className="w-16 h-16 items-center justify-center rounded-full bg-linear-to-br from-[#16a34a] to-[#15803d]">
            {displayUser?.avatarUrl ? (
              <Image source={{ uri: displayUser.avatarUrl }} className="w-16 h-16 rounded-full" resizeMode="cover" />
            ) : (
              <Text className="text-2xl font-bold text-white">
                {displayUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-xl font-bold text-[#1a2e1f]">{displayUser?.name || "User"}</Text>
            <Text className="text-sm text-[#657c69]">{displayUser?.email || ""}</Text>
          </View>
        </View>

        {/* Points Card */}
        <View className="mb-5">
          <PointsCard points={userPoints} />
        </View>

        {/* Impact Card */}
        <View className="mb-5">
          <ImpactCard
            mealsSaved={profile?.impact?.totalMealsSaved || 0}
            co2PreventedKg={profile?.impact?.totalCo2PreventedKg || 0}
          />
        </View>

        {/* All Badges */}
        <View className="mb-5">
          <Text className="font-bold text-[#1a2e1f] mb-3">All Badges</Text>
          <View className="bg-white rounded-2xl p-4 border border-[#e5e7eb] shadow-sm">
            <View className="flex-row items-center justify-around">
              {allBadges.map((item) => {
                const isUnlocked = userPoints.transactionCount >= item.threshold;

                return (
                  <View key={item.badge} className={`flex-col items-center gap-2 ${!isUnlocked && "opacity-40"}`}>
                    <Text className="text-4xl">{badgeEmojis[item.badge]}</Text>
                    <View className="items-center">
                      <Text className="text-xs font-semibold capitalize text-[#1a2e1f]">{item.badge}</Text>
                      <Text className="text-[10px] text-[#657c69]">{item.threshold} rescues</Text>
                    </View>
                    {isUnlocked && <Text className="text-xs text-[#16a34a] font-semibold">✓ Earned</Text>}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Quick Links */}
        {/* <View>
          <Text className="font-bold text-[#1a2e1f] mb-2">Quick Links</Text>
          {[
            {
              icon: "trophy-outline" as const,
              label: "My Achievements",
              count: "3",
              action: () => {},
            },
            {
              icon: "time-outline" as const,
              label: "Transaction History",
              count: String(mockImpact.transactions.length),
              action: () => {},
            },
            {
              icon: "help-circle-outline" as const,
              label: "Help & Support",
              action: () => {},
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.action}
              className="bg-white rounded-2xl p-4 mb-2 border border-[#e5e7eb] shadow-sm flex-row items-center gap-4"
            >
              <View className="w-10 h-10 items-center justify-center rounded-xl bg-[#16a34a]/10">
                <Ionicons name={item.icon} size={20} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-sm text-[#1a2e1f]">{item.label}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                {item.count && <Text className="text-xs font-semibold text-[#657c69]">{item.count}</Text>}
                <Ionicons name="chevron-forward" size={20} color="#657c69" />
              </View>
            </TouchableOpacity>
          ))}
        </View> */}
      </ScrollView>
    </CustomSafeAreaView>
  );
}
