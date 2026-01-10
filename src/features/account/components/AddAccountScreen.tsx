import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useToast } from "@/src/shared/components/Toast";
import { HeroBalance } from "@/src/features/account";
import { AccountCommands } from "../account.commands";
import { AccountName } from "./AccountName";

export function AddAccountScreen() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("0");
  const [isDefault, setIsDefault] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      showToast("Please enter an account name", "error");
      return;
    }

    try {
      const parsedBalance = parseFloat(balance) || 0;
      await AccountCommands.createAccount({
        name,
        balance: parsedBalance,
        isDefault,
      });

      showToast("Account created successfully");
      router.back();
    } catch {
      showToast("Failed to create account", "error");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white p-6"
    >
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={true}>
        {/* 1. Initial Balance Section */}
        <HeroBalance
          balance={balance}
          setBalance={setBalance}
          label="Initial Balance"
        />

        <View className="gap-8">
          {/* 2. Account Name Section */}
          <AccountName name={name} setName={setName} />

          <View>
            <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-3 ml-1">
              Settings
            </Text>
            <ToggleAccountDefault
              isDefault={isDefault}
              setIsDefault={setIsDefault}
            />
          </View>
        </View>
      </ScrollView>

      {/* 4. Footer Action */}
      <View className="p-6 pb-2">
        <Pressable
          onPress={handleCreate}
          className="bg-blue-600 py-5 rounded-[32px] items-center shadow-sm active:opacity-90"
        >
          <Text className="text-white font-bold text-lg">Create Account</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

export function ToggleAccountDefault({
  setIsDefault,
  isDefault,
}: {
  isDefault: boolean;
  setIsDefault: (isDefault: boolean) => void;
}) {
  return (
    <>
      <Pressable
        onPress={() => setIsDefault(!isDefault)}
        className={`flex-row items-center justify-between p-5 rounded-[24px] border transition-colors ${
          isDefault
            ? "bg-blue-50 border-blue-100"
            : "bg-gray-50 border-gray-100"
        }`}
      >
        <View className="flex-row items-center gap-3">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDefault ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <Ionicons
              name={isDefault ? "star" : "star-outline"}
              size={18}
              color={isDefault ? "white" : "#6b7280"}
            />
          </View>
          <View>
            <Text className="text-gray-900 font-bold text-base">
              Primary Account
            </Text>
            <Text className="text-gray-400 text-xs">
              Set as your default wallet
            </Text>
          </View>
        </View>
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            isDefault ? "border-blue-600 bg-blue-600" : "border-gray-300"
          }`}
        >
          {isDefault && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      </Pressable>
    </>
  );
}
