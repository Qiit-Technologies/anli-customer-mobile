import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { hotelService, Hotel } from "../../../services/hotel";

const { width } = Dimensions.get("window");

export default function FullMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const hotelId = Number(id);
        const [hotelData, menusData] = await Promise.all([
          hotelService.getDetails(hotelId),
          hotelService.getMenu(hotelId),
        ]);
        setHotel(hotelData);
        setMenus(menusData || []);
      } catch (error: any) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#FF8A00" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Premium Header */}
      <View className="bg-[#3D2117] pt-14 pb-8 px-6 rounded-b-[40px] shadow-lg">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/10 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">The Full Menu</Text>
          <View className="w-10" />
        </View>

        <View className="items-center">
          <Text className="text-white text-3xl font-black text-center">
            {hotel?.name}
          </Text>
          <Text className="text-white/60 text-xs mt-1 uppercase tracking-[3px]">
            Culinary Showcase
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {menus.length > 0 ? (
          menus.map((menu: any) => (
            <View key={menu.id} className="mt-8">
              {/* Menu Title (e.g. Breakfast, Main Menu) */}
              <View className="px-6 mb-2">
                <Text className="text-3xl font-black text-[#FF8A00]">
                  {menu.name}
                </Text>
                {menu.description && (
                  <Text className="text-[#8E9BAE] text-xs mt-1">
                    {menu.description}
                  </Text>
                )}
                <View className="w-20 h-1 bg-[#3D2117] mt-2 rounded-full" />
              </View>

              {menu.categories?.map((category: any, catIndex: number) => (
                <View
                  key={category.id}
                  className={catIndex === 0 ? "mt-4" : "mt-8"}
                >
                  {/* Category Header */}
                  <View className="px-6 flex-row items-center mb-6">
                    <Text className="text-xl font-bold text-[#3D2117]">
                      {category.name}
                    </Text>
                    <View className="flex-1 h-[1px] bg-gray-100 ml-4" />
                  </View>

                  {/* Items in Category */}
                  <View className="px-6">
                    {[
                      ...(category.items || []),
                      ...(category.subCategories?.flatMap(
                        (sub: any) => sub.items || [],
                      ) || []),
                    ].map((item: any) => (
                      <View
                        key={item.id}
                        className="flex-row bg-[#F8FAFC] p-4 rounded-[32px] mb-4 border border-[#F1F5F9]"
                      >
                        <Image
                          source={{
                            uri:
                              item.imageUrl ||
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80",
                          }}
                          style={{ width: 85, height: 85, borderRadius: 22 }}
                          contentFit="cover"
                        />
                        <View className="ml-4 flex-1 justify-center">
                          <View className="flex-row justify-between items-start">
                            <Text className="text-base font-bold text-[#3D2117] flex-1 mr-2">
                              {item.name}
                            </Text>
                            <Text className="text-[#FF8A00] font-black text-base">
                              ₦{item.price}
                            </Text>
                          </View>
                          <Text
                            className="text-[#8E9BAE] text-[10px] leading-4 mt-1"
                            numberOfLines={2}
                          >
                            {item.description ||
                              "Expertly prepared with the finest ingredients and traditional culinary techniques."}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View className="items-center justify-center py-24 px-10">
            <Ionicons name="restaurant-outline" size={80} color="#F1F5F9" />
            <Text className="text-gray-400 text-center mt-4">
              Menu showcase coming soon!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
