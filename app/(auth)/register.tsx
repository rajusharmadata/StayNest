import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const validate = () => {
    if (!username || !email || !password || !confirmPassword) {
      return "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return "";
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!email || !password || !username) {
      Alert.alert("Error", "username , email and  password are required");
      return;
    }

    try {
      // ✅ Just call login
      register(username, email, password);
      console.log("register api is calling .... ");
    } catch (error: any) {
      Alert.alert(
        "register failed",
        error?.message || "Invalid email or password"
      );
    }
    setError("");
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      {/* Title */}
      <View className="mb-8 items-center">
        <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
        <Text className="text-gray-500 mt-2 text-center">
          Sign up to get started
        </Text>
      </View>

      {/* Username */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1 font-medium">Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          autoCapitalize="none"
          className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
        />
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1 font-medium">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
        />
      </View>

      {/* Password */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1 font-medium">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
        />
      </View>

      {/* Confirm Password */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1 font-medium">Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter password"
          secureTextEntry
          className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
        />
      </View>

      {/* Error Message */}
      {error ? (
        <Text className="text-red-500 text-sm mb-3 text-center">{error}</Text>
      ) : null}

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        activeOpacity={0.8}
        className="bg-red-500 rounded-xl py-4 mb-6"
      >
        <Text className="text-white text-center font-semibold text-base">
          Create Account
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-600 text-sm">Already have an account?</Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text className="text-red-500 font-semibold text-sm ml-1">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
