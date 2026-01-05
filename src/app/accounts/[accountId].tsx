import { EditAccountScreen } from "@/src/features/account";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function AccountScreen() {
  const params = useLocalSearchParams();
  const accountId = Array.isArray(params.accountId)
    ? params.accountId[0]
    : params.accountId;
  return <EditAccountScreen accountId={accountId} />;
}
