import { Necessity } from "@/src/db/schema";
import { FormChip } from "./FormChip";
import { CustomModal } from "@/src/shared/components/Modal";
import { useState } from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  necessity: string | Necessity;
  onSelect: (level: string) => void; // Added onSelect
};

const necessityLevels = ["Must", "Needs", "Wants"];

export function ListNecessityLevelsModal({ necessity, onSelect }: Props) {
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (level: string) => {
    onSelect(level.toLocaleLowerCase());
    setShowModal(false);
  };

  return (
    <>
      <FormChip
        label="Necessity"
        value={necessity}
        icon="shield-checkmark-outline"
        onPress={() => setShowModal(true)}
      />
      <CustomModal onClose={() => setShowModal(false)} visible={showModal}>
        <View className="px-2">
          <View className="items-center">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Select Necessity
            </Text>
            <Text className="text-gray-400 mb-8 text-base text-center">
              Choose the correct necessity level for this transaction
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {necessityLevels.map((level, index) => {
              const isSelected = necessity === level;
              return (
                <View key={level}>
                  <Pressable
                    onPress={() => handleSelect(level)}
                    className="flex-row items-center justify-between py-5 active:opacity-50"
                  >
                    <Text
                      className={`text-lg ${
                        isSelected
                          ? "font-bold text-blue-600"
                          : "font-medium text-gray-800"
                      }`}
                    >
                      {level}
                    </Text>

                    {isSelected && (
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#2563eb"
                      />
                    )}
                  </Pressable>

                  {/* Divider - Minimalist Standard */}
                  {index !== necessityLevels.length - 1 && (
                    <View className="h-[1px] bg-gray-50 w-full" />
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Close Button - Minimalist Standard */}
          <Pressable
            onPress={() => setShowModal(false)}
            className="mt-6 bg-gray-900 py-4 rounded-2xl items-center"
          >
            <Text className="text-white font-bold text-lg">Close</Text>
          </Pressable>
        </View>
      </CustomModal>
    </>
  );
}
