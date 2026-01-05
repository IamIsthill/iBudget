import { PropsWithChildren } from "react";
import { Pressable, View } from "react-native";

export function ModalBackdrop({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable className="absolute inset-0 bg-black/50" onPress={onPress} />
  );
}

export function ModalContent({ children }: PropsWithChildren) {
  return (
    <View className="bg-white rounded-xl p-5 w-full max-w-md">{children}</View>
  );
}
