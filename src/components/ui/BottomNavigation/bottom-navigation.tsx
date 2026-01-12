import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  

interface Tab {
  name: string;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

interface BottomNavigationProps {
  tabs: Tab[];
  activeTab: string;
  className?: string; // Allow custom styling for the container
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  tabs,
  activeTab,
  className,
}) => {
  return (
    <View className={`flex-row justify-around bg-white border-t border-gray-200 py-3 shadow-lg ${className}`}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          onPress={tab.onPress}
          className="flex-1 items-center justify-center px-1"
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab.iconName}
            size={24}
            // Use dynamic colors that match Tailwind's theme
            color={activeTab === tab.name ? '#10B981' : '#6B7280'} // green-500 : gray-500
          />
          <Text
            className={`text-xs mt-1 font-medium ${
              activeTab === tab.name ? 'text-green-500' : 'text-gray-500'
            }`}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export { BottomNavigation };
