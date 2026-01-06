import { Stack } from "expo-router";
import { useMigration } from "@/src/db";
import { Text, View } from "react-native";

export default function RootLayout() {
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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="accounts/[accountId]" options={{ title: "" }} />
    </Stack>
  );
}
