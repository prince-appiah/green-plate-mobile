import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const AnalyticsCard = ({
  icon,
  label,
  value,
  color = "#16a34a",
  subtitle,
}: {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  subtitle?: string;
}) => (
  <View className="bg-white rounded-2xl p-4 border border-[#e5e7eb] shadow-sm">
    <View className="flex-row items-center mb-2">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: `${color}15` }}
      >
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text className="text-sm text-[#657c69] flex-1">{label}</Text>
    </View>
    <Text className="text-2xl font-bold text-[#1a2e1f] mb-1">{value}</Text>
    {subtitle && <Text className="text-xs text-[#657c69]">{subtitle}</Text>}
  </View>
);
