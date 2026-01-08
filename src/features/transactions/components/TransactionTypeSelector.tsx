import { TransactionType } from "@/src/db/schema";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { memo } from "react";
import { useTransactionContext } from "../context/TransactionContext";

const TRANSACTION_TYPES = [
  TransactionType.INCOME,
  TransactionType.EXPENSE,
  TransactionType.TRANSFER,
] as const;

export const TransactionTypeSelector = memo(function TransactionTypeSelector() {
  const { changeTransactionType, draft } = useTransactionContext();
  return (
    <View className="flex-row bg-gray-100 p-1.5 rounded-2xl">
      {TRANSACTION_TYPES.map((type) => {
        const isActive = draft.type === type;

        return (
          <Pressable
            key={type}
            onPress={() => changeTransactionType(type)}
            style={[styles.button, isActive && styles.activeButton]}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {type.toLocaleUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontWeight: "bold",
    color: "#6B7280", // gray-500
  },
  activeText: {
    color: "#2563EB", // blue-600
  },
});
