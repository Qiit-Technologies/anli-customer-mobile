import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <Text className="text-xl font-bold text-[#3D2117]">Your Bookings</Text>
      <Text className="text-gray-500 mt-2">No active bookings yet.</Text>
    </SafeAreaView>
  );
}
