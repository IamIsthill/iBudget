import {
  Pressable,
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, PropsWithChildren, useState } from "react";

export function ModalBackdrop({
  onPress,
  visible,
}: {
  onPress?: () => void;
  visible: boolean;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 0.5 : 0, // Fade in to 0.5, fade out to 0
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]); // Runs whenever visibility changes

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"} // Prevent taps while fading out
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: "black", opacity: fadeAnim },
      ]}
    >
      <Pressable style={{ flex: 1 }} onPress={onPress} />
    </Animated.View>
  );
}

export function ModalContent({ children }: PropsWithChildren) {
  return (
    <View className="bg-white rounded-xl p-5 w-full max-w-md">{children}</View>
  );
}

type CustomModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function CustomModal({ visible, onClose, children }: CustomModalProps) {
  // This state keeps the Modal alive during the exit animation
  const [shouldRender, setShouldRender] = React.useState(visible);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 30,
        friction: 8,
      }).start();
    } else {
      // Start exit animation
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false); // FINALLY unmount after animation finishes
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <Modal
      visible={true}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Pass the 'visible' boolean so it knows to fade out */}
        <ModalBackdrop visible={visible} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View
            style={{ transform: [{ translateY: slideAnim }] }}
            className="bg-white rounded-t-[32px] p-6 pb-12"
          >
            <View className="items-center mb-4">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </View>
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
