import { Pressable, Text, TextInput, View } from "react-native";
import { useTransactionContext } from "../context/TransactionContext";
import { Ionicons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { DateUtil } from "../utils";

export function TransactionDetailPage() {
  const { draft, changeNote, changeDate } = useTransactionContext();

  const handleDatePick = () => {
    DateTimePickerAndroid.open({
      value: new Date(draft.date),
      mode: "date",
      display: "calendar",
      onChange: (event, date) => {
        if (event.type === "set" && date) {
          const newDate = DateUtil.changeDateAndPreserveTime(
            draft.date,
            date.getTime()
          );
          changeDate(newDate);
        }
      },
    });
  };

  const handleTimePick = () => {
    DateTimePickerAndroid.open({
      value: new Date(draft.date),
      mode: "time",
      is24Hour: false,
      onChange: (event, date) => {
        if (event.type === "set" && date) {
          const newDate = DateUtil.changeTimeAndPreserveDate(
            draft.date,
            date.getTime()
          );
          changeDate(newDate);
        }
      },
    });
  };

  return (
    <View className="gap-8">
      {/* 1. Note Section */}
      <View>
        <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-3 ml-1">
          Description
        </Text>
        <View className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 min-h-[140px]">
          <TextInput
            multiline
            placeholder="What was this for?"
            placeholderTextColor="#9ca3af"
            className="text-lg text-gray-900 leading-6"
            value={draft.description || ""}
            onChangeText={changeNote}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* 2. Date & Time Twin Selectors */}
      <View>
        <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-3 ml-1">
          When did the transaction occured?
        </Text>
        <View className="flex-row gap-3">
          {/* Date Picker Button */}
          <Pressable
            onPress={handleDatePick}
            className="flex-1 flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 active:bg-gray-100"
          >
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={18} color="#2563eb" />
              <Text className="text-gray-900 font-semibold ml-2 text-[15px]">
                {DateUtil.formatDate(draft.date)}
              </Text>
            </View>
          </Pressable>

          {/* Time Picker Button */}
          <Pressable
            onPress={handleTimePick}
            className="flex-1 flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 active:bg-gray-100"
          >
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#2563eb" />
              <Text className="text-gray-900 font-semibold ml-2 text-[15px]">
                {DateUtil.formatTime(draft.date)}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
