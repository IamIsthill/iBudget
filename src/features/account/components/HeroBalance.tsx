import { Text, TextInput, View } from "react-native";

export function HeroBalance({
  balance,
  setBalance,
  label,
}: {
  label: string;
  balance: string;
  setBalance: (balance: string) => void;
}) {
  return (
    <>
      <View className="items-center py-12 gap-2">
        <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          {label}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-4xl font-bold text-blue-600 mr-2">₱</Text>
          <TextInput
            value={balance}
            onChangeText={setBalance}
            keyboardType="decimal-pad"
            className="text-6xl font-bold text-gray-900 tracking-tighter"
            placeholder="0"
          />
        </View>
      </View>
    </>
  );
}
