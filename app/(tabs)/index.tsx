import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: '1', name: 'Italian\nRestaurant', image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=150&q=80' },
  { id: '2', name: 'Chinese\nRestaurant', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=150&q=80' },
  { id: '3', name: 'Nigeria\nRestaurant', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80' },
  { id: '4', name: 'Local\nRestaurant', image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=150&q=80' },
  { id: '5', name: 'Mexican\nRestaurant', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=150&q=80' },
];

const RESTAURANTS = [
  {
    id: '1',
    name: 'Cactus Restaurant',
    rating: '4.8/5',
    tags: 'Japanese, Sushi . $$$',
    hours: 'Open now 10:00 am close 11 : pm',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '2',
    name: 'Orchid Bistro',
    rating: '4.5/5',
    tags: 'Continental, Cafe . $$',
    hours: 'Open now 08:00 am close 10 : pm',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '3',
    name: 'Terra Kulture',
    rating: '4.7/5',
    tags: 'Nigerian, Grill . $$$',
    hours: 'Open now 09:00 am close 11 : pm',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '4',
    name: 'Sky Restaurant',
    rating: '4.9/5',
    tags: 'Fine Dining, View . $$$$',
    hours: 'Open now 12:00 pm close 12 : am',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '5',
    name: 'Craft Gourmet',
    rating: '4.6/5',
    tags: 'International, Fusion . $$$',
    hours: 'Open now 10:00 am close 10 : pm',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=80',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-8 pb-4 flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-xl font-bold text-[#3D2117]">Hello Good Morning!</Text>
          <TouchableOpacity className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={18} color="#8E9BAE" />
            <Text className="text-[#8E9BAE] text-sm ml-1">Lekki Phase 1</Text>
            <Ionicons name="chevron-down" size={16} color="#8E9BAE" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="w-12 h-12 bg-white border border-[#F1F5F9] rounded-2xl items-center justify-center shadow-sm ml-4">
          <Ionicons name="notifications-outline" size={24} color="#1A202C" />
          <View className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Promo Banner */}
        <View className="px-6 mb-6">
          <TouchableOpacity className="w-full h-32 overflow-hidden">
            <Image 
              source={require('../../assets/images/home-banner.svg')} 
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center border border-[#F1F5F9] py-2.5 px-5 rounded-2xl bg-[#F8FAFC]">
            <Ionicons name="search-outline" size={20} color="#8E9BAE" />
            <TextInput 
              placeholder="Search restaurant name etc"
              placeholderTextColor="#A0AEC0"
              className="flex-1 ml-3 text-sm text-gray-800"
            />
          </View>
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
                    style={{ width: '100%', height: '100%' }}
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
            <Text className="text-xl font-bold text-[#3D2117]">Featured Restaurant</Text>
          </View>

          {RESTAURANTS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => router.push(`/restaurant/${item.id}`)}
              className="bg-white rounded-[32px] overflow-hidden border border-[#FFF5E9] shadow-sm mb-8"
            >
              <View className="h-40 relative">
                <Image 
                  source={{ uri: item.image }} 
                  style={{ width: '100%', height: '100%', borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
                  contentFit="cover"
                  transition={500}
                />
                <TouchableOpacity className="absolute top-4 right-4 w-9 h-9 items-center justify-center">
                  <Image 
                    source={require('../../assets/images/Heart.svg')}
                    style={{ width: 20, height: 20 }}
                    contentFit="contain"
                    tintColor="white"
                  />
                </TouchableOpacity>
              </View>
              
              <View className="pt-5 px-4 pb-2 bg-[#FFFBFA]">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-xl font-bold text-[#3D2117]">{item.name}</Text>
                  <View className="flex-row items-center">
                    <Image 
                      source={require('../../assets/images/Star.svg')}
                      style={{ width: 18, height: 18 }}
                      contentFit="contain"
                    />
                    <Text className="text-sm font-bold ml-1 text-[#7A3907]">{item.rating}</Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="restaurant-outline" size={14} color="#8E9BAE" />
                    <Text className="text-[#8E9BAE] text-[10px] ml-1" numberOfLines={1}>{item.tags}</Text>
                  </View>
                  <Text className="text-[#8E9BAE] text-[10px] ml-2">{item.hours}</Text>
                </View>
              </View>

              <View className="border-t border-[#F1F5F9] px-6 py-5 bg-white">
                <TouchableOpacity>
                  <Text className="text-[#FF8A00] text-base font-bold">Book Reservation</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
