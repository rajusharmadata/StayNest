import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function Messages() {
  const [messages] = useState<Message[]>([
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      lastMessage: "Hi! Is the property still available for next weekend?",
      timestamp: "2h ago",
      unread: true,
    },
    {
      id: "2",
      user: {
        name: "Michael Chen",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      lastMessage: "Thank you for your stay! Hope you enjoyed it.",
      timestamp: "1d ago",
      unread: false,
    },
  ]);

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`flex-row items-center px-4 py-4 border-b border-gray-100 ${
        item.unread ? "bg-blue-50" : "bg-white"
      }`}
    >
      <View className="relative">
        <Image
          source={{ uri: item.user.avatar }}
          className="w-14 h-14 rounded-full"
        />
        {item.unread && (
          <View className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
        )}
      </View>

      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-semibold text-gray-900">
            {item.user.name}
          </Text>
          <Text className="text-xs text-gray-500">{item.timestamp}</Text>
        </View>
        <Text
          className={`text-sm ${
            item.unread ? "text-gray-900 font-medium" : "text-gray-600"
          }`}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Messages</Text>
      </View>

      {messages.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="chatbubbles-outline" size={80} color="#D1D5DB" />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            No messages yet
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Your conversations with hosts will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
