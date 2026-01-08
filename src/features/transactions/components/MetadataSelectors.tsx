import { TransactionType } from "@/src/db/schema";
import { useTransactionContext } from "../context/TransactionContext";
import { ListAccountModal } from "./ListAccountModal";
import { View } from "react-native";
import { ListCategoriesModal } from "./ListCategoriesModal";
import { ListNecessityLevelsModal } from "./ListNecessityLevelsModal";
import { Ionicons } from "@expo/vector-icons";

export function MetadataSelectors() {
  const { draft, sourceAccount, targetAccount } = useTransactionContext();

  return (
    <View>
      {draft.type === TransactionType.INCOME && (
        <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-t-3xl border border-gray-100 gap-2">
          <ListAccountModal account={sourceAccount} role="source" />
          <ListCategoriesModal />
        </View>
      )}
      {draft.type === TransactionType.EXPENSE && (
        <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-t-3xl border border-gray-100 gap-1">
          <ListAccountModal account={sourceAccount} role="source" />
          <ListCategoriesModal />
          <ListNecessityLevelsModal />
        </View>
      )}
      {draft.type === TransactionType.TRANSFER && (
        <View className="flex-row items-center justify-between bg-gray-50 p-2 rounded-t-3xl border border-gray-100">
          {/* Source Account */}
          <View className="flex-1">
            <ListAccountModal account={sourceAccount} role="source" />
          </View>

          {/* Connection Icon */}
          <View className="px-4 py-9">
            <View className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
              <Ionicons name="arrow-forward" size={16} color="#2563eb" />
            </View>
          </View>

          {/* Destination Account */}
          <View className="flex-1">
            <ListAccountModal account={targetAccount} role="target" />
          </View>
        </View>
      )}
    </View>
  );
}
