import { Stack } from "expo-router";
import { View, Text } from "react-native";
import { useDatabaseSetup } from "../db";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider } from "../shared/components/Toast";
// import { NavigationContainer } from "@react-navigation/native";

export default function RootLayout() {
  const { ready, error } = useDatabaseSetup();

  if (error) {
    return (
      <View className="flex justify-center align-middle">
        <Text>Database error: {error.message}</Text>;
      </View>
    );
  }

  if (!ready) {
    return (
      <Text className="flex justify-center align-middle">
        Setting up database...
      </Text>
    );
  }

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="accounts/[accountId]" options={{ title: "" }} />
          <Stack.Screen
            name="transactions/add"
            options={{ title: "", presentation: "card" }}
          />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
