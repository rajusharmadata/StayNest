import Categories from "@/components/categary";
import Header from "@/components/Heder";
import ListingCards from "@/components/listingcards";
import React, { useState } from "react";
import { Platform, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const ListingCardsAny = ListingCards as any;

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={Platform.OS === "android"}
      />

      <Header />
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <View className="flex-1">
        <ListingCardsAny selectedCategory={selectedCategory} />
      </View>
    </SafeAreaView>
  );
}
