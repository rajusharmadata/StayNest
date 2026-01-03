import { useMenu } from "@/context/MenuContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  const { toggleMenu } = useMenu();

  return (
    <View
      className="bg-white border-b border-gray-100"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="px-4 py-3 flex-row items-center justify-between">
        {/* Left: Menu Button */}
        <TouchableOpacity
          onPress={toggleMenu}
          activeOpacity={0.7}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <Ionicons name="menu" size={24} color="#374151" />
        </TouchableOpacity>

        {/* Center: Logo */}
        <View className="absolute left-0 right-0 items-center pointer-events-none">
          <View className="flex-row items-center">
            <Ionicons name="home" size={24} color="#FF5A5F" />
            <Text className="text-2xl font-bold ml-2">
              <Text className="text-red-500"> Stay</Text>
              <Text className="text-gray-800">Nest</Text>
            </Text>
          </View>
        </View>

        {/* Right: Actions */}
        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          >
            <Ionicons name="search" size={20} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 ml-2"
          >
            <Ionicons name="heart-outline" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
