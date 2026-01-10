import { Stack } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useDatabaseSetup } from "../db";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider } from "../shared/components/Toast";
import { StatusBar } from "expo-status-bar";
import { TransactionListProvider } from "../features/transactions";

export default function RootLayout() {
  const { ready, error } = useDatabaseSetup();

  // Unified wrapper for initialization states
  if (error || !ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <StatusBar style="dark" />
        {error ? (
          <>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#111827" }}
            >
              Initialization Failed
            </Text>
            <Text
              style={{ color: "#6b7280", textAlign: "center", marginTop: 8 }}
            >
              {error.message}
            </Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text
              style={{
                color: "#6b7280",
                marginTop: 16,
                fontWeight: "500",
                letterSpacing: 0.5,
              }}
            >
              PREPARING DATABASE
            </Text>
          </>
        )}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <TransactionListProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerTintColor: "#111827",
            }}
          >
            {/* Main App */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            <Stack.Screen
              name="accounts/add"
              options={{
                title: "",
                presentation: "containedTransparentModal",
                headerShadowVisible: false,
              }}
            />
            {/* Account Details */}
            <Stack.Screen
              name="accounts/[accountId]"
              options={{
                title: "",
                headerTitleStyle: { fontWeight: "600" },
              }}
            />

            <Stack.Screen
              name="transactions/index"
              options={{
                title: "",
                headerShown: false,
                presentation: "modal",
              }}
            />

            {/* Create Transaction */}
            <Stack.Screen
              name="transactions/add"
              options={{
                title: "",
                presentation: "modal",

                headerShadowVisible: false,
                headerTitleStyle: { fontWeight: "600" },
              }}
            />
          </Stack>
        </TransactionListProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
