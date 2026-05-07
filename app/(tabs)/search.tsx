import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const SEARCH_RESULTS = [
  {
    id: '1',
    name: 'Cactus Restaurant',
    rating: '4.8/5',
    tags: 'Japanese, Sushi . $$$',
    hours: 'Open now 10:00 am close 11 : pm',
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '2',
    name: 'Orchid Bistro',
    rating: '4.5/5',
    tags: 'Continental, Cafe . $$',
    hours: 'Open now 08:00 am close 10 : pm',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '3',
    name: 'Terra Kulture',
    rating: '4.7/5',
    tags: 'Nigerian, Grill . $$$',
    hours: 'Open now 09:00 am close 11 : pm',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '4',
    name: 'Sky Restaurant',
    rating: '4.9/5',
    tags: 'Fine Dining, View . $$$$',
    hours: 'Open now 12:00 pm close 12 : am',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filteredResults = SEARCH_RESULTS.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) || 
    item.tags.toLowerCase().includes(query.toLowerCase())
  );

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
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={20} color="#CBD5E0" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Results Section - Only shown if query exists */}
        {query.length > 0 ? (
          <View className="px-6 pb-20">
            <Text className="text-lg font-bold text-[#3D2117] mb-6">Search results</Text>
            
            {filteredResults.length > 0 ? (
              filteredResults.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  onPress={() => router.push(`/restaurant/${item.id}`)}
                  className="flex-row mb-8"
                >
                  {/* Thumbnail */}
                  <View className="w-28 h-28 rounded-[24px] overflow-hidden">
                    <Image 
                      source={{ uri: item.image }} 
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
                          <Image 
                            source={require('../../assets/images/Star.svg')}
                            style={{ width: 14, height: 14 }}
                            contentFit="contain"
                          />
                          <Text className="text-[10px] font-bold ml-1 text-[#7A3907]">{item.rating}</Text>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center mt-1">
                        <Ionicons name="restaurant-outline" size={14} color="#8E9BAE" />
                        <Text className="text-[#8E9BAE] text-[10px] ml-1">{item.tags}</Text>
                      </View>
                      
                      <Text className="text-[#8E9BAE] text-[10px] mt-1">{item.hours}</Text>
                    </View>

                    <TouchableOpacity>
                      <Text className="text-[#FF8A00] text-sm font-bold">Book Reservation</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="items-center mt-10">
                <Text className="text-gray-400">No restaurants found for "{query}"</Text>
              </View>
            )}
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
