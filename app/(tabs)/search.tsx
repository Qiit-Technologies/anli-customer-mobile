import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { hotelService, Hotel } from "../../services/hotel";
import { authService } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const CUISINES = [
  "All",
  "Fast Food",
  "Pizza",
  "Japanese",
  "Chinese",
  "Mexican",
  "Italian",
  "Desserts",
];
const RATINGS = [0, 3, 4, 4.5];
const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"];

export default function SearchScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Hotel[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Filters state
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("");

  const fetchFavorites = async () => {
    if (user) {
      try {
        const favData = await authService.getFavorites();
        setFavorites(favData.map((f: any) => f.id));
      } catch (error: any) {
        console.error("Error fetching favorites:", error);
      }
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  // Simple debounce logic
  useEffect(() => {
    if (!query || query.trim().length < 1) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const filters: any = {};
        if (selectedRating > 0) filters.rating = selectedRating;
        if (selectedCuisine !== "All") filters.tags = selectedCuisine;

        const data = await hotelService.search(query.trim(), filters);
        setResults(data);
      } catch (error: any) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedRating, selectedCuisine]);

  const clearFilters = () => {
    setSelectedRating(0);
    setSelectedCuisine("All");
    setSelectedPrice("");
  };

  const handleApplyFilters = () => {
    setIsFilterModalVisible(false);
  };

  const handleToggleFavorite = async (hotelId: number) => {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }
    try {
      await authService.toggleFavorite(hotelId);
      setFavorites((prev) =>
        prev.includes(hotelId)
          ? prev.filter((id) => id !== hotelId)
          : [...prev, hotelId],
      );
    } catch (error: any) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header with Search Bar */}
      <View className="px-6 pt-4 pb-4 bg-white">
        <View className="flex-row items-center h-14">
          <View className="flex-1 flex-row items-center bg-[#F8FAFC] border border-[#E2E8F0] px-4 rounded-[20px] h-full shadow-sm">
            <Ionicons name="search-outline" size={20} color="#8E9BAE" />
            <TextInput
              placeholder="Search restaurants, cuisines..."
              placeholderTextColor="#8E9BAE"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              className="flex-1 ml-3 text-[#1A202C] text-base h-full"
              style={{ textAlignVertical: "center" }}
            />
          </View>
          <TouchableOpacity
            onPress={() => setIsFilterModalVisible(true)}
            className="w-14 h-14 bg-white border border-[#F1F5F9] rounded-[20px] items-center justify-center shadow-sm ml-3"
          >
            <View className="relative">
              <Ionicons name="options-outline" size={24} color="#007AFF" />
              {(selectedRating > 0 ||
                selectedCuisine !== "All" ||
                selectedPrice) && (
                <View className="absolute -top-1 -right-1 w-3 h-3 bg-[#007AFF] rounded-full border-2 border-white" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {!query ? (
          <View className="px-10 pt-20 items-center">
            <View className="w-24 h-24 bg-gray-50 rounded-[40px] items-center justify-center mb-8 border border-gray-100">
              <Ionicons name="search" size={40} color="#CBD5E0" />
            </View>
            <Text className="text-2xl font-bold text-[#3D2117] text-center mb-3">
              Find Your Flavor
            </Text>
            <Text className="text-[#8E9BAE] text-center leading-5 px-4">
              Explore the best restaurants around you. Search by name, cuisine,
              or category.
            </Text>
          </View>
        ) : (
          <View className="px-6 pb-20 pt-2">
            <Text className="text-xl font-bold text-[#3D2117] mb-6">
              Search results
            </Text>

            {results.length > 0 ? (
              results.map((item) => {
                const isFavorite = favorites.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => router.push(`/restaurant/${item.id}`)}
                    className="flex-row items-center mb-8"
                  >
                    <View className="w-28 h-28 rounded-[28px] overflow-hidden bg-gray-100">
                      <Image
                        source={{
                          uri:
                            item.coverImage ||
                            "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=300&q=80",
                        }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    </View>

                    <View className="flex-1 ml-5">
                      <View className="flex-row justify-between items-start">
                        <Text
                          className="text-lg font-bold text-[#3D2117] mb-1 flex-1"
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <View className="flex-row items-center">
                          <Image
                            source={require("../../assets/images/Star.svg")}
                            style={{ width: 14, height: 14 }}
                            contentFit="contain"
                          />
                          <Text className="text-xs font-bold text-[#6B4226] ml-1">
                            {item.rating || "4.5"}/5
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center mb-1">
                        <Ionicons
                          name="restaurant-outline"
                          size={14}
                          color="#8E9BAE"
                        />
                        <Text className="text-xs text-[#8E9BAE] ml-1">
                          {item.tags?.split(",")[0] || "Japanese, Sushi"} . $$$
                        </Text>
                      </View>

                      <View className="mb-2">
                        <Text className="text-[11px] text-[#8E9BAE]">
                          Open now{" "}
                          {item.displayHours?.split("-")[0] || "10:00 am"} close{" "}
                          {item.displayHours?.split("-")[1] || "11 : pm"}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => router.push(`/booking/${item.id}`)}
                      >
                        <Text className="text-[#FF8A00] text-sm font-bold">
                          Book Reservation
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View className="items-center mt-20">
                <Ionicons name="restaurant-outline" size={48} color="#E2E8F0" />
                <Text className="text-[#8E9BAE] mt-4 font-medium">
                  No matches found for your search
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Improved Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View
            className="bg-white rounded-t-[48px] pt-4 shadow-2xl"
            style={{ maxHeight: SCREEN_HEIGHT * 0.85 }}
          >
            <View className="w-12 h-1.5 bg-[#E2E8F0] rounded-full self-center mb-6" />

            <View className="px-8 flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-bold text-[#3D2117]">Filters</Text>
              <TouchableOpacity
                onPress={() => setIsFilterModalVisible(false)}
                className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={24} color="#3D2117" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="px-8">
              {/* Price Range */}
              <View className="mb-10">
                <Text className="text-sm font-bold text-[#8E9BAE] uppercase tracking-widest mb-5">
                  Price Range
                </Text>
                <View className="flex-row justify-between">
                  {PRICE_RANGES.map((price) => (
                    <TouchableOpacity
                      key={price}
                      onPress={() =>
                        setSelectedPrice(price === selectedPrice ? "" : price)
                      }
                      className={`w-[22%] h-14 items-center justify-center rounded-2xl border ${selectedPrice === price ? "bg-[#007AFF] border-[#007AFF]" : "bg-white border-[#F1F5F9]"}`}
                    >
                      <Text
                        className={`text-lg font-bold ${selectedPrice === price ? "text-white" : "text-[#3D2117]"}`}
                      >
                        {price}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Rating Section */}
              <View className="mb-10">
                <Text className="text-sm font-bold text-[#8E9BAE] uppercase tracking-widest mb-5">
                  Minimum Rating
                </Text>
                <View className="flex-row flex-wrap">
                  {RATINGS.map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => setSelectedRating(rating)}
                      className={`px-6 py-4 rounded-2xl mr-3 mb-3 border flex-row items-center ${selectedRating === rating ? "bg-[#007AFF] border-[#007AFF]" : "bg-white border-[#F1F5F9]"}`}
                    >
                      {rating > 0 && (
                        <Image
                          source={require("../../assets/images/Star.svg")}
                          style={{ width: 14, height: 14, marginRight: 6 }}
                          contentFit="contain"
                          tintColor={
                            selectedRating === rating ? "white" : "#FF8A00"
                          }
                        />
                      )}
                      <Text
                        className={`font-bold ${selectedRating === rating ? "text-white" : "text-[#3D2117]"}`}
                      >
                        {rating === 0 ? "Any" : `${rating}+`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Cuisine Section */}
              <View className="mb-10">
                <Text className="text-sm font-bold text-[#8E9BAE] uppercase tracking-widest mb-5">
                  Cuisine Type
                </Text>
                <View className="flex-row flex-wrap">
                  {CUISINES.map((cuisine) => (
                    <TouchableOpacity
                      key={cuisine}
                      onPress={() => setSelectedCuisine(cuisine)}
                      className={`px-6 py-4 rounded-2xl mr-3 mb-3 border ${selectedCuisine === cuisine ? "bg-[#007AFF] border-[#007AFF]" : "bg-white border-[#F1F5F9]"}`}
                    >
                      <Text
                        className={`font-bold ${selectedCuisine === cuisine ? "text-white" : "text-[#3D2117]"}`}
                      >
                        {cuisine}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Bottom Actions */}
              <View className="flex-row mt-4 mb-12">
                <TouchableOpacity
                  onPress={clearFilters}
                  className="flex-1 bg-gray-50 py-5 rounded-[24px] items-center mr-4 border border-gray-100"
                >
                  <Text className="text-[#3D2117] font-bold text-lg">
                    Reset
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleApplyFilters}
                  className="flex-[1.5] bg-[#007AFF] py-5 rounded-[24px] items-center shadow-lg shadow-blue-200"
                >
                  <Text className="text-white text-lg font-bold">
                    Apply Filters
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
