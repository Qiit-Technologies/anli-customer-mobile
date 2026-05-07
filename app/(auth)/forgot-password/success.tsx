import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function PasswordSuccessScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="flex-1 px-6 items-center justify-center">
        <View className="mb-12 items-center">
          <Text className="text-4xl font-bold text-[#3D2117] mb-4 text-center">Password Sucessful</Text>
          <Text className="text-[#8E9BAE] text-center text-lg">
            Your password has been successfully reset.{'\n'}
            Click below to log in .
          </Text>
        </View>
      </View>

      <View className="px-6 pb-10">
        <TouchableOpacity
          onPress={() => router.replace('/login')}
          className="w-full bg-[#007AFF] py-5 rounded-2xl items-center shadow-sm"
        >
          <Text className="text-white text-lg font-bold">Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
