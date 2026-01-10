import { TransactionType } from "@/src/db/schema";
import { useTransactionContext } from "../context/TransactionContext";
import { ListAccountModal } from "./ListAccountModal";
import { View } from "react-native";
import { ListCategoriesModal } from "./ListCategoriesModal";
import { Ionicons } from "@expo/vector-icons";

export function MetadataSelectors() {
  const { draft, sourceAccount, targetAccount } = useTransactionContext();

  return (
    <View>
      {draft.type === TransactionType.TRANSFER ? (
        <View className="flex-row items-center justify-between bg-gray-50 py-2 px-4 rounded-t-3xl border border-gray-100">
          <ListAccountModal account={sourceAccount} role="source" />

          {/* Connection Icon */}
          <View className="px-4 py-9">
            <View className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
              <Ionicons name="arrow-forward" size={16} color="#2563eb" />
            </View>
          </View>

          <ListAccountModal account={targetAccount} role="target" />
        </View>
      ) : (
        <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-t-3xl border border-gray-100 gap-4">
          <ListAccountModal account={sourceAccount} role="source" />
          <ListCategoriesModal />
        </View>
      )}
    </View>
  );
}
