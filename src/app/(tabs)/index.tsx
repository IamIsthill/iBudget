import { View } from "react-native";
import "@/src/assets/global.css";
import { AccountWidget } from "@/src/features/account";
import { TransactionWidget } from "@/src/features/transactions";

export default function Index() {
  return (
    <View>
      <AccountWidget />
      <TransactionWidget />
    </View>
  );
}
