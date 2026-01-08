import { FlatList, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AddAccountModal } from "./AddAccountModal";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { AccountDB } from "@/src/db";

export function AccountWidget() {
  const { data: accounts } = useLiveQuery(AccountDB.getAll());
  const router = useRouter();

  return (
    <View className="bg-white shadow-lg rounded-xl m-4 p-4">
      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">Your Accounts</Text>
        <AddAccountModal />
      </View>

      {/* Account list */}
      {accounts && accounts.length > 0 ? (
        accounts.map((item) => (
          <Pressable
            className="flex-row justify-between items-center p-3 mb-2 bg-gray-50 rounded-lg shadow-sm"
            android_ripple={{ color: "#e2e8f0" }}
            onPress={() => {
              router.push({
                pathname: "/accounts/[accountId]",
                params: { accountId: item.id },
              });
            }}
            key={item.id}
          >
            {/* Left side: Icon + Name */}
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                <Ionicons name="wallet-outline" size={20} color="#2563eb" />
              </View>
              <Text className="text-base font-medium text-gray-800">
                {item.name}
              </Text>
            </View>

            {/* Right side: Balance */}
            <Text className="text-base font-bold text-gray-900">
              ₱{item.balance!.toLocaleString()}
            </Text>
          </Pressable>
        ))
      ) : (
        <View className="py-6 items-center">
          <Text className="text-gray-400 text-base">No accounts yet.</Text>
        </View>
      )}
    </View>
  );
}
