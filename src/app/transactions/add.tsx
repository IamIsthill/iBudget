import { CreateTransactionScreen } from "@/src/features/transactions";
import { Text, View } from "react-native";

export default function AddScreen() {
  return (
    <View className="flex-1">
      <CreateTransactionScreen />
    </View>
  );
}
