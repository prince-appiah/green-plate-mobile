import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeHeader() {
  return (
    <View className="bg-[#eff2f0] border-b border-[#e2e8f0] pt-3 pb-4 px-4">
      <View className="flex-row items-center justify-between">
        {/* Search Bar */}
        <View className="flex-1 bg-white border border-[#f3f4f6] rounded-full h-12 flex-row items-center px-4 mr-3 shadow-sm">
          <Ionicons name="search" size={20} color="#657c69" style={{ marginRight: 12 }} />
          <TextInput
            placeholder="Search burritos, sushi..."
            placeholderTextColor="#657c69"
            className="flex-1 text-[#1a2e1f] text-sm"
          />
          <TouchableOpacity className="w-8 h-8 rounded-full items-center justify-center">
            <Ionicons name="map-outline" size={20} color="#657c69" />
          </TouchableOpacity>
        </View>

        {/* Level Badge */}
        <View className="bg-white border border-[#f3f4f6] rounded-full h-12 px-3 flex-row items-center shadow-sm">
          <Ionicons name="leaf" size={20} color="#16a34a" style={{ marginRight: 12 }} />
          <View>
            <Text className="text-[#657c69] text-[10px] font-semibold uppercase tracking-wide">
              Level 5
            </Text>
            <Text className="text-[#1a2e1f] text-sm font-bold">840</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

