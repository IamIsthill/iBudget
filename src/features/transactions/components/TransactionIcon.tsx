import { TransactionType } from "@/src/db/schema";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export function TransactionIcon({ type }: { type: TransactionType }) {
  // const isExpense = type === "expense";
  const isTransfer = type === "transfer";
  const isIncome = type === "income";

  const getTypeIcon = () => {
    if (isTransfer) return "swap-horizontal";
    if (isIncome) return "arrow-down-circle";
    return "card-outline"; // Expense
  };

  const getIconColor = () => {
    if (isTransfer) return "#2563eb"; // Blue
    if (isIncome) return "#16a34a"; // Green
    return "#4b5563"; // Gray/Black
  };

  return (
    <View
      className={`w-12 h-12 rounded-2xl items-center justify-center ${
        isIncome ? "bg-green-50" : isTransfer ? "bg-blue-50" : "bg-gray-50"
      }`}
    >
      <Ionicons name={getTypeIcon()} size={20} color={getIconColor()} />
    </View>
  );
}
