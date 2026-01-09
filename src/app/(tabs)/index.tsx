import { ScrollView } from "react-native";
import "@/src/assets/global.css";
import { AccountWidget, AccountWidgetProvider } from "@/src/features/account";
import { TransactionWidget } from "@/src/features/transactions";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <AccountWidgetProvider>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <AccountWidget />
          <TransactionWidget />
        </ScrollView>
      </SafeAreaView>
    </AccountWidgetProvider>
  );
}
