import { getListingById } from "@/api/Listings";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Heart, Home, MapPin, Star, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface PropertyDetails {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  guests?: number;
  amenities?: string[];
  host?: {
    name: string;
    verified?: boolean;
  };
}

export default function PropertyDetail() {
  const params = useLocalSearchParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadPropertyDetails();
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      setLoading(true);

      // Mock data - Replace with your API call
      const mockData = (await getListingById(propertyId)) as PropertyDetails;

      setProperty(mockData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!property) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Property not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const images = property.images || [property.image];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* Image Gallery */}
      <View style={{ height: height * 0.4 }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setSelectedImageIndex(index);
          }}
        >
          {images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={{ width, height: height * 0.4 }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Back & Favorite Buttons */}
        <SafeAreaView
          edges={["top"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        >
          <View className="flex-row justify-between px-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/90 rounded-full p-2"
              activeOpacity={0.7}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsFavorited(!isFavorited)}
              className="bg-white/90 rounded-full p-2"
              activeOpacity={0.7}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Heart
                size={24}
                color={isFavorited ? "#EF4444" : "#000"}
                fill={isFavorited ? "#EF4444" : "transparent"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Image Indicators */}
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
          {images.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === selectedImageIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50"
              }`}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Title & Rating */}
          <View className="mb-4">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {property.title}
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <MapPin size={18} color="#6B7280" />
                <Text className="text-gray-600 ml-1 flex-1" numberOfLines={1}>
                  {property.location}
                </Text>
              </View>
              {property.rating && (
                <View className="flex-row items-center ml-2">
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text className="ml-1 font-semibold text-gray-900">
                    {property.rating}
                  </Text>
                  <Text className="text-gray-500 ml-1">
                    ({property.reviews})
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Property Info */}
          <View className="flex-row justify-between py-4 border-t border-b border-gray-200 mb-4">
            <View className="items-center flex-1">
              <Home size={24} color="#3B82F6" />
              <Text className="text-gray-600 text-sm mt-1">
                {property.bedrooms} Beds
              </Text>
            </View>
            <View className="items-center flex-1">
              <Ionicons name="water" size={24} color="#3B82F6" />
              <Text className="text-gray-600 text-sm mt-1">
                {property.bathrooms} Baths
              </Text>
            </View>
            <View className="items-center flex-1">
              <Users size={24} color="#3B82F6" />
              <Text className="text-gray-600 text-sm mt-1">
                {property.guests} Guests
              </Text>
            </View>
          </View>

          {/* Host Info */}
          {property.host && (
            <View className="flex-row items-center py-4 border-b border-gray-200 mb-4">
              <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
                <Text className="text-white font-bold text-lg">
                  {property.host.name.charAt(0)}
                </Text>
              </View>
              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text className="text-gray-900 font-semibold">
                    Hosted by {property.host.name}
                  </Text>
                  {property.host.verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#3B82F6"
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
                <Text className="text-gray-500 text-sm">Superhost</Text>
              </View>
            </View>
          )}

          {/* Description */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              About this place
            </Text>
            <Text className="text-gray-600 leading-6">
              {property.description}
            </Text>
          </View>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Amenities
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <View
                    key={index}
                    className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full"
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10B981"
                    />
                    <Text className="text-gray-700 ml-2 text-sm">
                      {amenity}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Add some bottom padding */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <SafeAreaView
        edges={["bottom"]}
        className="bg-white border-t border-gray-200"
      >
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                ${property.price}
                <Text className="text-base font-normal text-gray-600">
                  {" "}
                  / night
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              className="bg-red-500 px-8 py-3 rounded-xl"
              activeOpacity={0.8}
              style={{
                shadowColor: "#EF4444",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text className="text-white font-bold text-lg">Reserve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
