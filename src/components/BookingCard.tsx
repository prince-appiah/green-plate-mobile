import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '@/data/mockData';

interface BookingCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: 'hourglass-outline' as const,
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  confirmed: {
    label: 'Confirmed',
    icon: 'checkmark-circle-outline' as const,
    color: '#16a34a',
    bgColor: '#dcfce7',
  },
  completed: {
    label: 'Completed',
    icon: 'checkmark-done-circle' as const,
    color: '#16a34a',
    bgColor: '#dcfce7',
  },
  expired: {
    label: 'Expired',
    icon: 'time-outline' as const,
    color: '#657c69',
    bgColor: '#e5e7eb',
  },
  cancelled: {
    label: 'Cancelled',
    icon: 'close-circle-outline' as const,
    color: '#ef4444',
    bgColor: '#fee2e2',
  },
};

export default function BookingCard({ transaction, onPress }: BookingCardProps) {
  const config = statusConfig[transaction.status];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const placeholderImage = 'https://via.placeholder.com/80x80/e5e7eb/9ca3af?text=Food';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 border border-[#e5e7eb] shadow-sm"
    >
      <View className="flex-row gap-4">
        <Image
          source={{ uri: transaction.listing.photoUrl || placeholderImage }}
          className="w-20 h-20 rounded-xl"
          resizeMode="cover"
        />

        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <Text className="font-bold text-sm text-[#1a2e1f] flex-1" numberOfLines={1}>
              {transaction.listing.title}
            </Text>
            <View
              className="px-2 py-1 rounded-lg flex-row items-center gap-1"
              style={{ backgroundColor: config.bgColor }}
            >
              <Ionicons name={config.icon} size={12} color={config.color} />
              <Text className="text-xs font-semibold" style={{ color: config.color }}>
                {config.label}
              </Text>
            </View>
          </View>

          <Text className="text-xs text-[#657c69] mb-2" numberOfLines={1}>
            {transaction.listing.restaurant.name}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-[#657c69]">
              {formatDate(transaction.createdAt)}
            </Text>
            <Text className="text-sm font-bold text-[#16a34a]">
              ${transaction.totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

