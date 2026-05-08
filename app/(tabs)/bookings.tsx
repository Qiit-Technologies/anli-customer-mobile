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
import { useAuth } from "../../context/AuthContext";
import { reservationService } from "../../services/reservation";

const STATUS_COLOR: Record<string, { text: string; bg: string; icon: string }> = {
  PENDING:    { text: "#D97706", bg: "#FFFBEB", icon: "time-outline" },
  CONFIRMED:  { text: "#059669", bg: "#ECFDF5", icon: "checkmark-circle" },
  COMPLETED:  { text: "#6B7280", bg: "#F3F4F6", icon: "checkmark-done" },
  CANCELLED:  { text: "#DC2626", bg: "#FEF2F2", icon: "close-circle" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export default function BookingsScreen() {
  const router = useRouter();
  const auth = useAuth();
  
  console.log('[DEBUG] Bookings Auth State:', { isLoggedIn: auth.isLoggedIn, isLoading: auth.isLoading, hasUser: !!auth.user });
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservations = async () => {
    if (!auth.user?.id) { setLoading(false); return; }
    try {
      const data = await reservationService.getByCustomerId(auth.user.id);
      setReservations(data);
    } catch (e) {
      console.error("Failed to fetch reservations:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchReservations(); }, [auth.user]);

  const onRefresh = () => { setRefreshing(true); fetchReservations(); };

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = reservations.filter((r) => {
    const resDate = new Date(r.date);
    resDate.setHours(0, 0, 0, 0);
    return resDate >= now && r.status !== "CANCELLED" && r.status !== "COMPLETED";
  });

  const completed = reservations.filter((r) => {
    const resDate = new Date(r.date);
    resDate.setHours(0, 0, 0, 0);
    return r.status === "COMPLETED" || r.status === "CANCELLED" || resDate < now;
  });

  const displayed = activeTab === "Upcoming" ? upcoming : completed;

  const renderCard = (item: any) => {
    const statusStyle = STATUS_COLOR[item.status?.toUpperCase()] || STATUS_COLOR.PENDING;
    return (
      <View
        key={item.id}
        className="bg-white rounded-[32px] overflow-hidden border border-[#F1F5F9] shadow-sm mb-8"
      >
        {/* Image */}
        <View className="h-44 relative">
          <Image
            source={{ uri: item.hotel?.coverImage || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=80" }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <View className="absolute inset-0 bg-black/10" />
          {/* Status badge */}
          <View
            className="absolute top-4 right-4 flex-row items-center px-3 py-1.5 rounded-full"
            style={{ backgroundColor: statusStyle.bg }}
          >
            <Ionicons name={statusStyle.icon as any} size={13} color={statusStyle.text} />
            <Text className="text-xs font-bold ml-1" style={{ color: statusStyle.text }}>
              {item.status || "PENDING"}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View className="p-5 bg-[#FFFBFA]">
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-xl font-bold text-[#3D2117] flex-1 mr-2" numberOfLines={1}>
              {item.hotel?.name || "Restaurant"}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={18} color="#3D2117" />
              <Text className="text-base font-bold text-[#3D2117] ml-1">{item.guestNumber}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 rounded-xl bg-white border border-[#F1F5F9] items-center justify-center">
              <Ionicons name="calendar-outline" size={16} color="#3D2117" />
            </View>
            <Text className="text-[#3D2117] font-medium text-sm ml-3">
              {formatDate(item.date)} · {item.time}
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-white border border-[#F1F5F9] items-center justify-center">
              <Ionicons name="restaurant-outline" size={16} color="#8E9BAE" />
            </View>
            <Text className="text-[#8E9BAE] text-sm ml-3">{item.tableType} · {item.reservationType}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row p-4 bg-white border-t border-[#F1F5F9]">
          <TouchableOpacity
            onPress={() => router.push(`/restaurant/${item.hotel?.id}`)}
            className="flex-1 border border-[#3D2117] py-3.5 rounded-xl mr-2"
          >
            <Text className="text-[#3D2117] text-[10px] font-bold text-center">Browse Menu</Text>
          </TouchableOpacity>
          {activeTab === "Upcoming" && (
            <TouchableOpacity
              onPress={() => router.push(`/booking/${item.hotel?.id}?mode=edit&reservationId=${item.id}`)}
              className="flex-1 bg-[#3D2117] py-3.5 rounded-xl ml-2"
            >
              <Text className="text-white text-[10px] font-bold text-center">Modify</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="px-6 pt-6 pb-2">
        <Text className="text-2xl font-bold text-[#3D2117] mb-1">My Bookings</Text>
        {auth.user && <Text className="text-[#8E9BAE] text-sm mb-4">{auth.user.firstName} {auth.user.lastName}</Text>}
      </View>

      {/* Tabs */}
      <View className="px-6 mb-4">
        <View className="flex-row border-b border-[#F1F5F9]">
          {["Upcoming", "Completed"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 pb-4 items-center ${activeTab === tab ? "border-b-2 border-[#FF8A00]" : ""}`}
            >
              <Text className={`text-sm font-medium ${activeTab === tab ? "text-[#FF8A00]" : "text-[#8E9BAE]"}`}>
                {tab} {tab === "Upcoming" ? `(${upcoming.length})` : `(${completed.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {auth.isLoading ? (
          <ActivityIndicator size="large" color="#FF8A00" className="mt-20" />
        ) : !auth.isLoggedIn ? (
          <View className="items-center mt-20">
            <Ionicons name="lock-closed-outline" size={48} color="#CBD5E0" />
            <Text className="text-[#8E9BAE] text-base mt-4 text-center">
              Log in to view your reservations
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              className="bg-[#007AFF] px-8 py-4 rounded-2xl mt-6"
            >
              <Text className="text-white font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" color="#007AFF" className="mt-20" />
        ) : displayed.length === 0 ? (
          <View className="items-center mt-20">
            <Ionicons name="calendar-outline" size={56} color="#CBD5E0" />
            <Text className="text-[#8E9BAE] text-base mt-4 text-center">
              No {activeTab.toLowerCase()} reservations
            </Text>
            {activeTab === "Upcoming" && (
              <TouchableOpacity
                onPress={() => router.push("/(tabs)")}
                className="bg-[#3D2117] px-8 py-4 rounded-2xl mt-6"
              >
                <Text className="text-white font-bold">Find a Restaurant</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          displayed.map(renderCard)
        )}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
