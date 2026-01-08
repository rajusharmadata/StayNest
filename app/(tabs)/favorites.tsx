import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Heart, MapPin, Star } from "lucide-react-native";
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

interface FavoriteListing {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      // Replace with your API call
      // const data = await getUserFavorites(userId, token);

      // Mock data
      const mockData: FavoriteListing[] = [
        {
          id: "1",
          title: "Luxury Beach Villa",
          location: "Malibu, CA",
          price: 450,
          image:
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
          rating: 4.9,
          reviews: 128,
        },
        {
          id: "2",
          title: "Mountain Cabin",
          location: "Aspen, CO",
          price: 320,
          image:
            "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
          rating: 4.8,
          reviews: 95,
        },
      ];

      setFavorites(mockData);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }: { item: FavoriteListing }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({ pathname: "/property-detail", params: { id: item.id } })
      }
      className="bg-white mx-4 mb-4 rounded-2xl overflow-hidden shadow-md"
    >
      <View className="relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <TouchableOpacity
          onPress={() => removeFavorite(item.id)}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full"
          activeOpacity={0.7}
        >
          <Heart size={22} color="#EF4444" fill="#EF4444" />
        </TouchableOpacity>

        {item.rating && (
          <View className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-full flex-row items-center">
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text className="ml-1 font-semibold text-gray-900 text-sm">
              {item.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      <View className="p-4">
        <Text
          className="text-lg font-bold text-gray-900 mb-2"
          numberOfLines={1}
        >
          {item.title}
        </Text>

        <View className="flex-row items-center mb-3">
          <MapPin size={16} color="#6B7280" />
          <Text className="text-gray-600 ml-1.5 text-sm">{item.location}</Text>
        </View>

        <Text className="text-xl font-bold text-gray-900">
          ${item.price}
          <Text className="text-sm font-normal text-gray-600"> / night</Text>
        </Text>
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

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Favorites</Text>
        <Text className="text-gray-600 mt-1">
          {favorites.length}{" "}
          {favorites.length === 1 ? "property" : "properties"}
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="heart-outline" size={80} color="#D1D5DB" />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            No favorites yet
          </Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">
            Start exploring and save your favorite properties
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/home")}
            className="bg-red-500 px-8 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold text-base">
              Explore Properties
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
