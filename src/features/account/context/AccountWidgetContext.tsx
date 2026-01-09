import { AppError } from "@/src/shared/error";
import { Account } from "@/src/shared/interfaces";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { createContext, ReactNode, useContext } from "react";
import { AccountQueries } from "../account.queries";

type AccountWidgetContextValue = {
  accounts: Account[];
  defaultAccount: Account | null;
  secondaryAccounts: Account[];
};

const AccountWidgetContext = createContext<AccountWidgetContextValue | null>(
  null
);

export function AccountWidgetProvider({ children }: { children: ReactNode }) {
  const { data: accounts } = useLiveQuery(AccountQueries.getAccounts());
  const defaultAccount = accounts?.find((acc) => acc.isDefault) || null;
  const secondaryAccounts = accounts?.filter((acc) => !acc.isDefault) || [];

  return (
    <AccountWidgetContext.Provider
      value={{ accounts, defaultAccount, secondaryAccounts }}
    >
      {children}
    </AccountWidgetContext.Provider>
  );
}

export function useAccountWidgetContext() {
  const context = useContext(AccountWidgetContext);

  if (!context)
    throw new AppError(
      "useAccountWidgetContext must be used inside AccountWidgetProvider"
    );

  return context;
}
