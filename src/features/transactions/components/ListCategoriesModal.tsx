import { CustomModal } from "@/src/shared/components/Modal";
import { Category } from "@/src/shared/interfaces";
import { useState } from "react";
import { FormChip } from "./FormChip";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onSelect: (id: string) => void;
  category: Category | null;
  categories: Category[];
  disabled?: boolean;
};

export function ListCategoriesModal({
  category,
  onSelect,
  categories,
  disabled,
}: Props) {
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (id: string) => {
    onSelect(id);
    setShowModal(false);
  };

  if (!category) {
    return (
      <FormChip
        label="Category"
        value="Loading..."
        icon="barcode-outline"
        onPress={() => {}}
        disabled={disabled}
      />
    );
  }

  return (
    <>
      <FormChip
        label="Category"
        value={category.name}
        icon="barcode-sharp"
        onPress={() => setShowModal(true)}
      />
      <CustomModal onClose={() => setShowModal(false)} visible={showModal}>
        <View className="px-2">
          <View className="items-center">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Select Category
            </Text>
            <Text className="text-gray-400 mb-8 text-base text-center">
              Classify this transaction to track your spending
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={true}
            className="max-h-[400px]"
          >
            {categories.map((item, index) => {
              const isSelected = item.id === category.id;
              return (
                <View key={item.id}>
                  <CategoryItem
                    item={item}
                    onSelect={handleSelect}
                    isSelected={isSelected}
                  />

                  {/* Divider - Following your standard */}
                  {index !== categories.length - 1 && (
                    <View className="h-[1px] bg-gray-50 w-full" />
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Close Button - Following your standard */}
          <Pressable
            onPress={() => setShowModal(false)}
            className="mt-6 bg-gray-700 py-4 rounded-2xl items-center"
          >
            <Text className="text-white font-bold text-lg">Close</Text>
          </Pressable>
        </View>
      </CustomModal>
    </>
  );
}

function CategoryItem({
  onSelect,
  item,
  isSelected,
}: {
  item: Category;
  onSelect: (id: string) => void;
  isSelected: boolean;
}) {
  return (
    <Pressable
      onPress={() => onSelect(item.id)}
      className="flex-row items-center justify-between py-5 active:opacity-50"
    >
      <Text
        className={`text-lg ${
          isSelected ? "font-bold text-blue-600" : "font-medium text-gray-800"
        }`}
      >
        {item.name}
      </Text>

      {isSelected && (
        <Ionicons name="chevron-forward" size={18} color="#2563eb" />
      )}
    </Pressable>
  );
}
