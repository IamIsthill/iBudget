import { useState } from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FormChip } from "./FormChip";
import { CustomModal } from "@/src/shared/components/Modal";
import { Account } from "@/src/shared/interfaces";
import { useTransactionContext } from "../context/TransactionContext";

type Props = {
  account: Account | null;
  role: "source" | "target";
};

export function ListAccountModal({ account, role }: Props) {
  const [showModal, setShowModal] = useState(false);
  const { accounts, draft, changeSourceAccount, changeTargetAccount } =
    useTransactionContext();

  let filteredAccounts = accounts;

  if (role === "target" && draft.fromAccountId) {
    filteredAccounts = accounts.filter((acc) => acc.id !== draft.fromAccountId);
  }

  if (role === "source" && draft.toAccountId) {
    filteredAccounts = accounts.filter((acc) => acc.id !== draft.toAccountId);
  }
  const handleSelect = (id: string) => {
    if (role === "source") {
      changeSourceAccount(id);
    } else {
      changeTargetAccount(id);
    }
    setShowModal(false);
  };

  return (
    <>
      <FormChip
        label="Account"
        value={account ? account.name : "Choose an Account"}
        icon="wallet-outline"
        onPress={() => setShowModal(true)}
      />
      <CustomModal onClose={() => setShowModal(false)} visible={showModal}>
        <View className="px-2">
          {/* Minimal Handle */}
          <View className="items-center">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Select Account
            </Text>
            <Text className="text-gray-400 mb-8 text-base">
              Pick a source for this transaction
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={true}
            className="max-h-[200px]"
          >
            {filteredAccounts.map((item, index) => {
              let isSelected = false;
              if (account) {
                isSelected = item.id === account.id;
              }

              return (
                <View key={item.id}>
                  <Pressable
                    onPress={() => handleSelect(item.id)}
                    className="flex-row items-center justify-between py-5 active:opacity-50"
                  >
                    <View>
                      <Text
                        className={`text-lg ${isSelected ? "font-bold text-blue-600" : "font-medium text-gray-800"}`}
                      >
                        {item.name}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Text
                        className={`text-lg ${isSelected ? "font-bold text-blue-600" : "text-gray-500"}`}
                      >
                        ₱
                        {Number(item.balance).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                      {isSelected && (
                        <View className="ml-3">
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#2563eb"
                          />
                        </View>
                      )}
                    </View>
                  </Pressable>

                  {/* Divider logic: Don't show on last item */}
                  {index !== accounts.length - 1 && (
                    <View className="h-[1px] bg-gray-50 w-full" />
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Close Button */}
          <Pressable
            onPress={() => setShowModal(false)}
            className="mt-6 bg-gray-700 py-4 rounded-2xl items-center"
          >
            <Text className="text-white font-bold text-lg">Close</Text>
          </Pressable>
        </View>
      </CustomModal>
    </>
  );
}
