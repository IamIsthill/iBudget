import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ModalBackdrop, ModalContent } from "@/src/shared/components/Modal";
import { AccountDB } from "@/src/db";
import { AppError } from "@/src/shared/error";

export function AddAccountModal() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    balance: "",
  });

  const resetForm = () => {
    setForm({ name: "", balance: "" });
  };

  const onSave = async () => {
    try {
      // Validations
      if (!form.name.trim()) {
        throw new AppError("Account name is required");
      }
      const balance = parseFloat(form.balance);
      if (isNaN(balance) || balance < 0) {
        throw new AppError("Balance must be a positive number");
      }
      await AccountDB.add(form.name, balance);
      resetForm();
      setShowModal(false);
    } catch (error) {
      if (error instanceof AppError) {
        alert(error.message);
      } else {
        alert("Failed to add new account");
      }
    }
  };

  const onCancel = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <>
      {/* Trigger */}
      <Pressable onPress={() => setShowModal(true)}>
        <Ionicons name="add-circle-outline" size={24} color="black" />
      </Pressable>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center px-4">
          <ModalBackdrop onPress={() => setShowModal(false)} />

          {/* Card */}
          <ModalContent>
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold">Add Account</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={20} color="#444" />
              </Pressable>
            </View>

            {/* Name */}
            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-1">Account name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="e.g. Savings"
                value={form.name}
                onChangeText={(name) => setForm({ ...form, name })}
              />
            </View>

            {/* Balance */}
            <View className="mb-6">
              <Text className="text-sm text-gray-600 mb-1">
                Initial balance
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="0.00"
                keyboardType="numeric"
                value={form.balance}
                onChangeText={(balance) => setForm({ ...form, balance })}
              />
            </View>

            {/* Actions */}
            <View className="flex-row justify-end gap-3 border-red">
              <Pressable
                className="bg-gray-200 px-4 py-2 rounded-lg"
                onPress={onCancel}
              >
                <Text className="text-gray-60">Cancel</Text>
              </Pressable>

              <Pressable
                className="bg-black px-4 py-2 rounded-lg"
                onPress={onSave}
              >
                <Text className="text-white font-medium">Save</Text>
              </Pressable>
            </View>
          </ModalContent>
        </View>
      </Modal>
    </>
  );
}
