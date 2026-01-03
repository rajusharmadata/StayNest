import React from "react";
import { Text, View } from "react-native";

export default function Settings() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg font-bold">Settings Screen</Text>
      <View>
        <Text className="text-gray-600 mt-2">
          Manage your app settings here.
        </Text>
      </View>
    </View>
  );
}
