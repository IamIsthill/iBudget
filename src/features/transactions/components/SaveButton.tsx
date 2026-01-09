import { Pressable, Text } from "react-native";
import { useTransactionContext } from "../context/TransactionContext";

export function SaveButton() {
  const { draft, saveTransaction } = useTransactionContext();

  return (
    <Pressable
      disabled={
        !draft.amount || draft.amount === "0" || draft.fromAccountId === "UNSET"
      }
      className={`h-16 rounded-2xl items-center justify-center shadow-sm ${
        !draft.amount || draft.amount === "0" || draft.fromAccountId === "UNSET"
          ? "bg-gray-200"
          : "bg-blue-600"
      }`}
      onPress={saveTransaction}
    >
      <Text
        className={`text-lg font-bold ${!draft.amount || draft.fromAccountId === "UNSET" || draft.amount === "0" ? "text-gray-400" : "text-white"}`}
      >
        Save{" "}
        {draft.type.charAt(0).toUpperCase() + draft.type.slice(1).toLowerCase()}
      </Text>
    </Pressable>
  );
}
