import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 pt-10"
        >
          <View className="mb-10">
            <Text className="text-4xl font-bold text-[#3D2117] mb-2">
              Create Account
            </Text>
            <Text className="text-[#8E9BAE] text-base">
              To Get started, Sign in into your account
            </Text>
          </View>

          <View className="space-y-6">
            {/* Email Field */}
            <View className="mb-6">
              <Text className="text-[#8E9BAE] text-sm font-medium mb-2">
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter Email address"
                placeholderTextColor="#A0AEC0"
                className="w-full border border-[#E2E8F0] py-4 px-4 rounded-2xl text-base text-gray-800"
              />
            </View>

            {/* Phone Number Field */}
            <View className="mb-6">
              <Text className="text-[#1A202C] text-sm font-semibold mb-2">
                Phone Number
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity className="flex-row items-center border border-[#E2E8F0] py-4 px-3 rounded-2xl mr-3">
                  <Text className="text-[#1A202C] text-base">+234</Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color="#1A202C"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter Phone Number"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="phone-pad"
                  className="flex-1 border border-[#E2E8F0] py-4 px-4 rounded-2xl text-base text-gray-800"
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-2">
              <Text className="text-[#8E9BAE] text-sm font-medium mb-2">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter Password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
                className="w-full border border-[#E2E8F0] py-4 px-4 rounded-2xl text-base text-gray-800"
              />
            </View>
            <Text className="text-[#8E9BAE] text-xs mb-8">
              Must be up to 8 character
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/signup/verify")}
            className="w-full bg-[#007AFF] py-5 rounded-2xl items-center mb-10 shadow-sm"
          >
            <Text className="text-white text-lg font-bold">Signup</Text>
          </TouchableOpacity>

          <View className="items-center mb-8">
            <Text className="text-[#4A5568] text-sm">or Login with</Text>
          </View>

          {/* Social Logins */}
          <View className="space-y-4 mb-10">
            <TouchableOpacity className="w-full border border-[#FF8A00] py-4 rounded-2xl items-center mb-4">
              <Text className="text-[#1A202C] text-base font-medium">
                Continue with Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-full border border-[#FF8A00] py-4 rounded-2xl items-center">
              <Text className="text-[#1A202C] text-base font-medium">
                Continue with Facebook
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center mb-10">
            <Text className="text-[#1A202C] text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-[#FF8A00] text-sm font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
