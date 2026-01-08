import Ionicons from "@expo/vector-icons/Ionicons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Text, View, ScrollView, Pressable } from "react-native";
import { TransactionQueries } from "../transaction.queries";

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

function TransactionItem({ item }: { item: any }) {
  const isExpense = item.type === "expense";
  const isTransfer = item.type === "transfer";

  // Use Description if available, otherwise use Category Name, otherwise fallback
  const displayName =
    item.description || item.category?.name || "Uncategorized";

  // Subtitle showing the Account source (and destination if transfer)
  const accountInfo = isTransfer
    ? `${item.fromAccount?.name} → ${item.toAccount?.name}`
    : item.fromAccount?.name || "Unknown Account";

  return (
    <Pressable className="flex-row items-center justify-between py-5 active:opacity-50">
      <View className="flex-1 mr-4">
        <Text className="text-lg font-medium text-gray-900" numberOfLines={1}>
          {displayName}
        </Text>
        <Text className="text-sm text-gray-400" numberOfLines={1}>
          {accountInfo} •{" "}
          {new Date(item.date).toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>

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
          {isTransfer ? "" : isExpense ? "" : "+"}
          {Number(item.amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </Text>

        {/* Priority: Show Necessity Tag, else show Type if it's a Transfer */}
        {item.necessity ? (
          <Text className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">
            {item.necessity}
          </Text>
        ) : isTransfer ? (
          <Text className="text-[10px] uppercase font-bold text-blue-500 tracking-tighter">
            Transfer
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
