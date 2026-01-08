import { View, Text, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { formatPeso } from "../utils";
import { useTransactionContext } from "../context/TransactionContext";
import { KeypadArea } from "./KeypadArea";
import { MetadataSelectors } from "./MetadataSelectors";
import { Ionicons } from "@expo/vector-icons";
import { SaveButton } from "./SaveButton";

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

      {/* Subtle Hint */}
      <View className="flex-row items-center opacity-20">
        <Text className="text-[10px] font-bold tracking-widest mr-2">
          MORE DETAILS
        </Text>
        <Ionicons name="arrow-forward" size={12} color="#000" />
      </View>
    </View>
  );
}

export function CreateTransactionScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={[]}>
      <View className="py-4 ">
        <DisplayArea />
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        snapToInterval={width}
        decelerationRate="fast"
        className="flex-1"
      >
        <View style={{ width }}>
          <View className="flex-1 justify-end pb-2 ">
            <View className="px-6 mb-6">
              <TransactionTypeSelector />
            </View>
            <MetadataSelectors />
            <KeypadArea />
          </View>
        </View>
        {/* PAGE 2: THE DETAILS */}
        <View style={{ width }} className="flex-1">
          <Text className="text-3xl">This is page 2</Text>
        </View>
      </ScrollView>
      <View className="px-6 pb-10">
        <SaveButton />
      </View>
    </SafeAreaView>
  );
}
