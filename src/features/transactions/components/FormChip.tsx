import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];
type Props = {
  label: string;
  value: string;
  icon: IoniconsName;
  active?: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function FormChip({
  label,
  value,
  icon,
  onPress,
  active,
  disabled,
}: Props) {
  const handlePress = () => {
    if (disabled) return;
    onPress();
  };
  return (
    <Pressable
      onPress={handlePress}
      className={`items-center justify-center p-3 rounded-2xl flex-1 border ${active ? "border-blue-100 bg-blue-50" : "border-gray-100 bg-white"}`}
    >
      <Ionicons name={icon} size={20} color={active ? "#2563eb" : "#6b7280"} />
      <Text
        className="text-sm uppercase text-gray-400 font-bold mt-1 tracking-tighter"
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text
        className={`text-md font-bold mt-0.5 ${active ? "text-blue-600" : "text-gray-700"}`}
        numberOfLines={1}
      >
        {value}
      </Text>
    </Pressable>
  );
}
