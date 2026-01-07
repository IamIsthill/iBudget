import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

function EmptyState() {
  return (
    <>
      <View className="bg-gray-50 flex-1  rounded-lg items-center justify-center">
        <Ionicons name="receipt-outline" size={32} color="#9CA3AF" />
        <Text className="text-base font-normal">No transactions found.</Text>
      </View>
    </>
  );
}

export function TransactionWidget() {
  return (
    <View className="bg-white shadow-lg rounded-lg p-4 flex m-4 gap-4 h-1/2">
      <Text className="text-xl">Recent Transactions</Text>
      <EmptyState />
    </View>
  );
}
