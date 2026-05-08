import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { authService } from "../../../services/auth";
import { useToast } from "../../../context/ToastContext";
import * as SecureStore from "expo-secure-store";

const COUNTRY_CODES = [
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+1", name: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
];

export default function SignUpScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignUp = async () => {
    const newErrors: any = {};

    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone) newErrors.phone = "Phone number is required";
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `${countryCode.code}${phone.replace(/^0+/, "")}`;

      await authService.register({
        firstName,
        lastName,
        email,
        phoneNumber: fullPhone,
        password,
      });
      router.push({
        pathname: "/signup/verify",
        params: { email },
      });
    } catch (error: any) {
      showToast({
        message: error?.message || "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <View className="mb-8">
            <Text className="text-4xl font-bold text-[#3D2117] mb-2">
              Create Account
            </Text>
            <Text className="text-[#8E9BAE] text-base">
              To Get started, fill in your details
            </Text>
          </View>

          <View className="space-y-4">
            {/* Name Fields */}
            <View className="flex-row space-x-4 mb-4">
              <View className="flex-1">
                <Text className="text-[#8E9BAE] text-sm font-medium mb-2">
                  First Name
                </Text>
                <View
                  className={`w-full h-[50px] border px-6 rounded-2xl flex-row items-center ${errors.firstName ? "border-red-500 bg-red-50/10" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}
                >
                  <TextInput
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (errors.firstName)
                        setErrors({ ...errors, firstName: null });
                    }}
                    placeholder="John"
                    placeholderTextColor="#A0AEC0"
                    className="flex-1 text-base text-[#1A202C] h-full"
                    style={{ textAlignVertical: "center", paddingVertical: 0 }}
                  />
                </View>
                {errors.firstName && (
                  <Text className="text-red-500 text-[10px] mt-1 ml-1 font-medium">
                    {errors.firstName}
                  </Text>
                )}
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-[#8E9BAE] text-sm font-medium mb-2">
                  Last Name
                </Text>
                <View
                  className={`w-full h-[50px] border px-6 rounded-2xl flex-row items-center ${errors.lastName ? "border-red-500 bg-red-50/10" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}
                >
                  <TextInput
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      if (errors.lastName)
                        setErrors({ ...errors, lastName: null });
                    }}
                    placeholder="Doe"
                    placeholderTextColor="#A0AEC0"
                    className="flex-1 text-base text-[#1A202C] h-full"
                    style={{ textAlignVertical: "center", paddingVertical: 0 }}
                  />
                </View>
                {errors.lastName && (
                  <Text className="text-red-500 text-[10px] mt-1 ml-1 font-medium">
                    {errors.lastName}
                  </Text>
                )}
              </View>
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-[#8E9BAE] text-sm font-medium mb-2">
                Email Address
              </Text>
              <View
                className={`w-full h-[50px] border px-6 rounded-2xl flex-row items-center ${errors.email ? "border-red-500 bg-red-50/10" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}
              >
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="Enter Email address"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 text-base text-[#1A202C] h-full"
                  style={{ textAlignVertical: "center", paddingVertical: 0 }}
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-[10px] mt-1 ml-1 font-medium">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Phone Number Field */}
            <View className="mb-4">
              <Text className="text-[#1A202C] text-sm font-semibold mb-2">
                Phone Number
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => setIsModalVisible(true)}
                  className={`flex-row items-center border py-4 px-3 rounded-2xl mr-3 ${errors.phone ? "border-red-500 bg-red-50/10" : "border-[#E2E8F0]"}`}
                >
                  <Text className="text-[#1A202C] text-base">
                    {countryCode.flag} {countryCode.code}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color="#1A202C"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
                <View
                  className={`flex-1 h-[50px] border px-6 rounded-2xl flex-row items-center ${errors.phone ? "border-red-500 bg-red-50/10" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}
                >
                  <TextInput
                    value={phone}
                    onChangeText={(text) => {
                      setPhone(text);
                      if (errors.phone) setErrors({ ...errors, phone: null });
                    }}
                    placeholder="Enter Phone Number"
                    placeholderTextColor="#A0AEC0"
                    keyboardType="phone-pad"
                    className="flex-1 text-base text-[#1A202C] h-full"
                    style={{ textAlignVertical: "center", paddingVertical: 0 }}
                  />
                </View>
              </View>
              {errors.phone && (
                <Text className="text-red-500 text-[10px] mt-1 ml-1 font-medium">
                  {errors.phone}
                </Text>
              )}
            </View>

            {/* Password Field */}
            <View className="mb-2">
              <Text className="text-[#8E9BAE] text-sm font-medium mb-2">
                Password
              </Text>
              <View
                className={`w-full h-[50px] border px-6 rounded-2xl flex-row items-center ${errors.password ? "border-red-500 bg-red-50/10" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}
              >
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password)
                      setErrors({ ...errors, password: null });
                  }}
                  placeholder="Enter Password"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-base text-[#1A202C]"
                  style={{
                    height: 50,
                    textAlignVertical: "center",
                    paddingVertical: 0,
                    margin: 0,
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-3"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#A0AEC0"
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text className="text-red-500 text-[10px] mt-1 ml-1 font-medium">
                  {errors.password}
                </Text>
              ) : (
                <Text className="text-[#8E9BAE] text-[10px] mt-1 ml-1">
                  Must be at least 8 characters
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            className={`w-full py-5 rounded-2xl items-center mb-8 shadow-sm mt-6 ${loading ? "bg-blue-300" : "bg-[#007AFF]"}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">Signup</Text>
            )}
          </TouchableOpacity>

          <View className="items-center mb-6">
            <Text className="text-[#4A5568] text-sm">or Login with</Text>
          </View>

          {/* Social Logins */}
          <View className="mb-4">
            <TouchableOpacity className="w-full border border-[#FF8A00] py-4 rounded-2xl items-center mb-3">
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

          <View className="flex-row justify-center items-center mb-6">
            <Text className="text-[#1A202C] text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-[#FF8A00] text-sm font-bold">Login</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={async () => {
              await SecureStore.setItemAsync("has_onboarded", "true");
              router.push("/(guest)");
            }}
            className="items-center mb-12"
          >
            <Text className="text-[#007AFF] text-sm font-bold">
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Code Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[40px] p-6 max-h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-[#3D2117]">
                Select Country
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#3D2117" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCountryCode(item);
                    setIsModalVisible(false);
                  }}
                  className="flex-row items-center py-4 border-b border-gray-100"
                >
                  <Text className="text-2xl mr-4">{item.flag}</Text>
                  <Text className="flex-1 text-base text-[#1A202C]">
                    {item.name}
                  </Text>
                  <Text className="text-base font-bold text-[#FF8A00]">
                    {item.code}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
