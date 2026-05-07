import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function CreateNewPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="#4A5568" />
          <Text className="text-[#4A5568] text-lg ml-1">Back</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 pt-10"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="mb-10">
            <Text className="text-4xl font-bold text-[#3D2117] mb-4">Create New Password</Text>
            <Text className="text-[#8E9BAE] text-base leading-6">
              Your new password must be different to previously used passwords.
            </Text>
          </View>

          <View className="space-y-6">
            <View className="mb-6">
              <Text className="text-[#8E9BAE] text-sm font-medium mb-2">New Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter Password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
                className="w-full border border-[#E2E8F0] py-4 px-4 rounded-2xl text-base text-gray-800"
              />
              <Text className="text-[#8E9BAE] text-xs mt-2">Must be up to 8 character</Text>
            </View>

            <View className="mb-8">
              <Text className="text-[#8E9BAE] text-sm font-medium mb-2">Confirm Password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Enter Password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
                className="w-full border border-[#E2E8F0] py-4 px-4 rounded-2xl text-base text-gray-800"
              />
            </View>
          </View>

          <View className="flex-1 justify-end pb-10">
            <TouchableOpacity
              onPress={() => router.push('/forgot-password/success')}
              className="w-full bg-[#007AFF] py-5 rounded-2xl items-center shadow-sm"
            >
              <Text className="text-white text-lg font-bold">Reset Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
