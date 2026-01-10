import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TransactionQueries } from "../transaction.queries";
import { Account, Category } from "@/src/shared/interfaces";
import { TransactionType } from "@/src/db/schema";
import { AppError } from "@/src/shared/error";
import { useToast } from "@/src/shared/components/Toast";
import { TransactionCommands } from "../transaction.command";

type TransactionDraft = {
  amount: string;
  fromAccountId: string | null;
  toAccountId: string | null;
  categoryId: string | null;
  type: TransactionType;
  date: number;
  description: string;
};

type TransactionContextValue = {
  draft: TransactionDraft;
  accounts: Account[];
  categories: Category[];
  sourceAccount: Account | null;
  targetAccount: Account | null;
  chosenCategory: Category | null;
  changeSourceAccount: (fromAccountId: string) => void;
  changeCategory: (categoryId: string) => void;
  changeTransactionType: (type: TransactionType) => void;
  changeTargetAccount: (toAccountId: string) => void;
  changeAmount: (amount: string) => void;
  saveTransaction: () => Promise<void>;
  changeNote: (note: string) => void;
  changeDate: (date: Date) => void;
};

const TransactionContext = createContext<TransactionContextValue | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [draft, setDraft] = useState<TransactionDraft>({
    amount: "",
    fromAccountId: "UNSET",
    toAccountId: null,
    categoryId: null,
    date: Date.now(),
    description: "",
    type: TransactionType.EXPENSE,
  });

  const { data: accounts } = useLiveQuery(TransactionQueries.getAccounts());
  const { data: categories } = useLiveQuery(TransactionQueries.getCategories());

  useEffect(() => {
    if (draft.fromAccountId === "UNSET" && accounts.length > 0) {
      const defaultAccount =
        accounts.find((acc) => acc.isDefault) ?? accounts[0];

      setDraft((prev) => ({
        ...prev,
        fromAccountId: defaultAccount.id,
      }));
    }

    if (!draft.categoryId && categories.length > 0) {
      setDraft((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [accounts, draft.fromAccountId, categories, draft.categoryId]);

  const lastValidSourceAccount = useRef<Account | null>(null);
  const sourceAccount = (() => {
    const acc = accounts.find((a) => a.id === draft.fromAccountId);
    if (acc) lastValidSourceAccount.current = acc;
    return acc ?? lastValidSourceAccount.current;
  })();

  const targetAccount =
    accounts.find((acc) => acc.id === draft.toAccountId) || null;

  const lastValidCategory = useRef<Category | null>(null);
  const chosenCategory = (() => {
    const category = categories.find((c) => c.id === draft.categoryId) || null;
    if (category) lastValidCategory.current = category;
    return category ?? lastValidCategory.current;
  })();
  function changeSourceAccount(fromAccountId: string) {
    setDraft((prev) => ({ ...prev, fromAccountId }));
  }

  function changeTargetAccount(toAccountId: string) {
    setDraft((prev) => ({ ...prev, toAccountId }));
  }

  function changeCategory(categoryId: string) {
    setDraft((prev) => ({ ...prev, categoryId }));
  }

  function changeTransactionType(type: TransactionType) {
    setDraft((prev) => ({ ...prev, type }));
  }

  function changeAmount(amount: string) {
    setDraft((prev) => ({ ...prev, amount }));
  }

  function changeNote(note: string) {
    setDraft((prev) => ({ ...prev, description: note }));
  }

  function changeDate(date: Date) {
    setDraft((prev) => ({ ...prev, date: Number(date) }));
  }

  async function saveTransaction() {
    try {
      const amount = parseInt(draft.amount);

      await TransactionCommands.createTransaction({
        amount,
        date: draft.date,
        description: draft.description,
        fromAccountId: draft.fromAccountId!,
        type: draft.type,
        categoryId: draft.categoryId ?? undefined,
        toAccountId: draft.toAccountId ?? undefined,
      });

      resetDraft();
      showToast("Successfully recorded transaction", "success");
    } catch (err) {
      if (err instanceof AppError) {
        showToast(err.message, "error");
      } else {
        showToast("Failed to record transaction", "error");
        console.log(err);
      }
    }
  }

  function resetDraft() {
    setDraft({
      amount: "",
      fromAccountId: "UNSET",
      toAccountId: null,
      categoryId: null,
      date: Date.now(),
      description: "",
      type: TransactionType.EXPENSE,
    });
  }

  return (
    <TransactionContext.Provider
      value={{
        draft,
        accounts,
        categories,
        sourceAccount,
        targetAccount,
        chosenCategory,
        saveTransaction,
        changeSourceAccount,
        changeCategory,
        changeTransactionType,
        changeTargetAccount,
        changeAmount,
        changeNote,
        changeDate,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new AppError(
      "useTransactionContext must be used inside TransactionProvider"
    );
  return ctx;
}
