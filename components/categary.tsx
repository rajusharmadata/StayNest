import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Category {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const categories: Category[] = [
  { id: "all", label: "All", icon: "apps" },
  { id: "beach", label: "Beach", icon: "water" },
  { id: "mountain", label: "Mountain", icon: "snow" },
  { id: "city", label: "City", icon: "business" },
  { id: "luxury", label: "Luxury", icon: "diamond" },
  { id: "trending", label: "Trending", icon: "trending-up" },
];

interface CategoriesProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function Categories({
  selectedCategory,
  onSelectCategory,
}: CategoriesProps) {
  return (
    <View className="bg-white border-b border-gray-100">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 12,
        }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => onSelectCategory(category.id)}
              activeOpacity={0.7}
              className={`flex-row items-center px-4 py-2.5 rounded-full border ${
                isSelected
                  ? "bg-gray-900 border-gray-900"
                  : "bg-white border-gray-200"
              }`}
              style={{
                shadowColor: isSelected ? "#000" : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.1 : 0,
                shadowRadius: 4,
                elevation: isSelected ? 2 : 0,
              }}
            >
              <Ionicons
                name={category.icon}
                size={18}
                color={isSelected ? "#fff" : "#6B7280"}
              />
              <Text
                className={`ml-2 font-medium ${
                  isSelected ? "text-white" : "text-gray-700"
                }`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
