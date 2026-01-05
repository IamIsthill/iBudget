import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { AccountDB } from "../api";
import { useRouter } from "expo-router";

type EditAccountScreenProps = {
  accountId: string;
};

export function EditAccountScreen({ accountId }: EditAccountScreenProps) {
  // Fetch account live
  const { data: accountArr } = useLiveQuery(AccountDB.getById(accountId));
  const account = accountArr?.[0];
  const router = useRouter();

  // Local state for editing
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (account) {
      setName(account.name);
      setBalance(account.balance?.toString() ?? "0");
    }
  }, [account]);

  // Loading state
  if (!accountArr) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500 text-lg">Loading account...</Text>
      </View>
    );
  }

  // Not found state
  if (accountArr.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500 text-lg">Account not found</Text>
      </View>
    );
  }

  // Save changes
  const onSave = async () => {
    try {
      const parsedBalance = parseFloat(balance) || 0;
      await AccountDB.update(accountId, { name, balance: parsedBalance });
      Alert.alert("Success", "Account updated!");
      Keyboard.dismiss();
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save account.");
    }
  };

  // Delete account
  const onDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await AccountDB.delete(accountId);
            Alert.alert("Deleted", "Account deleted successfully.");
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Header */}
      <Text className="text-2xl font-bold mb-6 text-center">Edit Account</Text>

      {/* Name input */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Account Name
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Savings"
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm"
        />
      </View>

      {/* Balance input */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-1">Balance</Text>
        <TextInput
          value={balance}
          onChangeText={setBalance}
          placeholder="0.00"
          keyboardType="numeric"
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm"
        />
      </View>

      {/* Actions */}
      <View className="flex-row justify-between mt-10">
        <Pressable
          onPress={onDelete}
          className="flex-1 bg-red-100 py-3 rounded-lg mr-2 items-center"
        >
          <Text className="text-red-600 font-semibold">Delete</Text>
        </Pressable>

        <Pressable
          onPress={onSave}
          className="flex-1 bg-black py-3 rounded-lg ml-2 items-center"
        >
          <Text className="text-white font-semibold">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
