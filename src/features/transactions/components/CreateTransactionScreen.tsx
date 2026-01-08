import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { formatPeso } from "../utils";
import { useTransactionContext } from "../context/TransactionContext";
import { KeypadArea } from "./KeypadArea";
import { MetadataSelectors } from "./MetadataSelectors";

export function CreateTransactionScreen() {
  const { draft, saveTransaction } = useTransactionContext();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-gray-400 font-medium uppercase tracking-widest mb-2">
          {draft.type} Amount
        </Text>
        <View className="flex-row items-baseline">
          <Text className="text-4xl font-bold text-blue-600 mr-2">₱</Text>
          <Text className="text-6xl font-bold text-gray-900 tracking-tighter">
            {formatPeso(draft.amount)}
          </Text>
        </View>
      </View>

      {/* 2. Transaction Type (Income/Expense/Transfer) */}
      <View className="px-6 mb-4">
        <TransactionTypeSelector />
      </View>

      {/* 3. Metadata Selectors (Account, Category, Necessity) */}
      <MetadataSelectors />

      {/* 5. Keypad Area */}
      <View className="bg-gray-50 border-t border-gray-100 px-4 pt-4 pb-8">
        <KeypadArea />

        <Pressable
          disabled={!draft.amount || draft.amount === "0"}
          className={`mt-4 h-16 rounded-2xl items-center justify-center shadow-sm ${
            !draft.amount || draft.amount === "0"
              ? "bg-gray-200"
              : "bg-blue-600"
          }`}
          onPress={saveTransaction}
        >
          <Text
            className={`text-lg font-bold ${!draft.amount || draft.amount === "0" ? "text-gray-400" : "text-white"}`}
          >
            Save{" "}
            {draft.type.charAt(0).toUpperCase() +
              draft.type.slice(1).toLowerCase()}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
