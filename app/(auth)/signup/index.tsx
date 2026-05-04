import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; // For the chevron icon

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-6 pt-8 pb-10"
        >
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-[#45220a] mb-2">Create Account</Text>
            <Text className="text-base text-[#6b7b99]">
              To Get started, Sign in into your account
            </Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-4 mb-6">
            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-[#5c6b8a] text-sm mb-2">Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter Email address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full border border-gray-100 rounded-xl px-4 py-4 text-base text-black bg-white shadow-sm"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              />
            </View>

            {/* Phone Number Field */}
            <View className="mb-4">
              <Text className="text-[#5c6b8a] text-sm mb-2">Phone Number</Text>
              <View className="flex-row items-center space-x-3">
                {/* Country Code Selector (Simulated) */}
                <TouchableOpacity
                  className="flex-row items-center border border-gray-100 rounded-xl px-4 py-4 bg-white shadow-sm mr-3"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                >
                  <Text className="text-base text-black mr-2">+234</Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>

                {/* Phone Input */}
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter Phone number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  className="flex-1 border border-gray-100 rounded-xl px-4 py-4 text-base text-black bg-white shadow-sm"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-2">
              <Text className="text-[#5c6b8a] text-sm mb-2">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="w-full border border-gray-100 rounded-xl px-4 py-4 text-base text-black bg-white shadow-sm"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              />
            </View>
            <Text className="text-[#4b5563] text-xs">Must be up to 8 character</Text>
          </View>

          {/* Signup Button */}
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/signup/verify')}
            className="w-full bg-[#007AFF] py-4 rounded-xl items-center mt-4 mb-8"
          >
            <Text className="text-white text-lg font-semibold">Signup</Text>
          </TouchableOpacity>

          {/* Social Logins */}
          <View className="items-center mb-6">
            <Text className="text-[#4b5563] text-sm mb-4">or Login with</Text>

            <TouchableOpacity className="w-full border border-[#FF8A00] py-4 rounded-xl items-center mb-4 bg-white">
              <Text className="text-[#1f2937] text-base font-medium">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-full border border-[#FF8A00] py-4 rounded-xl items-center bg-white">
              <Text className="text-[#1f2937] text-base font-medium">Continue with Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center items-center mt-auto">
            <Text className="text-[#4b5563] text-base">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-[#FF8A00] text-base font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
