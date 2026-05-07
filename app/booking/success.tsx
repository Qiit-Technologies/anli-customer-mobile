import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BookingSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="flex-1 items-center justify-center px-10">
        {/* Success Icon */}
        <View className="w-24 h-24 bg-[#E8F5E9] rounded-full items-center justify-center mb-8">
          <View className="w-16 h-16 bg-[#27AE60] rounded-full items-center justify-center shadow-lg">
            <Ionicons name="checkmark" size={40} color="white" />
          </View>
        </View>

        {/* Text Content */}
        <Text className="text-4xl font-bold text-[#3D2117] text-center mb-3">Congratulation</Text>
        <Text className="text-[#8E9BAE] text-base text-center font-medium mb-10">
          Your reservation has been successfully booked
        </Text>

        <Text className="text-[#8E9BAE] text-sm text-center leading-6 mb-12">
          Get notified about your upcoming bookings, and you can change your change setting at anytime.
        </Text>

        {/* Actions */}
        <View className="w-full space-y-4">
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/bookings')}
            className="bg-[#007AFF] w-full py-5 rounded-2xl items-center shadow-sm"
          >
            <Text className="text-white text-lg font-bold">Yes, Notify Me</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/bookings')}
            className="border-2 border-[#007AFF] w-full py-5 rounded-2xl items-center mt-4"
          >
            <Text className="text-[#007AFF] text-lg font-bold">No, See reservations</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
