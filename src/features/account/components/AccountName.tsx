import { Ionicons } from "@expo/vector-icons";
import { TextInput, View, Text } from "react-native";

export function AccountName({
  name,
  setName,
}: {
  name: string;
  setName: (name: string) => void;
}) {
  return (
    <View>
      <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-3 ml-1">
        Account Identity
      </Text>
      <View className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 flex-row items-center gap-4">
        <View className="w-10 h-10 bg-white rounded-2xl items-center justify-center border border-gray-100">
          <Ionicons name="wallet-outline" size={20} color="#4b5563" />
        </View>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Savings, Cash, G-Cash"
          placeholderTextColor="#9ca3af"
          className="text-lg text-gray-900 font-medium flex-1"
        />
      </View>
    </View>
  );
}
