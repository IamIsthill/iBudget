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
        label={role === "source" ? "From" : "To"}
        value={account?.name ?? "No Account"}
        icon="wallet-outline"
        onPress={() => setShowModal(true)}
      />

      <CustomModal onClose={() => setShowModal(false)} visible={showModal}>
        <View className="px-2">
          {/* Header */}
          <View className="items-center">
            <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
              {role === "source" ? "Source Account" : "Target Account"}
            </Text>
            <Text className="text-gray-400 mb-8 text-base text-center">
              {role === "source"
                ? "Where is the money coming from?"
                : "Where is the money going?"}
            </Text>
          </View>

          {/* List Area */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="max-h-[300px]"
          >
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((item, index) => {
                const isSelected = account?.id === item.id;

                return (
                  <View key={item.id}>
                    <Pressable
                      onPress={() => handleSelect(item.id)}
                      className="flex-row items-center justify-between py-5 active:opacity-50"
                    >
                      <View className="flex-row items-center gap-4">
                        <View
                          className={`w-10 h-10 rounded-xl items-center justify-center ${
                            isSelected ? "bg-blue-600" : "bg-gray-50"
                          }`}
                        >
                          <Ionicons
                            name="wallet-outline"
                            size={20}
                            color={isSelected ? "white" : "#9ca3af"}
                          />
                        </View>
                        <Text
                          className={`text-lg ${
                            isSelected
                              ? "font-bold text-blue-600"
                              : "font-medium text-gray-800"
                          }`}
                        >
                          {item.name}
                        </Text>
                      </View>

                      <Text
                        className={`text-lg ${
                          isSelected
                            ? "font-bold text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        ₱
                        {Number(item.balance).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </Pressable>

                    {index !== filteredAccounts.length - 1 && (
                      <View className="h-[1px] bg-gray-50 w-full" />
                    )}
                  </View>
                );
              })
            ) : (
              /* EMPTY STATE SECTION */
              <View className="py-12 items-center bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <Ionicons name="search-outline" size={30} color="#9ca3af" />
                </View>
                <Text className="text-gray-900 font-bold text-lg">
                  No accounts found
                </Text>
                <Text className="text-gray-400 text-center px-6 mt-1">
                  You have not added any other accounts to select from yet.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Close Button */}
          <Pressable
            onPress={() => setShowModal(false)}
            className="mt-8 bg-gray-900 py-5 rounded-[32px] items-center active:opacity-90"
          >
            <Text className="text-white font-bold text-lg">Go Back</Text>
          </Pressable>
        </View>
      </CustomModal>
    </>
  );
}
