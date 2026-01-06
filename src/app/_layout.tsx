import { Stack } from "expo-router";
import { useMigration } from "@/src/db";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { seedData } from "@/src/db/seedData";

export default function RootLayout() {
  const { error, success } = useMigration();
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (success && !seeded) {
      (async () => {
        try {
          await seedData();
          setSeeded(true);
        } catch (err) {
          console.error("Seeding failed", err);
        }
      })();
    }
  }, [success, seeded]);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success || !seeded) {
    return (
      <View>
        <Text>Preparing database...</Text>
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
