import { EditAccountScreen } from "@/src/features/account";
import { router, useLocalSearchParams } from "expo-router";

export default function AccountScreen() {
  const params = useLocalSearchParams();
  const accountId = Array.isArray(params.accountId)
    ? params.accountId[0]
    : params.accountId;

  if (accountId === "add") {
    router.replace("/accounts/add");
    return null;
  }
  return <EditAccountScreen accountId={accountId} />;
}
