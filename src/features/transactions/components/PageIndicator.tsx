import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";

interface PageIndicatorProps {
  activeIndex: number;
}

export function PageIndicator({ activeIndex }: PageIndicatorProps) {
  // 0 represents Page 1, 1 represents Page 2
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scrollAnim, {
      toValue: activeIndex,
      useNativeDriver: false, // Width and Color cannot use native driver
      friction: 8,
      tension: 50,
    }).start();
  }, [activeIndex]);

  // Interpolate width: when index is 0, dot 1 is 24px. When index is 1, it's 6px.
  const dot1Width = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 6],
  });

  const dot2Width = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 24],
  });

  // Interpolate color: when index is 0, dot 1 is blue. When index is 1, it's gray.
  const dot1Color = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#2563eb", "#e5e7eb"],
  });

  const dot2Color = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e5e7eb", "#2563eb"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.dot, { width: dot1Width, backgroundColor: dot1Color }]}
      />
      <Animated.View
        style={[styles.dot, { width: dot2Width, backgroundColor: dot2Color }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
