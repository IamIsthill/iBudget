import { FlatList, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AddAccountModal } from "./AddAccountModal";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { AccountDB } from "../api";

export function AccountWidget() {
  // Live query from Drizzle
  const { data: accounts } = useLiveQuery(AccountDB.getAll());

  return (
    <View className="bg-white shadow-md m-2 rounded-lg p-4">
      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold">Your Accounts</Text>
        <AddAccountModal />
      </View>

      {/* Account list */}
      {accounts && accounts.length > 0 ? (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-base font-medium">{item.name}</Text>
              <Text className="text-base font-semibold">
                ₱{item.balance!.toLocaleString()}
              </Text>
            </View>
          )}
        />
      ) : (
        <View className="py-4 items-center">
          <Text className="text-gray-400">No accounts yet.</Text>
        </View>
      )}
    </View>
  );
}
