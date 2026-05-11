import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { authService } from "../../services/auth";
import { Hotel } from "../../services/hotel";

export default function SavedScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    try {
      const data = await authService.getFavorites();
      setFavorites(data);
    } catch (error: any) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const handleToggleFavorite = async (hotelId: number) => {
    try {
      await authService.toggleFavorite(hotelId);
      // Remove from local list immediately for better UX
      setFavorites((prev) => prev.filter((h) => h.id !== hotelId));
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#FF8A00" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white flex-row items-center border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="chevron-back" size={24} color="#3D2117" />
        </TouchableOpacity>
        <View>
          <Text className="text-2xl font-bold text-[#3D2117]">
            My Favorites
          </Text>
          <Text className="text-[#8E9BAE] text-sm">
            Your preferred dining spots
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF8A00"
          />
        }
      >
        <View className="px-6 pt-6 pb-20">
          {favorites.length > 0 ? (
            favorites.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/restaurant/${item.id}`)}
                className="mb-8 bg-white rounded-[32px] overflow-hidden border border-[#F1F5F9] shadow-sm"
              >
                <View className="h-48 w-full relative">
                  <Image
                    source={{
                      uri:
                        item.coverImage ||
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
                    }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                  <TouchableOpacity
                    onPress={() => handleToggleFavorite(item.id)}
                    className="absolute top-4 right-4 w-9 h-9 items-center justify-center"
                  >
                    <Image
                      source={require("../../assets/images/Heart.svg")}
                      style={{ width: 20, height: 20 }}
                      contentFit="contain"
                      tintColor="#FF3B30"
                    />
                  </TouchableOpacity>
                  <View className="absolute bottom-4 left-4 bg-[#3D2117]/80 px-3 py-1.5 rounded-xl">
                    <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                      {item.tags?.split(",")[0] || "Restaurant"}
                    </Text>
                  </View>
                </View>

                <View className="p-5">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text
                      className="text-xl font-bold text-[#3D2117] flex-1 mr-2"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <View className="flex-row items-center bg-orange-50 px-2 py-1 rounded-lg">
                      <Image
                        source={require("../../assets/images/Star.svg")}
                        style={{ width: 12, height: 12 }}
                        contentFit="contain"
                      />
                      <Text className="text-[10px] font-bold text-[#6B4226] ml-1">
                        {item.rating || "4.5"}/5
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#8E9BAE"
                    />
                    <Text
                      className="text-xs text-[#8E9BAE] ml-1 flex-1"
                      numberOfLines={1}
                    >
                      {item.address || "Victoria Island, Lagos"}
                    </Text>
                    <Text className="text-xs font-bold text-[#3D2117] ml-2">
                      $$$
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center justify-center pt-20">
              <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-6">
                <Ionicons name="heart-outline" size={32} color="#CBD5E0" />
              </View>
              <Text className="text-lg font-bold text-[#3D2117] text-center mb-2">
                No favorites yet
              </Text>
              <Text className="text-[#8E9BAE] text-center px-10 mb-8">
                Start exploring and save restaurants you love to find them
                easily later.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/search")}
                className="bg-[#007AFF] px-8 py-4 rounded-2xl"
              >
                <Text className="text-white font-bold">
                  Discover Restaurants
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
