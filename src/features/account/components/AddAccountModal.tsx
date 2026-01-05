import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ModalBackdrop, ModalContent } from "@/src/shared/components/Modal";
import { AccountDB } from "../api";

export function AddAccountModal() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    balance: "",
  });

  const onSave = async () => {
    // Validations
    if (!form.name.trim()) {
      alert("Account name is required");
      return;
    }
    const balance = parseFloat(form.balance);
    if (isNaN(balance) || balance < 0) {
      alert("Balance must be a positive number");
      return;
    }
    try {
      await AccountDB.add(form.name, balance);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
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
                onPress={() => setShowModal(false)}
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
