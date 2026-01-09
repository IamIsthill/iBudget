import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AddAccountModal } from "./AddAccountModal";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { router } from "expo-router";
import { AccountQueries } from "../account.queries";
import { useState } from "react";
import { Account } from "@/src/shared/interfaces";
import { useAccountWidgetContext } from "../context/AccountWidgetContext";

function HeroAccount({ account }: { account: Account }) {
  return (
    <>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/accounts/[accountId]",
            params: { accountId: account.id },
          })
        }
        className="bg-blue-600 rounded-[24px] p-6 mb-4 shadow-sm active:opacity-90"
      >
        <View className="flex-row justify-between items-center mb-4">
          <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
            <Ionicons name="star" size={20} color="white" />
          </View>
          <View className="bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white text-[10px] font-bold uppercase">
              Default
            </Text>
          </View>
        </View>
        <Text className="text-white/70 text-sm font-medium">
          {account.name}
        </Text>
        <Text className="text-white text-3xl font-bold tracking-tighter mt-1">
          ₱
          {Number(account.balance).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </Text>
      </Pressable>
    </>
  );
}

// function SecondaryAccountList

export function AccountWidget() {
  const [showModal, setShowModal] = useState(false);
  const { accounts, secondaryAccounts, defaultAccount } =
    useAccountWidgetContext();
  // const { data: accounts } = useLiveQuery(AccountQueries.getAccounts());
  // const defaultAccount = accounts?.find((acc) => acc.isDefault) || null;
  // const filteredAccounts = accounts?.filter((acc) => !acc.isDefault) || [];

  return (
    <View className="bg-white rounded-[32px] p-6 m-4 shadow-sm border border-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Accounts</Text>
          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mt-1">
            {accounts?.length || 0} ACTIVE WALLETS
          </Text>
        </View>
        <AddAccountModal showModal={showModal} setShowModal={setShowModal} />
      </View>

      {/* Main Content Area */}
      {accounts && accounts.length > 0 ? (
        <View>
          {/* 1. HERO SECTION: Default Account */}
          {defaultAccount && <HeroAccount account={defaultAccount} />}

          {/* 2. LIST SECTION: Secondary Accounts */}
          {secondaryAccounts.length > 0 && (
            <View className="mt-2">
              {secondaryAccounts.map((item, index) => (
                <View key={item.id}>
                  <Pressable
                    className="flex-row justify-between items-center py-4 active:opacity-50"
                    onPress={() =>
                      router.push({
                        pathname: "/accounts/[accountId]",
                        params: { accountId: item.id },
                      })
                    }
                  >
                    <View className="flex-row items-center gap-4">
                      <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100">
                        <Ionicons
                          name="wallet-outline"
                          size={22}
                          color="#4b5563"
                        />
                      </View>
                      <Text className="text-base font-bold text-gray-900">
                        {item.name}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-base font-bold text-gray-900">
                        ₱
                        {Number(item.balance).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                  </Pressable>
                  {index !== secondaryAccounts.length - 1 && (
                    <View className="h-[1px] bg-gray-50 w-full" />
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ) : (
        /* EMPTY STATE */
        <Pressable onPress={() => setShowModal(true)}>
          <View className="py-10 items-center bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
            <Ionicons name="add-circle-outline" size={32} color="#9ca3af" />
            <Text className="text-gray-400 font-medium mt-2">
              Tap + to add an account
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}
