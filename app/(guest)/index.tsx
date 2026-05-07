import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { Image } from "expo-image";

export default function GuestStartScreen() {
  const handleChooseLocation = async () => {
    try {
      // Ask for permission first
      await Location.requestForegroundPermissionsAsync();

      // Navigate to the next screen
      router.push("/(guest)/location");
    } catch (error) {
      router.push("/(guest)/location");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 px-6 items-center justify-center">
        <View className="items-center">
          <Image
            source={require("../../assets/images/bored.svg")}
            style={{ width: 200, height: 200 }}
            contentFit="contain"
          />
        </View>

        <View className="mb-12">
          <Text className="text-3xl font-bold text-[#3D2117] text-center leading-10">
            Add your address to see{"\n"}
            restaurant available{"\n"}
            near you.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleChooseLocation}
          className="w-full bg-[#007AFF] py-4 rounded-lg items-center shadow-sm"
        >
          <Text className="text-white text-lg font-bold">Choose location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
