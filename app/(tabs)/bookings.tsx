import { Ionicons } from "@expo/vector-icons";
import { Calendar, MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Booking {
  id: string;
  listing: {
    id: string;
    title: string;
    location: string;
    image: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      // Replace with your API call
      // const data = await getUserBookings(userId, token);

      // Mock data
      const mockData: Booking[] = [
        {
          id: "1",
          listing: {
            id: "1",
            title: "Luxury Beach Villa",
            location: "Malibu, CA",
            image:
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
          },
          checkIn: "2024-02-15",
          checkOut: "2024-02-20",
          guests: 4,
          totalPrice: 2250,
          status: "confirmed",
        },
      ];

      setBookings(mockData);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.checkIn) >= new Date()
  );

  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || new Date(b.checkOut) < new Date()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      className="bg-white mx-4 mb-4 rounded-2xl overflow-hidden shadow-md"
    >
      <Image
        source={{ uri: item.listing.image }}
        className="w-full h-40"
        resizeMode="cover"
      />

      <View className="p-4">
        <View className="flex-row justify-between items-start mb-3">
          <Text
            className="text-lg font-bold text-gray-900 flex-1"
            numberOfLines={1}
          >
            {item.listing.title}
          </Text>
          <View
            className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}
          >
            <Text className="text-xs font-semibold capitalize">
              {item.status}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-2">
          <MapPin size={16} color="#6B7280" />
          <Text className="text-gray-600 ml-1.5 text-sm">
            {item.listing.location}
          </Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Calendar size={16} color="#6B7280" />
          <Text className="text-gray-600 ml-1.5 text-sm">
            {new Date(item.checkIn).toLocaleDateString()} -{" "}
            {new Date(item.checkOut).toLocaleDateString()}
          </Text>
        </View>

        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
          <View>
            <Text className="text-gray-500 text-xs">Total Price</Text>
            <Text className="text-xl font-bold text-gray-900">
              ${item.totalPrice}
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 text-xs">Guests</Text>
            <Text className="text-base font-semibold text-gray-900">
              {item.guests}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5A5F" />
      </SafeAreaView>
    );
  }

  const currentData =
    activeTab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900 mb-4">My Trips</Text>

        {/* Tabs */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setActiveTab("upcoming")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "upcoming" ? "bg-red-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "upcoming" ? "text-white" : "text-gray-700"
              }`}
            >
              Upcoming ({upcomingBookings.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("past")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "past" ? "bg-red-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "past" ? "text-white" : "text-gray-700"
              }`}
            >
              Past ({pastBookings.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {currentData.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="calendar-outline" size={80} color="#D1D5DB" />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            No {activeTab} trips
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            {activeTab === "upcoming"
              ? "Start planning your next adventure"
              : "Your completed trips will appear here"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
