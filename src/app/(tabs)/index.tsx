import { ScrollView } from "react-native";
import "@/src/assets/global.css";
import { AccountWidget } from "@/src/features/account";
import { TransactionWidget } from "@/src/features/transactions";
import { AccountWidgetProvider } from "@/src/features/account/context/AccountWidgetContext";

export default function Index() {
  return (
    <ScrollView className="flex-1">
      <AccountWidgetProvider>
        <AccountWidget />
      </AccountWidgetProvider>
      <TransactionWidget />
    </ScrollView>
  );
}
