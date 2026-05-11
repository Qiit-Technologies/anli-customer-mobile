import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Image } from "expo-image";

export default function GuestLocationScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Search logic using Nominatim API
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const searchLocations = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setSearching(true);
      try {
        const params = new URLSearchParams({
          q: query,
          format: "json",
          addressdetails: "1",
          limit: "5",
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`,
          {
            signal: abortControllerRef.current.signal,
            headers: {
              "User-Agent": "Anli-Customer-Mobile/1.0",
            },
          },
        );

        const data = await response.json();
        setResults(data);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Search error:", error);
        }
      } finally {
        setSearching(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleUseCurrentLocation = async () => {
    setLoadingGPS(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied",
        );
        return;
      }

      let pos = await Location.getCurrentPositionAsync({});
      // Mocking a selected location object for the current GPS position
      setSelectedLocation({
        display_name: "Current Location",
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        address: {
          road: "Your current coordinates",
          city: "Detected",
        },
      });
      setQuery("");
      setResults([]);
    } catch (error: any) {
      Alert.alert("Error", "Could not get your current location");
    } finally {
      setLoadingGPS(false);
    }
  };

  const handleSelectResult = (item: any) => {
    setSelectedLocation(item);
    setQuery("");
    setResults([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-start">
        <View className="flex-1 mr-4">
          <Text className="text-4xl font-bold text-[#3D2117] mb-2">
            Enter your Location
          </Text>
          <Text className="text-[#8E9BAE] text-base leading-6">
            Help us find restaurants near you
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Text className="text-[#007AFF] text-lg font-bold">Skip</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-6">
        {/* Search Input */}
        <View className="flex-row items-center border border-[#E2E8F0] py-2 px-4 rounded-2xl bg-white z-20 mb-4">
          <Ionicons name="search-outline" size={20} color="#8E9BAE" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Enter location"
            placeholderTextColor="#A0AEC0"
            className="flex-1 ml-3 text-base text-gray-800"
          />
          {searching && <ActivityIndicator size="small" color="#007AFF" />}
        </View>

        {/* Use Current Location Button */}
        {!selectedLocation && query === "" && (
          <TouchableOpacity
            onPress={handleUseCurrentLocation}
            disabled={loadingGPS}
            className="flex-row items-center mb-6"
          >
            <Ionicons name="location-outline" size={20} color="#007AFF" />
            <Text className="text-[#007AFF] text-base ml-2 font-medium">
              {loadingGPS ? "Fetching..." : "Use my current location"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Dropdown Results */}
        {results.length > 0 && (
          <View className="absolute top-20 left-6 right-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-lg z-30 max-h-60 overflow-hidden">
            <FlatList
              data={results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectResult(item)}
                  className="px-4 py-4 border-b border-[#F1F5F9]"
                >
                  <Text className="text-gray-800 text-sm" numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Map Placeholder Area */}
        <View className="flex-1 bg-[#F8FAFC] rounded-3xl overflow-hidden mb-6 items-center justify-center border border-[#E2E8F0]">
          {selectedLocation ? (
            <Image
              source={{
                uri: `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${selectedLocation.lon},${selectedLocation.lat}&z=15&l=map&size=450,450&pt=${selectedLocation.lon},${selectedLocation.lat},pm2rdl`,
              }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          ) : (
            <View className="items-center px-10">
              <Ionicons name="map-outline" size={64} color="#CBD5E0" />
              <Text className="text-[#A0AEC0] text-center mt-4 text-base">
                Search or use current location to see the map
              </Text>
            </View>
          )}
        </View>

        {/* Selected Location Card */}
        {selectedLocation && (
          <View className="mb-6">
            <View className="bg-[#FFF9F2] p-6 rounded-3xl flex-row items-center mb-6 border border-[#FFE8CC]">
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
                <Ionicons name="location" size={24} color="#007AFF" />
              </View>
              <View className="flex-1 ml-4">
                <Text
                  className="text-lg font-bold text-[#3D2117] mb-1"
                  numberOfLines={1}
                >
                  {selectedLocation.address.road ||
                    selectedLocation.address.suburb ||
                    "Selected Location"}
                </Text>
                <Text className="text-sm text-[#8E9BAE]" numberOfLines={2}>
                  {selectedLocation.display_name}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              className="w-full bg-[#007AFF] py-5 rounded-2xl items-center shadow-sm"
            >
              <Text className="text-white text-lg font-bold">
                Select this Location
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Continue without selection */}
        {!selectedLocation && (
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="w-full bg-[#007AFF] py-5 rounded-2xl items-center shadow-sm mb-6"
          >
            <Text className="text-white text-lg font-bold">Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
