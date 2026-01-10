import {
  View,
  Text,
  Pressable,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { router } from "expo-router";
import { AccountQueries } from "../account.queries";
import { useToast } from "@/src/shared/components/Toast";
import { AccountCommands } from "../account.commands";
import { Ionicons } from "@expo/vector-icons";
import { HeroBalance } from "./HeroBalance";
import { AccountName } from "./AccountName";

type EditAccountScreenProps = {
  accountId: string;
};

export function EditAccountScreen({ accountId }: EditAccountScreenProps) {
  const { showToast } = useToast();
  const { data: accountArr } = useLiveQuery(
    AccountQueries.getAccount(accountId)
  );
  const account = accountArr?.[0];

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (account) {
      setName(account.name);
      setBalance(account.balance?.toString() ?? "0");
    }
  }, [account]);

  if (!accountArr) return null; // Or a subtle spinner

  const onSave = async () => {
    try {
      const parsedBalance = parseFloat(balance) || 0;
      await AccountCommands.updateAccount(accountId, {
        name,
        balance: parsedBalance,
      });
      Keyboard.dismiss();
      router.back();
    } catch {
      showToast("Failed to save account", "error");
    }
  };

  const onDelete = async () => {
    Alert.alert(
      "Delete Account",
      "This will remove the account and all related history. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            await AccountCommands.deleteAccount(accountId);
            router.back();
          },
        },
      ]
    );
  };

  const handleSetDefault = async () => {
    try {
      await AccountCommands.toggleAccountDefault(account.id);
      showToast("Success");
    } catch {
      showToast("Failed to update default account", "error");
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white py-6 px-12">
      {/* 1. Hero Balance Section */}
      <ScrollView className="">
        <HeroBalance
          balance={balance}
          label="Available Balance"
          setBalance={setBalance}
        />

        <View className="gap-8 flex-1">
          {/* 2. Account Name Input */}
          <AccountName name={name} setName={setName} />

          {/* 3. Settings Toggle Row */}
          <View>
            <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-3 ml-1">
              Preferences
            </Text>
            <Pressable
              onPress={handleSetDefault}
              className={`flex-row items-center justify-between p-5 rounded-3xl border ${
                account?.isDefault
                  ? "bg-blue-50 border-blue-100"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    account?.isDefault ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <Ionicons
                    name={account?.isDefault ? "star" : "star-outline"}
                    size={18}
                    color={account?.isDefault ? "white" : "#6b7280"}
                  />
                </View>
                <View>
                  <Text className="text-gray-900 font-bold">Main Account</Text>
                  <Text className="text-gray-400 text-xs">
                    Used for quick logging
                  </Text>
                </View>
              </View>

              {account?.isDefault ? (
                <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
              ) : (
                <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
              )}
            </Pressable>
          </View>

          {/* 4. Footer Actions */}
        </View>
      </ScrollView>

      <View className="mt-4 gap-3">
        <Pressable
          onPress={onSave}
          className="bg-blue-600 py-5 rounded-[32px] items-center shadow-sm active:opacity-90"
        >
          <Text className="text-white font-bold text-lg">Save Changes</Text>
        </Pressable>

        <Pressable
          onPress={onDelete}
          className="py-4 items-center bg-white border-red-500 border-2 rounded-[32px]"
        >
          <Text className="text-red-500 font-bold">Delete Account</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
