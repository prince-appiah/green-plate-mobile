import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface UserPoints {
  totalPoints: number;
  transactionCount: number;
  currentBadge: 'none' | 'bronze' | 'silver' | 'gold';
}

interface PointsCardProps {
  points: UserPoints;
}

const badgeThresholds = {
  none: { next: 3, nextBadge: 'bronze' as const },
  bronze: { next: 10, nextBadge: 'silver' as const },
  silver: { next: 25, nextBadge: 'gold' as const },
  gold: { next: null, nextBadge: null },
};

const badgeEmojis = {
  none: '',
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
};

export default function PointsCard({ points }: PointsCardProps) {
  const thresholds = badgeThresholds[points.currentBadge];
  const progressPercent = thresholds.next
    ? (points.transactionCount / thresholds.next) * 100
    : 100;

  return (
    <View className="bg-white rounded-2xl p-5 border border-[#e5e7eb] shadow-sm relative overflow-hidden">
      {/* Decorative background */}
      <View className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#16a34a]/5" />
      <View className="absolute -right-5 top-8 h-20 w-20 rounded-full bg-[#16a34a]/5" />

      <View className="relative">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm font-semibold text-[#657c69] mb-1">Your Points</Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-3xl font-bold text-[#1a2e1f]">{points.totalPoints}</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={16} color="#16a34a" />
                <Text className="text-sm font-semibold text-[#16a34a]">pts</Text>
              </View>
            </View>
          </View>
          {points.currentBadge !== 'none' && (
            <View className="items-center">
              <Text className="text-4xl">{badgeEmojis[points.currentBadge]}</Text>
              <Text className="text-xs font-semibold text-[#1a2e1f] capitalize mt-1">
                {points.currentBadge}
              </Text>
            </View>
          )}
        </View>

        {thresholds.next ? (
          <View className="space-y-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-[#657c69]">
                {points.transactionCount}/{thresholds.next} rescues to{' '}
                <Text className="font-semibold text-[#1a2e1f] capitalize">
                  {thresholds.nextBadge}
                </Text>
              </Text>
              <Text className="text-xs font-semibold text-[#16a34a]">
                {Math.round(progressPercent)}%
              </Text>
            </View>
            <View className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
              <View
                className="h-full bg-[#16a34a] rounded-full"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </View>
          </View>
        ) : (
          <Text className="text-sm text-[#657c69]">
            🎉 You've reached the highest badge! Keep saving meals!
          </Text>
        )}
      </View>
    </View>
  );
}

