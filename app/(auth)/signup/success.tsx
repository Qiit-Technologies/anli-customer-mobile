import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function SuccessScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 px-6 pb-10">
        
        {/* Centered Content */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-4xl font-bold text-[#45220a] mb-4 text-center">
            Congratulation
          </Text>
          <Text className="text-base text-[#6b7b99] text-center">
            Your account has been successfully been created
          </Text>
        </View>

        {/* Continue Button */}
        <View className="w-full">
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            className="w-full bg-[#007AFF] py-4 rounded-xl items-center"
          >
            <Text className="text-white text-lg font-semibold">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
