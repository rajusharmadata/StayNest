import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View className="bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-sm">
          <Text className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-500 uppercase">
            Notifications
          </Text>

          <View className="flex-row items-center justify-between px-4 py-4 border-t border-gray-100">
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Push Notifications
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                Receive push notifications
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#D1D5DB", true: "#FF5A5F" }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between px-4 py-4 border-t border-gray-100">
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Email Notifications
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                Receive email updates
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: "#D1D5DB", true: "#FF5A5F" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Preferences */}
        <View className="bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-sm">
          <Text className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-500 uppercase">
            Preferences
          </Text>

          <View className="flex-row items-center justify-between px-4 py-4 border-t border-gray-100">
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Dark Mode
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                Enable dark theme
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#D1D5DB", true: "#FF5A5F" }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between px-4 py-4 border-t border-gray-100">
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Location Services
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                Allow location access
              </Text>
            </View>
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{ false: "#D1D5DB", true: "#FF5A5F" }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
