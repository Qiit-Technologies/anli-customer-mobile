import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth";

export default function SecurityScreen() {
  const router = useRouter();
  const auth = useAuth();
  const { showToast } = useToast();

  const [security, setSecurity] = useState({
    twoFactor: auth.user?.securitySettings?.twoFactor ?? false,
    biometrics: auth.user?.securitySettings?.biometrics ?? true,
    privacy: auth.user?.securitySettings?.privacy ?? true,
  });

  // Password Modal State
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const toggleSwitch = async (key: keyof typeof security) => {
    const newValue = !security[key];
    const updatedSettings = { ...security, [key]: newValue };
    setSecurity(updatedSettings);

    try {
      await authService.updateProfile({
        securitySettings: updatedSettings,
      });
      await auth.refreshAuth();
      showToast({ message: "Security setting updated", type: "success" });
    } catch (error: any) {
      showToast({ message: "Failed to update setting", type: "error" });
      setSecurity(security);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast({ message: "Please fill all password fields", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ message: "New passwords do not match", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      showToast({
        message: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    setSubmittingPassword(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      showToast({ message: "Password updated successfully", type: "success" });
      setIsPasswordModalVisible(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      showToast({
        message: error?.message || "Failed to change password",
        type: "error",
      });
    } finally {
      setSubmittingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. All your bookings and data will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.deleteAccount();
              showToast({ message: "Account deleted", type: "info" });
              router.replace("/(auth)/login");
            } catch (error: any) {
              showToast({ message: "Failed to delete account", type: "error" });
            }
          },
        },
      ],
    );
  };

  const renderOption = (
    label: string,
    icon: string,
    onPress: () => void,
    danger = false,
  ) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-6 py-5 bg-white border-b border-gray-50"
    >
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${danger ? "bg-red-50" : "bg-gray-50"}`}
      >
        <Ionicons
          name={icon as any}
          size={20}
          color={danger ? "#EF4444" : "#3D2117"}
        />
      </View>
      <Text
        className={`flex-1 text-base font-bold ${danger ? "text-red-500" : "text-[#3D2117]"}`}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={danger ? "#EF4444" : "#E2E8F0"}
      />
    </TouchableOpacity>
  );

  const renderToggle = (
    label: string,
    value: boolean,
    onToggle: () => void,
    icon: string,
  ) => (
    <View className="flex-row items-center px-6 py-5 bg-white border-b border-gray-50">
      <View className="w-10 h-10 rounded-xl bg-gray-50 items-center justify-center mr-4">
        <Ionicons name={icon as any} size={20} color="#3D2117" />
      </View>
      <Text className="flex-1 text-base font-bold text-[#3D2117]">{label}</Text>
      <Switch
        trackColor={{ false: "#E2E8F0", true: "#007AFF" }}
        thumbColor={
          Platform.OS === "ios" ? "#FFFFFF" : value ? "#FFFFFF" : "#f4f3f4"
        }
        ios_backgroundColor="#E2E8F0"
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white flex-row items-center justify-between border-b border-gray-50">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <Ionicons name="chevron-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#3D2117]">
          Security & Privacy
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-8 px-6 mb-4">
          <Text className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-[2px]">
            Account Security
          </Text>
        </View>
        <View className="overflow-hidden bg-white">
          {renderOption("Change Password", "lock-closed-outline", () =>
            setIsPasswordModalVisible(true),
          )}
          {renderToggle(
            "Two-Factor Authentication",
            security.twoFactor,
            () => toggleSwitch("twoFactor"),
            "shield-checkmark-outline",
          )}
          {renderToggle(
            "Biometric Authentication",
            security.biometrics,
            () => toggleSwitch("biometrics"),
            "finger-print-outline",
          )}
        </View>

        <View className="mt-8 px-6 mb-4">
          <Text className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-[2px]">
            Privacy Settings
          </Text>
        </View>
        <View className="overflow-hidden bg-white">
          {renderToggle(
            "Private Profile",
            security.privacy,
            () => toggleSwitch("privacy"),
            "eye-off-outline",
          )}
          {renderOption("Clear Search History", "trash-outline", () =>
            showToast({ message: "History cleared", type: "success" }),
          )}
        </View>

        <View className="mt-8 px-6 mb-4">
          <Text className="text-[11px] font-bold text-red-400 uppercase tracking-[2px]">
            Danger Zone
          </Text>
        </View>
        <View className="overflow-hidden bg-white">
          {renderOption(
            "Delete Account",
            "alert-circle-outline",
            handleDeleteAccount,
            true,
          )}
        </View>

        <View className="p-10">
          <Text className="text-center text-[#CBD5E0] text-[11px] font-medium leading-4">
            Security is our priority. Your data is encrypted and stored
            according to industry standards.
          </Text>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={isPasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end bg-black/50"
        >
          <View className="bg-white rounded-t-[40px] p-8">
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-bold text-[#3D2117]">
                Change Password
              </Text>
              <TouchableOpacity
                onPress={() => setIsPasswordModalVisible(false)}
              >
                <Ionicons name="close" size={28} color="#3D2117" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-bold text-[#3D2117] mb-2 ml-1">
                Current Password
              </Text>
              <TextInput
                secureTextEntry
                placeholder="••••••••"
                value={oldPassword}
                onChangeText={setOldPassword}
                className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-base"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-bold text-[#3D2117] mb-2 ml-1">
                New Password
              </Text>
              <TextInput
                secureTextEntry
                placeholder="••••••••"
                value={newPassword}
                onChangeText={setNewPassword}
                className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-base"
              />
            </View>

            <View className="mb-8">
              <Text className="text-sm font-bold text-[#3D2117] mb-2 ml-1">
                Confirm New Password
              </Text>
              <TextInput
                secureTextEntry
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-base"
              />
            </View>

            <TouchableOpacity
              onPress={handleChangePassword}
              disabled={submittingPassword}
              className={`py-5 rounded-2xl  items-center shadow-sm ${submittingPassword ? "bg-gray-200" : "bg-[#007AFF]"}`}
            >
              {submittingPassword ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white  font-bold  text-lg">
                  Update Password
                </Text>
              )}
            </TouchableOpacity>

            <View className="h-4" />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
