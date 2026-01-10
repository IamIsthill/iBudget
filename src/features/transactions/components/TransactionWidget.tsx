import Ionicons from "@expo/vector-icons/Ionicons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Text, View, ScrollView, Pressable } from "react-native";
import { TransactionQueries } from "../transaction.queries";
import { HydratedTransaction } from "@/src/shared/interfaces";

// EmptyState remains the same as your standard
function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <View className="bg-gray-50 p-6 rounded-full mb-4">
        <Ionicons name="receipt-outline" size={32} color="#9CA3AF" />
      </View>
      <Text className="text-lg font-bold text-gray-900">No transactions</Text>
      <Text className="text-gray-400 text-center mt-1">
        Your recent activity will appear here
      </Text>
    </View>
  );
}

export function TransactionWidget() {
  const { data: transactions } = useLiveQuery(
    TransactionQueries.getTransactionsHydrated()
  );
  const displayedTransactions = transactions.slice(0, 5);

  return (
    <View className="bg-white rounded-[32px] p-6 m-4 shadow-sm border border-gray-50 flex-1 min-h-[400px]">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">
          Recent Activity
        </Text>
        <Pressable className="active:opacity-50">
          <Text className="text-blue-600 font-bold">See All</Text>
        </Pressable>
      </View>

      {!transactions || transactions.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {displayedTransactions.map((item, index) => (
            <View key={item.id}>
              <TransactionItem item={item} />
              {index !== transactions.length - 1 && (
                <View className="h-[1px] bg-gray-50 w-full" />
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function TransactionItem({ item }: { item: HydratedTransaction }) {
  const isExpense = item.type === "expense";
  const isTransfer = item.type === "transfer";
  const isIncome = item.type === "income";

  // Functional Icon Logic using Ionicons
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
    <Pressable className="flex-row items-center py-5 active:opacity-50">
      {/* 1. Leading Icon Area */}
      <View
        className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${
          isTransfer ? "bg-blue-50" : isIncome ? "bg-green-50" : "bg-gray-50"
        }`}
      >
        <Ionicons name={getTypeIcon()} size={22} color={getIconColor()} />
      </View>

      {/* 2. Transaction Details */}
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
          {isTransfer ? "Transfer" : item.category?.name || "Uncategorized"}
        </Text>

        {isTransfer ? (
          <View className="flex-row items-center mt-0.5">
            <Text className="text-sm font-medium text-gray-500">
              {item.fromAccount?.name ?? "[Deleted]"}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={12}
              color="#9ca3af"
              style={{ marginHorizontal: 4 }}
            />
            <Text className="text-sm font-medium text-gray-500">
              {item.toAccount?.name ?? "[Deleted]"}
            </Text>
          </View>
        ) : (
          <Text className="text-sm text-gray-400 mt-0.5">
            {item.fromAccount?.name ?? "[Deleted]"} •{" "}
            {new Date(item.date).toLocaleDateString("en-PH", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        )}
      </View>

      {/* 3. Amount and Metadata */}
      <View className="items-end">
        <Text
          className={`text-lg font-bold ${
            isTransfer
              ? "text-gray-500"
              : isExpense
                ? "text-gray-900"
                : "text-green-600"
          }`}
        >
          {isIncome ? "+" : ""}
          {Number(item.amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </Text>

        {!isTransfer && item.category && (
          <View className="bg-gray-100 px-2 py-0.5 rounded-md mt-1">
            <Text className="text-[9px] uppercase font-bold text-gray-500 tracking-tighter">
              {item.category?.necessity}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
