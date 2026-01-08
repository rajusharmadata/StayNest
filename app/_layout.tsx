import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MenuProvider } from "@/context/MenuContext";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();
  console.log(isAuthenticated);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // ❌ Not logged in
        <Stack.Screen name="(auth)/login" />
      ) : (
        // ✅ Logged in
        <Stack.Screen name="(tabs)" />
      )}
      {/* Always accessible */}
      <Stack.Screen
        name="property-detail"
        options={{
          presentation: "card",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen name="(screen)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MenuProvider>
        <RootNavigator />
      </MenuProvider>
    </AuthProvider>
  );
}
