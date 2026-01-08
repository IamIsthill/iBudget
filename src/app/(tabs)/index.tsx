import { ScrollView } from "react-native";
import "@/src/assets/global.css";
import { AccountWidget } from "@/src/features/account";
import { TransactionWidget } from "@/src/features/transactions";

export default function Index() {
  return (
    <ScrollView className="flex-1">
      <AccountWidget />
      <TransactionWidget />
    </ScrollView>
  );
}
