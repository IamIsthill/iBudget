import { Text, View } from "react-native";
import "@/src/assets/global.css";
import { AccountWidget } from "@/src/features/account";
import { useMigration } from "@/src/db";

export default function Index() {
  const { error, success } = useMigration();

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <View>
      <AccountWidget />
    </View>
  );
}
