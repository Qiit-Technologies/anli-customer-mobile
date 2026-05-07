import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { hotelService, Hotel } from '../../services/hotel';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  // Simple debounce logic
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await hotelService.search(query.trim());
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="flex-row items-center mb-6"
        >
          <Ionicons name="chevron-back" size={24} color="#1A202C" />
          <Text className="text-base text-[#1A202C] ml-1">Back</Text>
        </TouchableOpacity>
        
        <Text className="text-2xl font-bold text-[#3D2117] mb-6">Search Restaurant</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Search Bar */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center border border-[#F1F5F9] py-2 px-5 rounded-2xl bg-white shadow-sm">
            <Ionicons name="search-outline" size={20} color="#8E9BAE" />
            <TextInput 
              placeholder="food, restaurant etc..."
              placeholderTextColor="#A0AEC0"
              className="flex-1 ml-3 text-sm text-gray-800"
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {loading ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={20} color="#CBD5E0" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Results Section */}
        {query.length > 0 ? (
          <View className="px-6 pb-20">
            <Text className="text-lg font-bold text-[#3D2117] mb-6">
              {loading ? 'Searching...' : `Search results (${results.length})`}
            </Text>
            
            {results.length > 0 ? (
              results.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  onPress={() => router.push(`/restaurant/${item.id}`)}
                  className="flex-row mb-8"
                >
                  {/* Thumbnail */}
                  <View className="w-28 h-28 rounded-[24px] overflow-hidden bg-gray-100">
                    <Image 
                      source={{ uri: item.coverImage || 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=300&q=80' }} 
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                      transition={500}
                    />
                  </View>

                  {/* Details */}
                  <View className="flex-1 ml-4 justify-between py-1">
                    <View>
                      <View className="flex-row justify-between items-start">
                        <Text className="text-lg font-bold text-[#3D2117] flex-1 mr-2" numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View className="flex-row items-center">
                          <Ionicons name="star" size={14} color="#FF8A00" />
                          <Text className="text-[10px] font-bold ml-1 text-[#7A3907]">{item.rating}/5</Text>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center mt-1">
                        <Ionicons name="restaurant-outline" size={14} color="#8E9BAE" />
                        <Text className="text-[#8E9BAE] text-[10px] ml-1" numberOfLines={1}>{item.tags || 'Restaurant'}</Text>
                      </View>
                      
                      <Text className="text-[#8E9BAE] text-[10px] mt-1" numberOfLines={1}>{item.displayHours || 'Opening hours not available'}</Text>
                    </View>

                    <TouchableOpacity onPress={() => router.push(`/booking/${item.id}`)}>
                      <Text className="text-[#FF8A00] text-sm font-bold">Book Reservation</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : !loading && query.length >= 2 ? (
              <View className="items-center mt-10">
                <Ionicons name="search-outline" size={48} color="#F1F5F9" />
                <Text className="text-gray-400 mt-4">No restaurants found for "{query}"</Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View className="items-center mt-20 px-10">
            <Ionicons name="search-outline" size={64} color="#F1F5F9" />
            <Text className="text-[#8E9BAE] text-center mt-4 text-base">
              Start typing to discover amazing restaurants around you.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
