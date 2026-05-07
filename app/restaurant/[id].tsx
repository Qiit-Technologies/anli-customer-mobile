import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const TIME_SLOTS = ['10:00 Am', '10:00 Am', '10:00 Am', '10:00 Am'];
const TABS = ['Available Bookings', 'Menu', 'Reviews', 'Details'];

const MENU_ITEMS = [
  {
    id: '1',
    name: 'Margherita',
    description: 'Tomato sauce mozzarella sweet basil',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '2',
    name: 'Pizza Parma',
    description: 'Tomato sauce mozzarella parma ham',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
  },
];

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Available Bookings');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#8E9BAE" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-[#007AFF] font-bold">Gift A friend</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Image Gallery */}
        <View className="px-6 mb-8">
          <View className="relative h-64 rounded-[40px] overflow-hidden">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80' }} 
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
            
            {/* Arrows */}
            <TouchableOpacity className="absolute left-4 top-1/2 -translate-y-4 w-8 h-8 items-center justify-center">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="absolute right-4 top-1/2 -translate-y-4 w-8 h-8 items-center justify-center">
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>

            {/* View All Overlay */}
            <TouchableOpacity 
              className="absolute bottom-6 self-center flex-row items-center bg-black/50 px-6 py-3 rounded-full"
              style={{ minWidth: 160, justifyContent: 'center' }}
            >
              <Ionicons name="image-outline" size={20} color="white" />
              <Text className="text-white font-bold ml-2">View all Image</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Restaurant Info */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-bold text-[#3D2117]">Cactus Restaurant</Text>
            <View className="flex-row items-center">
              <Image 
                source={require('../../assets/images/Star.svg')}
                style={{ width: 22, height: 22 }}
                contentFit="contain"
              />
              <Text className="text-sm font-bold ml-1 text-[#7A3907]">4.8/5</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-4">
            <Ionicons name="wallet-outline" size={16} color="#1A202C" />
            <Text className="text-[#1A202C] text-xs ml-1">$30.00 to $50.00</Text>
            <View className="flex-row items-center ml-4">
              <Ionicons name="restaurant-outline" size={16} color="#8E9BAE" />
              <Text className="text-[#8E9BAE] text-xs ml-1">Japanese, Sushi</Text>
            </View>
          </View>

          <View className="flex-row">
            <Ionicons name="location-outline" size={16} color="#8E9BAE" style={{ marginTop: 2 }} />
            <Text className="text-[#8E9BAE] text-[11px] leading-4 ml-1 flex-1">
              Water Corporation Road Plot No 3 & 4, Block XVI, Victoria Island Oniru Estate, Lagos 101241 Nigeria
            </Text>
          </View>
        </View>

        {/* Tabs Header */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            <View className="flex-row border-b border-[#F1F5F9] pb-0.5">
              {TABS.map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  onPress={() => setActiveTab(tab)}
                  className={`mr-8 pb-3 ${activeTab === tab ? 'border-b-2 border-[#FF8A00]' : ''}`}
                >
                  <Text className={`text-base font-medium ${activeTab === tab ? 'text-[#FF8A00]' : 'text-[#8E9BAE]'}`}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View className="px-6 pb-20">
          {activeTab === 'Available Bookings' && (
            <View>
              <Text className="text-xl font-bold text-[#3D2117] mb-6">Available Bookings</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
                {TIME_SLOTS.map((slot, index) => (
                  <TouchableOpacity 
                    key={index} 
                    className="flex-row items-center border border-[#F1F5F9] px-4 py-3 rounded-2xl mr-3"
                  >
                    <Ionicons name="restaurant-outline" size={16} color="#1A202C" />
                    <Text className="text-sm font-medium text-[#1A202C] ml-2">{slot}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View className="mb-8">
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1550966842-28c2e2ad4455?auto=format&fit=crop&w=600&q=80' }} 
                  style={{ width: '100%', height: 200, borderRadius: 40 }}
                  contentFit="cover"
                />
              </View>
              <View className="items-center">
                <TouchableOpacity className="border border-[#3D2117] px-10 py-4 rounded-2xl mb-6 w-full">
                  <Text className="text-[#3D2117] text-center font-bold">Set other Bookings Option</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-[#3D2117] text-sm text-center">Notify Me for available space</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'Menu' && (
            <View>
              <Text className="text-xl font-bold text-[#3D2117] mb-6">Menu</Text>
              {MENU_ITEMS.map((item) => (
                <View key={item.id} className="flex-row items-center bg-[#F8FAFC] p-4 rounded-[24px] mb-4">
                  <Image 
                    source={{ uri: item.image }} 
                    style={{ width: 80, height: 80, borderRadius: 16 }}
                    contentFit="cover"
                  />
                  <View className="ml-4 flex-1">
                    <Text className="text-lg font-bold text-[#3D2117]">{item.name}</Text>
                    <Text className="text-[#8E9BAE] text-xs mt-1">{item.description}</Text>
                  </View>
                </View>
              ))}
              <TouchableOpacity className="mt-6 border border-[#3D2117] px-10 py-4 rounded-2xl self-center w-full">
                <Text className="text-[#3D2117] text-center font-bold">See Full Menu</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'Details' && (
            <View>
              <Text className="text-xl font-bold text-[#3D2117] mb-6">Details</Text>
              
              <View className="mb-8">
                <Text className="text-base font-bold text-[#3D2117] mb-2">About</Text>
                <Text className="text-[#8E9BAE] text-sm leading-6">
                  We're your go to place for fine dining and bespoke experiences in Lagos!
                </Text>
              </View>

              <View className="space-y-6 mb-10">
                <View className="flex-row items-center">
                  <Ionicons name="wallet-outline" size={20} color="#1A202C" />
                  <Text className="text-[#8E9BAE] text-sm ml-3 flex-1">
                    Digital Payments, Accepts credit cards: Mastercard, Visa
                  </Text>
                </View>
                <View className="flex-row items-center mt-6">
                  <Ionicons name="swap-horizontal-outline" size={20} color="#1A202C" />
                  <Text className="text-[#8E9BAE] text-sm ml-3 flex-1">
                    Vegetarian friendly, Vegan options, Gluten free options
                  </Text>
                </View>
                <View className="flex-row items-center mt-6">
                  <Ionicons name="time-outline" size={20} color="#1A202C" />
                  <Text className="text-[#8E9BAE] text-sm ml-3 flex-1">
                    Open until 1:00 AM
                  </Text>
                </View>
              </View>

              <View className="h-48 rounded-[32px] overflow-hidden bg-[#F8FAFC]">
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=600&q=80' }} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
                <View className="absolute inset-0 bg-black/10 items-center justify-center p-6">
                   <View className="bg-white px-4 py-2 rounded-full flex-row items-center shadow-sm">
                      <Ionicons name="location" size={16} color="#FF8A00" />
                      <Text className="text-[10px] ml-1 font-medium text-gray-800" numberOfLines={1}>
                        Water Corporation Road Plot No 3 & 4...
                      </Text>
                   </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
