import { Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";
import "../global.css";

export default function Index() {
  return (
    <View className=" h-full w-full flex-1 justify-center items-center space-y-4">
      <Text className="text-red-600">Welcome to Nativewind!</Text>
      <View>
        <Text className="text-blue-600">
          Click below to navigate to Home Tab
        </Text>
        <TouchableOpacity
          className="bg-green-500 p-4 rounded-md mt-4"
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text className="text-white">Go to Home Tab</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
