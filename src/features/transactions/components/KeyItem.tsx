import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

export function KeyItem({
  label,
  onKeyPress,
}: {
  label: string;
  onKeyPress: () => void;
}) {
  return (
    <Pressable
      onPress={onKeyPress}
      className="flex-1 items-center justify-center py-8 active:bg-blue-50"
    >
      {label === "backspace" ? (
        <Ionicons name="backspace-outline" size={32} color="#3b82f6" /> // Blue accent for backspace
      ) : (
        <Text className="text-3xl font-semibold text-gray-800">{label}</Text>
      )}
    </Pressable>
  );
}
