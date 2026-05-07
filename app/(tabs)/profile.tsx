import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

interface MenuItem {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out from your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ],
    );
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.label}
      onPress={item.onPress}
      className="flex-row items-center px-4 py-4"
    >
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${item.danger ? "bg-red-50" : "bg-gray-50"}`}
      >
        <Ionicons
          name={item.icon as any}
          size={20}
          color={item.danger ? "#EF4444" : "#3D2117"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-sm font-bold ${item.danger ? "text-red-500" : "text-[#1A202C]"}`}
        >
          {item.label}
        </Text>
        {item.subtitle && (
          <Text className="text-[10px] text-gray-400 mt-0.5">
            {item.subtitle}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color="#E2E8F0" />
    </TouchableOpacity>
  );

  // NOT LOGGED IN VIEW
  // REDIRECT TO LOGIN IF NOT LOGGED IN
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/(auth)/login");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#FF8A00" />
      </View>
    );
  }

  // LOGGED IN VIEW
  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Top Bar */}
          <View className="px-6 py-4 flex-row justify-between items-center">
            <Text className="text-2xl font-black text-[#3D2117]">
              My Account
            </Text>
            <TouchableOpacity className="w-10 h-10 bg-white border border-gray-100 rounded-full items-center justify-center">
              <Ionicons name="settings-outline" size={20} color="#3D2117" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View className="mx-6 mt-4 bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 items-center">
            <View className="w-20 h-20 bg-[#FF8A00] rounded-full items-center justify-center shadow-lg mb-4">
              <Text className="text-white text-3xl font-black">{initials}</Text>
              <TouchableOpacity className="absolute bottom-0 right-0 w-7 h-7 bg-[#3D2117] rounded-full border-2 border-white items-center justify-center">
                <Ionicons name="camera" size={14} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-xl font-bold text-[#3D2117]">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">{user?.email}</Text>
            <View className="flex-row mt-6 w-full border-t border-gray-50 pt-6">
              <View className="flex-1 items-center border-r border-gray-50">
                <Text className="text-lg font-black text-[#3D2117]">12</Text>
                <Text className="text-[10px] text-gray-400 uppercase font-bold">
                  Bookings
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-lg font-black text-[#3D2117]">450</Text>
                <Text className="text-[10px] text-gray-400 uppercase font-bold">
                  Points
                </Text>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View className="mt-8 px-6">
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4 ml-2">
              Personal Settings
            </Text>
            <View className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
              {renderMenuItem({
                icon: "person-outline",
                label: "Edit Profile",
                onPress: () => {},
              })}
              {renderMenuItem({
                icon: "card-outline",
                label: "Payment Methods",
                onPress: () => {},
              })}
              {renderMenuItem({
                icon: "notifications-outline",
                label: "Notification Center",
                onPress: () => {},
              })}
            </View>
          </View>

          {/* General Section */}
          <View className="mt-8 px-6">
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4 ml-2">
              General
            </Text>
            <View className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
              {renderMenuItem({
                icon: "help-circle-outline",
                label: "Support Hub",
                onPress: () => {},
              })}
              {renderMenuItem({
                icon: "shield-checkmark-outline",
                label: "Security & Privacy",
                onPress: () => {},
              })}
              {renderMenuItem({
                icon: "log-out-outline",
                label: "Sign Out",
                danger: true,
                onPress: handleLogout,
              })}
            </View>
          </View>

          <Text className="text-center text-gray-300 text-[10px] mt-10">
            Anli Experience v1.0.2
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
