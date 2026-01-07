import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyItem } from "./KeyItem";
import { Necessity, TransactionType } from "@/src/db/schema";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { formatPeso } from "../utils";
import { ListAccountModal } from "./ListAccountModal";
import { AccountDB, CategoriesDb, TransactionDb } from "@/src/db";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { ListCategoriesModal } from "./ListCategoriesModal";
import { ListNecessityLevelsModal } from "./ListNecessityLevelsModal";

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "backspace"],
];

interface Form {
  amount: string;
  fromAccountId: string;
  toAccountId?: string | null;
  categoryId?: string | null;
  necessity?: string | null;
  type: string;
  date: number;
  description: string;
}

export function CreateTransactionScreen() {
  const [form, setForm] = useState<Form>({
    amount: "",
    type: TransactionType.EXPENSE,
    categoryId: "",
    fromAccountId: "",
    necessity: Necessity.MUST,
    description: "",
    date: Date.now(),
  });

  const { data: accounts = [] } = useLiveQuery(AccountDB.getAll());
  const { data: categories = [] } = useLiveQuery(CategoriesDb.getAll());

  // Set default account on first load
  useEffect(() => {
    if (accounts.length > 0 && form.fromAccountId === "") {
      const defaultAccount = accounts.find((acc) => acc.isDefault);
      if (defaultAccount) {
        setForm((prev) => ({ ...prev, fromAccountId: defaultAccount.id }));
      } else {
        setForm((prev) => ({ ...prev, fromAccountId: accounts[0].id }));
      }
    }

    if (categories.length > 0 && form.categoryId === "") {
      // Temporary default category
      setForm((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [accounts, form.fromAccountId, categories, form.categoryId]);

  const currentAccount =
    accounts.find((acc) => acc.id === form.fromAccountId) || null;

  const defaultCategory =
    categories.find((cat) => cat.id === form.categoryId) || null;

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setForm((prev) => ({ ...prev, amount: prev.amount.slice(0, -1) }));
      return;
    }
    if (key === "." && form.amount === "") {
      setForm((prev) => ({ ...prev, amount: "0." }));
      return;
    }
    if (key === ".") {
      if (form.amount.includes(".")) return;
      setForm((prev) => ({ ...prev, amount: prev.amount + "." }));
      return;
    }
    if (form.amount === "0" && key === "0") return;
    if (form.amount === "0" && key !== "0") {
      setForm((prev) => ({ ...prev, amount: key }));
      return;
    }
    if (form.amount.includes(".")) {
      const [, dec] = form.amount.split(".");
      if (dec?.length >= 2) return;
    }
    if (form.amount.length >= 10) return;
    setForm((prev) => ({ ...prev, amount: prev.amount + key }));
  };

  const onSelectSourceAccount = (accountId: string) => {
    setForm((prev) => ({ ...prev, fromAccountId: accountId }));
  };

  const onSelectCategory = (categoryId: string) => {
    setForm((prev) => ({ ...prev, categoryId }));
  };

  const onSelectNecessity = (necessity: string) => {
    setForm((prev) => ({ ...prev, necessity: necessity as Necessity }));
  };

  const onSelectTransactionType = (type: TransactionType) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const onSaveTransaction = async () => {
    const payload = form;
    switch (payload.type) {
      case "income": {
        payload.necessity = null;
        payload.toAccountId = null;
        break;
      }
      case "expense": {
        payload.toAccountId = null;
        break;
      }
      case "transfer": {
        payload.necessity = null;
        break;
      }
    }

    try {
      await TransactionDb.add({
        fromAccountId: payload.fromAccountId,
        categoryId: payload.categoryId ? payload.categoryId : null,
        date: payload.date,
        description: payload.description,
        necessity: payload.necessity ? payload.necessity : null,
        toAccountId: payload.toAccountId ? payload.toAccountId : null,
        type: payload.type as TransactionType,
        amount: parseInt(payload.amount.toString()),
      });
      alert("success");
    } catch (err) {
      alert("Failed to save transaction");
      console.log(err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-gray-400 font-medium uppercase tracking-widest mb-2">
          {form.type} Amount
        </Text>
        <View className="flex-row items-baseline">
          <Text className="text-4xl font-bold text-blue-600 mr-2">₱</Text>
          <Text className="text-6xl font-bold text-gray-900 tracking-tighter">
            {formatPeso(form.amount)}
          </Text>
        </View>
      </View>

      {/* 2. Transaction Type (Income/Expense/Transfer) */}
      <View className="px-6 mb-4">
        <TransactionTypeSelector
          transactionType={form.type}
          setTransactionType={onSelectTransactionType}
        />
      </View>

      {/* 3. Metadata Selectors (Account, Category, Necessity) */}
      <View className="flex-row px-6 mb-6 justify-between">
        <ListAccountModal
          account={currentAccount}
          onSelect={onSelectSourceAccount}
          accounts={accounts}
        />
        {form.type === TransactionType.TRANSFER && (
          <ListAccountModal
            account={currentAccount}
            onSelect={onSelectSourceAccount}
            accounts={accounts}
          />
        )}
        {form.type !== TransactionType.TRANSFER && (
          <ListCategoriesModal
            categories={categories}
            onSelect={onSelectCategory}
            category={defaultCategory}
          />
        )}
        {form.type === TransactionType.EXPENSE && (
          <ListNecessityLevelsModal
            necessity={form.necessity as string}
            onSelect={onSelectNecessity}
          />
        )}
      </View>

      {/* 5. Keypad Area */}
      <View className="bg-gray-50 border-t border-gray-100 px-4 pt-4 pb-8">
        {KEYS.map((keyRow, rowIndex) => (
          <View key={rowIndex} className="flex-row">
            {keyRow.map((key) => (
              <KeyItem
                key={key}
                label={key}
                onKeyPress={() => handleKeyPress(key)}
              />
            ))}
          </View>
        ))}

        <Pressable
          disabled={!form.amount || form.amount === "0"}
          className={`mt-4 h-16 rounded-2xl items-center justify-center shadow-sm ${
            !form.amount || form.amount === "0" ? "bg-gray-200" : "bg-blue-600"
          }`}
          onPress={onSaveTransaction}
        >
          <Text
            className={`text-lg font-bold ${!form.amount || form.amount === "0" ? "text-gray-400" : "text-white"}`}
          >
            Save{" "}
            {form.type.charAt(0).toUpperCase() +
              form.type.slice(1).toLowerCase()}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
