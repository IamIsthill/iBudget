import {
  View,
  Text,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { formatPeso } from "../utils";
import { useTransactionContext } from "../context/TransactionContext";
import { KeypadArea } from "./KeypadArea";
import { MetadataSelectors } from "./MetadataSelectors";
import { SaveButton } from "./SaveButton";
import { TransactionDetailPage } from "./TransactionDetailPage";
import { useEffect, useState } from "react";
import { PageIndicator } from "./PageIndicator";

const { width } = Dimensions.get("window");

export function DisplayArea() {
  const { draft } = useTransactionContext();

  return (
    <View className="items-center px-6 gap-6">
      <View className="items-center gap-4">
        <Text className="text-gray-400 font-medium uppercase tracking-widest">
          {draft.type} Amount
        </Text>
        <View className="flex-row items-baseline">
          <Text className="text-4xl font-bold text-blue-600 mr-2">₱</Text>
          <Text className="text-6xl font-bold text-gray-900 tracking-tighter">
            {formatPeso(draft.amount)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function CreateTransactionScreen() {
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (pageIndex === 0) {
      Keyboard.dismiss();
    }
  }, [pageIndex]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={[]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={180}
      >
        <View className="py-4">
          <DisplayArea />
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          snapToInterval={width}
          decelerationRate="fast"
          className="flex-1"
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onMomentumScrollEnd={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / width);
            setPageIndex(index);
          }}
        >
          <View style={{ width }} className="flex-1 justify-end pb-2 ">
            <View className="px-6 mb-6">
              <TransactionTypeSelector />
            </View>
            <MetadataSelectors />
            <KeypadArea />
          </View>
          <View style={{ width }} className="flex-1">
            <View className="flex-1 px-6 pt-4">
              <TransactionDetailPage />
            </View>
          </View>
        </ScrollView>
        <View className="px-6 pb-10">
          <PageIndicator activeIndex={pageIndex} />
          <SaveButton />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
