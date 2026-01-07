import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { memo } from "react";

export const FloatingAddButton = memo(function FloatingAddButton() {
  const handlePress = () => {
    router.push("/transactions/add");
  };

  return (
    <Pressable
      onPress={handlePress}
      className="absolute -top-6 items-center justify-center"
    >
      <View className="bg-blue-500 rounded-full h-14 w-14 items-center justify-center">
        <Ionicons name="add" size={40} color="white" />
      </View>
    </Pressable>
  );
});
