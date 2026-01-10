import { AppError } from "@/src/shared/error";
import { HydratedTransaction } from "@/src/shared/interfaces";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { createContext, ReactNode, useContext } from "react";
import { TransactionQueries } from "../transaction.queries";
import dayjs from "dayjs";

type Value = {
  transactions: HydratedTransaction[];
  sectionedTransactions: {
    title: string;
    data: HydratedTransaction[];
  }[];
};

const TransactionListContext = createContext<Value | null>(null);

export function TransactionListProvider({ children }: { children: ReactNode }) {
  const { data: transactions } = useLiveQuery(
    TransactionQueries.getTransactionsHydrated()
  );

  const grouped = transactions.reduce<Record<string, HydratedTransaction[]>>(
    (acc, transaction) => {
      const date = dayjs(transaction.date).format("MMM DD, YYYY");
      if (!acc[date]) acc[date] = [];
      acc[date].push(transaction);
      return acc;
    },
    {}
  );

  const sectionedTransactions = Object.keys(grouped).map((date) => ({
    title: date,
    data: grouped[date],
  }));

  return (
    <TransactionListContext.Provider
      value={{ transactions, sectionedTransactions }}
    >
      {children}
    </TransactionListContext.Provider>
  );
}

export function useTransactionListContext() {
  const context = useContext(TransactionListContext);

  if (!context)
    throw new AppError(
      "useTransactionListContext must be used inside TransactionListProvider"
    );

  return context;
}
