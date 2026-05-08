import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth";
import { reservationService } from "../../services/reservation";
import { useToast } from "../../context/ToastContext";

const { height } = Dimensions.get("window");

interface MenuItem {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const auth = useAuth();
  const { showToast } = useToast();
  
  const [bookingCount, setBookingCount] = useState(0);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  
  // Edit Profile fields
  const [firstName, setFirstName] = useState(auth.user?.firstName || "");
  const [lastName, setLastName] = useState(auth.user?.lastName || "");
  const [phone, setPhone] = useState(auth.user?.phoneNumber || "");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (auth.user?.id) {
      reservationService.getByCustomerId(auth.user.id)
        .then(res => setBookingCount(res.length))
        .catch(err => console.error("Error fetching bookings count:", err));
    }
  }, [auth.user?.id]);

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
            await auth.logout();
            router.replace("/(auth)/login");
          },
        },
      ],
    );
  };

  const handleUpdateProfile = async () => {
    if (!firstName || !lastName) {
      showToast({ message: "Name fields cannot be empty", type: "error" });
      return;
    }
    
    setUpdating(true);
    try {
      await authService.updateProfile({
        firstName,
        lastName,
        phoneNumber: phone,
      });
      
      // Sync global auth state
      await auth.refreshAuth();
      
      showToast({ message: "Profile updated successfully!", type: "success" });
      setEditModalVisible(false);
    } catch (error: any) {
      showToast({ message: error?.message || "Failed to update profile", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const initials = auth.user
    ? `${auth.user.firstName?.[0] ?? ""}${auth.user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.label}
      onPress={item.onPress}
      className="flex-row items-center px-6 py-5 border-b border-gray-50"
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
          <Text className="text-[10px] text-gray-400 mt-0.5 font-medium">
            {item.subtitle}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color="#E2E8F0" />
    </TouchableOpacity>
  );

  // REDIRECT TO LOGIN IF NOT LOGGED IN
  useEffect(() => {
    if (auth && !auth.isLoading && !auth.isLoggedIn) {
      router.replace("/(auth)/login");
    }
  }, [auth?.isLoggedIn, auth?.isLoading]);

  if (!auth || auth.isLoading || !auth.isLoggedIn) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#FF8A00" />
      </View>
    );
  }

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
            <Text className="text-2xl font-bold text-[#3D2117]">
              My Account
            </Text>
            <TouchableOpacity 
              onPress={() => setEditModalVisible(true)}
              className="w-10 h-10 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm"
            >
              <Ionicons name="settings-outline" size={20} color="#3D2117" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View className="mx-6 mt-4 bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 items-center">
            <View className="w-24 h-24 bg-[#FF8A00] rounded-full items-center justify-center shadow-lg mb-6">
              <Text className="text-white text-4xl font-bold">{initials}</Text>
              <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-[#3D2117] rounded-full border-2 border-white items-center justify-center">
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold text-[#3D2117]">
              {auth.user?.firstName} {auth.user?.lastName}
            </Text>
            <Text className="text-[#8E9BAE] text-sm mt-1 font-medium">{auth.user?.email}</Text>
            
            <View className="flex-row mt-8 w-full border-t border-gray-50 pt-8">
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-[#3D2117]">{bookingCount}</Text>
                <Text className="text-[11px] text-[#8E9BAE] uppercase font-bold tracking-widest mt-1">
                  Bookings
                </Text>
              </View>
              <View className="w-[1px] bg-gray-100 h-10" />
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-[#3D2117]">0</Text>
                <Text className="text-[11px] text-[#8E9BAE] uppercase font-bold tracking-widest mt-1">
                  Orders
                </Text>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View className="mt-8 px-6">
            <Text className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-[2px] mb-4 ml-2">
              Personal Settings
            </Text>
            <View className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
              {renderMenuItem({
                icon: "person-outline",
                label: "Edit Profile",
                onPress: () => setEditModalVisible(true),
              })}
              {renderMenuItem({
                icon: "notifications-outline",
                label: "Notification Center",
                onPress: () => router.push("/profile/notifications"),
              })}
              {renderMenuItem({
                icon: "heart-outline",
                label: "My Favorites",
                onPress: () => router.push("/profile/favorites"),
              })}
            </View>
          </View>

          {/* General Section */}
          <View className="mt-8 px-6">
            <Text className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-[2px] mb-4 ml-2">
              General
            </Text>
            <View className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
              {renderMenuItem({
                icon: "help-circle-outline",
                label: "Support Hub",
                onPress: () => router.push("/profile/support"),
              })}
              {renderMenuItem({
                icon: "shield-checkmark-outline",
                label: "Security & Privacy",
                onPress: () => router.push("/profile/security"),
              })}
              {renderMenuItem({
                icon: "log-out-outline",
                label: "Sign Out",
                danger: true,
                onPress: handleLogout,
              })}
            </View>
          </View>

          <Text className="text-center text-[#CBD5E0] text-[11px] mt-12 font-medium">
            Anli customer v1.0.2
          </Text>
        </ScrollView>
      </SafeAreaView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[40px] px-8 pt-8 pb-10" style={{ maxHeight: height * 0.85 }}>
            <View className="flex-row justify-between items-center mb-8 pb-4 border-b border-gray-50">
              <Text className="text-2xl font-bold text-[#3D2117]">Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={28} color="#8E9BAE" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View className="mb-6">
                  <Text className="text-sm font-bold text-[#3D2117] mb-2 ml-1">First Name</Text>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    className="w-full border border-[#F1F5F9] p-4 rounded-2xl text-gray-800 text-base bg-[#F8FAFC]"
                  />
                </View>
                <View className="mb-6">
                  <Text className="text-sm font-bold text-[#3D2117] mb-2 ml-1">Last Name</Text>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    className="w-full border border-[#F1F5F9] p-4 rounded-2xl text-gray-800 text-base bg-[#F8FAFC]"
                  />
                </View>
                <View className="mb-6">
                  <Text className="text-sm font-bold text-[#3D2117] mb-2 ml-1">Phone Number</Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+234..."
                    keyboardType="phone-pad"
                    className="w-full border border-[#F1F5F9] p-4 rounded-2xl text-gray-800 text-base bg-[#F8FAFC]"
                  />
                </View>
              </KeyboardAvoidingView>
            </ScrollView>

            <TouchableOpacity
              onPress={handleUpdateProfile}
              disabled={updating}
              className={`w-full py-5 rounded-2xl items-center shadow-sm ${updating ? 'bg-blue-300' : 'bg-[#007AFF]'}`}
            >
              {updating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-bold">Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
