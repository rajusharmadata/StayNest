import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, loading } = useAuth();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    try {
      // ✅ Just call login
      await login(email, password);

      // ❌ NO router.replace here
      // RootLayout will switch to (tabs) automatically
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.message || "Invalid email or password"
      );
    }

    isAuthenticated ? router.replace("/(tabs)/home") : null;
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // trigger Google OAuth flow
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      {/* Title */}
      <View className="mb-10 items-center justify-center align-center">
        <Text className="text-3xl font-bold text-gray-900">Welcome Back</Text>
        <Text className="text-gray-500 mt-2 text-center">
          Login to continue
        </Text>
      </View>

      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1 font-medium">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
        />
      </View>

      {/* Password Input */}
      <View className="mb-6">
        <Text className="text-gray-700 mb-1 font-medium">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleEmailLogin}
        activeOpacity={0.8}
        className="bg-red-500 rounded-xl py-4 mb-4"
      >
        <Text className="text-white text-center font-semibold text-base">
          Login
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-3 text-gray-400 text-sm">OR</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Google Login */}
      <TouchableOpacity
        onPress={handleGoogleLogin}
        activeOpacity={0.8}
        className="flex-row items-center justify-center border border-gray-300 rounded-xl py-4 mb-6"
      >
        <Ionicons name="logo-google" size={22} color="#DB4437" />
        <Text className="ml-3 text-base font-semibold text-gray-800">
          Continue with Google
        </Text>
      </TouchableOpacity>

      {/* Register Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-600 text-sm">Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
          <Text className="text-red-500 font-semibold text-sm ml-1">
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
