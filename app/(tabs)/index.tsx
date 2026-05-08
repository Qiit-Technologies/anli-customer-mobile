import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { hotelService, Hotel } from "../../services/hotel";
import { authService } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
  {
    id: "1",
    name: "Italian\nRestaurant",
    image:
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "2",
    name: "Chinese\nRestaurant",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "3",
    name: "Nigeria\nRestaurant",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "4",
    name: "Local\nRestaurant",
    image:
      "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "5",
    name: "Mexican\nRestaurant",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=150&q=80",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Hotel[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [featuredData, favoritesData] = await Promise.all([
        hotelService.getFeatured(),
        user ? authService.getFavorites() : Promise.resolve([]),
      ]);
      setRestaurants(featuredData);
      setFavorites(favoritesData.map((f: any) => f.id));
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleToggleFavorite = async (hotelId: number) => {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }

    try {
      await authService.toggleFavorite(hotelId);
      setFavorites(prev => 
        prev.includes(hotelId) 
          ? prev.filter(id => id !== hotelId) 
          : [...prev, hotelId]
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-xl font-bold text-[#3D2117]">
            Hello Good Morning!
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(guest)/location")}
            className="flex-row items-center mt-1"
          >
            <Ionicons name="location-outline" size={18} color="#8E9BAE" />
            <Text className="text-[#8E9BAE] text-sm ml-1">Lekki Phase 1</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#8E9BAE"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="w-12 h-12 mb-2 bg-white border border-[#F1F5F9] rounded-2xl items-center justify-center shadow-sm ml-4">
          <Ionicons name="notifications-outline" size={24} color="#1A202C" />
          <View className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF8A00" />
        }
      >
        {/* Promo Banner */}
        <View className="px-6 mb-6">
          <TouchableOpacity className="w-full h-32 overflow-hidden">
            <Image
              source={require("../../assets/images/home-banner.svg")}
              style={{ width: "100%", height: "100%" }}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-6">
          <TouchableOpacity 
            onPress={() => router.push("/(tabs)/search")}
            className="flex-row items-center border border-[#F1F5F9] py-3.5 px-5 rounded-2xl bg-[#F8FAFC]"
          >
            <Ionicons name="search-outline" size={20} color="#8E9BAE" />
            <Text className="flex-1 ml-3 text-sm text-[#A0AEC0]">
              Search restaurant name etc
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} className="items-center mr-6">
                <View className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-[#F1F5F9]">
                  <Image
                    source={{ uri: cat.image }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
                <Text className="text-[11px] text-[#3D2117] font-medium text-center leading-4">
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Section */}
        <View className="px-6 pb-10">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-[#3D2117]">
              Featured Restaurant
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#FF8A00" className="mt-10" />
          ) : restaurants.length === 0 ? (
            <View className="items-center mt-10">
              <Text className="text-[#8E9BAE]">No restaurants found</Text>
            </View>
          ) : (
            restaurants.map((item) => {
              const isFavorite = favorites.includes(item.id);
              return (
                <View
                  key={item.id}
                  className="bg-white rounded-[32px] overflow-hidden border border-[#FFF5E9] shadow-sm mb-8"
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/restaurant/${item.id}`)}
                    activeOpacity={0.9}
                  >
                    <View className="h-40 relative">
                      <Image
                        source={{
                          uri:
                            item.coverImage ||
                            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80",
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderTopLeftRadius: 32,
                          borderTopRightRadius: 32,
                        }}
                        contentFit="cover"
                        transition={500}
                      />
                      <TouchableOpacity 
                        onPress={() => handleToggleFavorite(item.id)}
                        className="absolute top-4 right-4 w-9 h-9 items-center justify-center"
                      >
                        <Image
                          source={require("../../assets/images/Heart.svg")}
                          style={{ width: 20, height: 20 }}
                          contentFit="contain"
                          tintColor={isFavorite ? "#FF3B30" : "white"}
                        />
                      </TouchableOpacity>
                    </View>

                    <View className="pt-5 px-4 pb-2 bg-[#FFFBFA]">
                      <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-xl font-bold text-[#3D2117]">
                          {item.name}
                        </Text>
                        <View className="flex-row items-center bg-orange-50 px-2 py-1 rounded-lg">
                          <Image
                            source={require("../../assets/images/Star.svg")}
                            style={{ width: 18, height: 18 }}
                            contentFit="contain"
                          />
                          <Text className="text-sm font-bold ml-1 text-[#6B4226]">
                            {item.rating || "4.5"}/5
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center flex-1">
                          <Ionicons
                            name="restaurant-outline"
                            size={14}
                            color="#8E9BAE"
                          />
                          <Text
                            className="text-[#8E9BAE] text-[10px] ml-1"
                            numberOfLines={1}
                          >
                            {item.tags || "General Restaurant"}
                          </Text>
                        </View>
                        <Text className="text-[#8E9BAE] text-[10px] ml-2 font-medium">
                          {item.displayHours || "09:00 AM - 10:00 PM"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View className="border-t border-[#F1F5F9] px-6 py-5 bg-white">
                    <TouchableOpacity
                      onPress={() => router.push(`/booking/${item.id}`)}
                    >
                      <Text className="text-[#FF8A00] text-base font-bold text-left">
                        Book Reservation
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
