import React from "react";
import { View, Text, SectionList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // recommended for date formatting
import {
  TransactionIcon,
  useTransactionListContext,
} from "@/src/features/transactions";
import { HydratedTransaction } from "@/src/shared/interfaces";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionType } from "@/src/db/schema";

function EmptyState() {
  return (
    <View className="flex-1 justify-center items-center p-10 mt-10">
      <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
        <Ionicons name="receipt-outline" size={32} color="#d1d5db" />
      </View>
      <Text className="text-gray-900 font-bold text-lg">No history yet</Text>
      <Text className="text-gray-400 text-center mt-1">
        Your transactions will appear here once you start spending or earning.
      </Text>
    </View>
  );
}

export default function TransactionList() {
  const { sectionedTransactions } = useTransactionListContext();

  if (sectionedTransactions.length === 0) return <EmptyState />;

  return (
    <SafeAreaView>
      <SectionList
        sections={sectionedTransactions}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-[2px] mb-3 ml-6 mt-6">
            {title}
          </Text>
        )}
        renderItem={({ item, index, section }) => (
          <TransactionRow
            item={item}
            isLast={index === section.data.length - 1}
            index={index}
          />
        )}
      />
    </SafeAreaView>
  );
}

function TransactionRow({
  item,
  isLast,
  index,
}: {
  item: HydratedTransaction;
  isLast: boolean;
  index: number;
}) {
  const isTransfer = item.type === "transfer";
  const isIncome = item.type === "income";

  return (
    <View className="px-4">
      <Pressable
        className={`bg-white p-4 flex-row items-center justify-between ${
          isLast ? "rounded-b-[24px]" : ""
        } ${item === item ? "border-b border-gray-50" : ""} ${index === 0 && " rounded-t-[24px]"}`}
        // If it's the first item, you can add rounded-t-[24px] logic
      >
        <View className="flex-row items-center gap-4">
          {/* Icon Category */}
          <TransactionIcon type={item.type as TransactionType} />

          <View>
            <Text className="text-base font-bold text-gray-900">
              {item.description || "No Description"}
            </Text>
            <Text className="text-xs text-gray-400 font-medium">
              {item.category?.name || "Uncategorized"}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text
            className={`text-lg font-bold ${
              isIncome
                ? "text-green-600"
                : isTransfer
                  ? "text-gray-500"
                  : "text-gray-900"
            }`}
          >
            {isIncome ? "+" : isTransfer ? "" : "-"}₱
            {Number(Math.abs(item.amount)).toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text className="text-[10px] text-gray-300 uppercase font-bold">
            {item.type}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
