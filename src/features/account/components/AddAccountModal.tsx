import React, { useState } from "react";
import { Pressable, Text, TextInput, View, Switch } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CustomModal } from "@/src/shared/components/Modal";
import { AppError } from "@/src/shared/error";
import { useToast } from "@/src/shared/components/Toast";
import { AccountCommands } from "../account.commands";

type Props = {
  showModal: boolean;
  setShowModal: (b: boolean) => void;
};

export function AddAccountModal({ showModal, setShowModal }: Props) {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    balance: "",
    isDefault: false,
  });

  const onSave = async () => {
    try {
      if (!form.name.trim()) {
        throw new AppError("Account name is required");
      }
      const balance = parseFloat(form.balance);
      if (isNaN(balance) || balance < 0) {
        throw new AppError("Balance must be a positive number");
      }
      await AccountCommands.createAccount({
        ...form,
        balance: parseInt(form.balance),
      });

      setShowModal(false);
      setForm({ name: "", balance: "", isDefault: false });
      showToast("Successfully added a new account", "success");
    } catch (err) {
      if (err instanceof AppError) {
        showToast(err.message, "info");
      } else {
        showToast("Failed to add new account", "error");
      }
    }
  };

  return (
    <>
      <Pressable onPress={() => setShowModal(true)}>
        <Ionicons name="add-circle" size={32} color="#2563eb" />
      </Pressable>

      <CustomModal onClose={() => setShowModal(false)} visible={showModal}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-gray-900">New Account</Text>
          <Pressable
            onPress={() => setShowModal(false)}
            className="bg-gray-100 p-1 rounded-full"
          >
            <Ionicons name="close" size={20} color="#6b7280" />
          </Pressable>
        </View>

        {/* Form Inputs */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
            Account Name
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 font-medium"
            placeholder="e.g. Savings, GCash"
            value={form.name}
            onChangeText={(name) => setForm({ ...form, name })}
          />
        </View>

        <View className="mb-6">
          <Text className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
            Initial Balance
          </Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4">
            <Text className="text-gray-400 font-bold mr-2">₱</Text>
            <TextInput
              className="flex-1 py-4 font-medium"
              keyboardType="numeric"
              value={form.balance}
              onChangeText={(balance) => setForm({ ...form, balance })}
            />
          </View>
        </View>

        <View className="flex-row justify-between items-center bg-blue-50/50 p-4 rounded-2xl mb-8">
          <View>
            <Text className="text-gray-900 font-bold">Default Account</Text>
            <Text className="text-xs text-gray-500">
              Use for new transactions
            </Text>
          </View>
          <Switch
            value={form.isDefault}
            onValueChange={(isDefault) => setForm({ ...form, isDefault })}
            trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
            thumbColor={form.isDefault ? "#2563eb" : "#f4f3f4"}
          />
        </View>

        {/* Actions */}
        <View className="flex-row gap-3">
          <Pressable
            className="flex-[2] bg-blue-600 py-4 rounded-2xl items-center shadow-blue-200 shadow-lg"
            onPress={onSave}
          >
            <Text className="text-white font-bold text-lg">Create Account</Text>
          </Pressable>
        </View>
      </CustomModal>
    </>
  );
}
