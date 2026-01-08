import React, { createContext, useContext, useState, useCallback } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ToastType = "success" | "error" | "info";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");
  const opacity = React.useRef(new Animated.Value(0)).current;

  const showToast = useCallback(
    (msg: string, toastType: ToastType = "success") => {
      setMessage(msg);
      setType(toastType);

      // Animation Sequence: Fade In -> Wait -> Fade Out
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [opacity]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* The Toast UI */}
      <Animated.View
        pointerEvents="none"
        style={[styles.toastContainer, { opacity }]}
      >
        <View
          className={`flex-row items-center px-6 py-4 rounded-full shadow-lg border border-gray-100 ${
            type === "error" ? "bg-red-50" : "bg-gray-900"
          }`}
        >
          <Ionicons
            name={
              type === "success" ? "checkmark-circle" : "information-circle"
            }
            size={20}
            color={type === "error" ? "#ef4444" : "#ffffff"}
          />
          <Text
            className={`ml-3 font-bold ${type === "error" ? "text-red-600" : "text-white"}`}
          >
            {message}
          </Text>
        </View>
      </Animated.View>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 9999,
  },
});
