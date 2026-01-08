import {
  CreateTransactionScreen,
  TransactionProvider,
} from "@/src/features/transactions";
import { View } from "react-native";

export default function AddScreen() {
  return (
    <TransactionProvider>
      <View className="flex-1">
        <CreateTransactionScreen />
      </View>
    </TransactionProvider>
  );
}
