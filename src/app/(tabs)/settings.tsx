import { Pressable, Text, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Application from "expo-application";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "@/src/db";
import { accountsTable, transactionsTable } from "@/src/db/schema";
import { useEffect } from "react";

export default function Settings() {
  const appVersion = Application.nativeApplicationVersion || "1.0.0";
  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "This will permanently erase all transactions and accounts. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: async () => {
            await db.delete(accountsTable);
            await db.delete(transactionsTable);
          },
        },
      ]
    );
  };

  useEffect(() => {
    (async () => {
      const accounts = await db.select().from(accountsTable);
      console.log(accounts);
    })();
  });

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      {/* 1. Header Area */}
      <View className="py-8">
        <Text className="text-4xl font-bold text-gray-900 tracking-tight">
          Settings
        </Text>
        <Text className="text-gray-400 font-medium mt-1">
          App Version {appVersion}
        </Text>
      </View>

      {/* 2. Preferences Section */}
      <View className="flex-1">
        <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-4 ml-1">
          Preferences
        </Text>

        {/* Example Setting Row */}
        <Pressable className="flex-row items-center justify-between p-5 bg-gray-50 rounded-[24px] border border-gray-100 mb-4">
          <View className="flex-row items-center gap-4">
            <View className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-gray-100">
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#4b5563"
              />
            </View>
            <Text className="text-lg font-bold text-gray-900">
              Notifications
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        </Pressable>

        <Pressable className="flex-row items-center justify-between p-5 bg-gray-50 rounded-[24px] border border-gray-100">
          <View className="flex-row items-center gap-4">
            <View className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-gray-100">
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#4b5563"
              />
            </View>
            <Text className="text-lg font-bold text-gray-900">
              Privacy & Security
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        </Pressable>
      </View>

      {/* 3. Destructive Footer Section */}
      <View className="pb-10">
        <View className="bg-red-50 rounded-[32px] p-6 border border-red-100">
          <Text className="text-red-900 font-bold text-lg mb-1">
            Danger Zone
          </Text>
          <Text className="text-red-600/70 text-sm mb-6 leading-relaxed">
            Deleting your data is permanent. Please ensure you have backed up
            your details if necessary.
          </Text>

          <Pressable
            onPress={handleResetData}
            className="bg-red-500 py-4 rounded-[20px] items-center active:bg-red-600"
          >
            <Text className="text-white font-bold">Erase All Data</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
