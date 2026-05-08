import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { authService } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function NotificationsScreen() {
  const router = useRouter();
  const auth = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState({
    push: auth.user?.notificationSettings?.push ?? true,
    email: auth.user?.notificationSettings?.email ?? true,
    orders: auth.user?.notificationSettings?.orders ?? true,
    offers: auth.user?.notificationSettings?.offers ?? false,
    reminders: auth.user?.notificationSettings?.reminders ?? true,
  });

  const toggleSwitch = async (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    const updatedSettings = { ...notifications, [key]: newValue };
    
    setNotifications(updatedSettings);

    try {
      await authService.updateProfile({
        notificationSettings: updatedSettings
      });
      await auth.refreshAuth();
    } catch (error) {
      showToast({ message: "Failed to save preference", type: "error" });
      // Revert UI on failure
      setNotifications(notifications);
    }
  };

  const renderToggle = (label: string, sublabel: string, value: boolean, onToggle: () => void, icon: string) => (
    <View className="flex-row items-center px-6 py-5 bg-white mb-0.5">
      <View className="w-10 h-10 rounded-xl bg-gray-50 items-center justify-center mr-4">
        <Ionicons name={icon as any} size={20} color="#3D2117" />
      </View>
      <View className="flex-1 mr-4">
        <Text className="text-base font-bold text-[#3D2117]">{label}</Text>
        <Text className="text-xs text-[#8E9BAE] mt-0.5 leading-4">{sublabel}</Text>
      </View>
      <Switch
        trackColor={{ false: '#E2E8F0', true: '#007AFF' }}
        thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : value ? '#FFFFFF' : '#f4f3f4'}
        ios_backgroundColor="#E2E8F0"
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white flex-row items-center justify-between border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
          <Ionicons name="chevron-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#3D2117]">Notification Center</Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-8 px-6 mb-4">
          <Text className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-[2px]">System Notifications</Text>
        </View>
        <View className="overflow-hidden bg-white">
          {renderToggle(
            "Push Notifications", 
            "Receive alerts on your device for all activities", 
            notifications.push, 
            () => toggleSwitch('push'),
            "notifications-outline"
          )}
          {renderToggle(
            "Email Notifications", 
            "Get updates and receipts via your email", 
            notifications.email, 
            () => toggleSwitch('email'),
            "mail-outline"
          )}
        </View>

        <View className="mt-8 px-6 mb-4">
          <Text className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-[2px]">Activity Updates</Text>
        </View>
        <View className="overflow-hidden bg-white">
          {renderToggle(
            "Order & Booking Updates", 
            "Status changes for your reservations and orders", 
            notifications.orders, 
            () => toggleSwitch('orders'),
            "restaurant-outline"
          )}
          {renderToggle(
            "Reservation Reminders", 
            "Get reminded 1 hour before your booking", 
            notifications.reminders, 
            () => toggleSwitch('reminders'),
            "time-outline"
          )}
        </View>

        <View className="mt-8 px-6 mb-4">
          <Text className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-[2px]">Marketing</Text>
        </View>
        <View className="overflow-hidden bg-white">
          {renderToggle(
            "Offers & Promotions", 
            "Exclusive deals and seasonal restaurant offers", 
            notifications.offers, 
            () => toggleSwitch('offers'),
            "pricetag-outline"
          )}
        </View>

        <View className="p-10">
          <Text className="text-center text-[#CBD5E0] text-[11px] font-medium leading-4">
            You can change these settings at any time. Changes might take a few minutes to reflect across all platforms.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
