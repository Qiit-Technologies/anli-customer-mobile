import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FAQS = [
  {
    q: "How do I cancel a reservation?",
    a: "Go to your Bookings tab, find the reservation under 'Upcoming', and tap 'Modify' to change or cancel your details."
  },
  {
    q: "Can I book for more than 10 people?",
    a: "For large parties, we recommend contacting the restaurant directly via the phone number provided on their profile page."
  },
  {
    q: "Is there a booking fee?",
    a: "Anli does not charge customers for making reservations. Some restaurants may have their own deposit policies."
  }
];

export default function SupportHubScreen() {
  const router = useRouter();

  const handleContact = (type: 'tel' | 'mailto') => {
    const value = type === 'tel' ? 'tel:+234800ANLIHELP' : 'mailto:support@anli.com';
    Linking.openURL(value).catch(() => {
      // Fallback if no app handles it
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-4 flex-row items-center justify-between border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
          <Ionicons name="chevron-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#3D2117]">Support Hub</Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Help Banner */}
        <View className="p-8 bg-[#3D2117] m-6 rounded-[32px] items-center">
          <View className="w-16 h-16 bg-white/10 rounded-2xl items-center justify-center mb-4">
            <Ionicons name="chatbubbles-outline" size={32} color="white" />
          </View>
          <Text className="text-white text-xl font-bold mb-2">How can we help?</Text>
          <Text className="text-white/60 text-center text-sm leading-5">
            Our team is available 24/7 to assist you with your dining experience.
          </Text>
        </View>

        {/* Contact Options */}
        <View className="px-6 mb-8">
          <Text className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-[2px] mb-4">Direct Contact</Text>
          
          <TouchableOpacity 
            onPress={() => handleContact('tel')}
            className="flex-row items-center p-5 bg-white border border-[#F1F5F9] rounded-3xl mb-4 shadow-sm"
          >
            <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mr-4">
              <Ionicons name="call" size={24} color="#007AFF" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-[#3D2117]">Call Support</Text>
              <Text className="text-xs text-[#8E9BAE]">Immediate assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#E2E8F0" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleContact('mailto')}
            className="flex-row items-center p-5 bg-white border border-[#F1F5F9] rounded-3xl shadow-sm"
          >
            <View className="w-12 h-12 bg-green-50 rounded-2xl items-center justify-center mr-4">
              <Ionicons name="mail" size={24} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-[#3D2117]">Email Us</Text>
              <Text className="text-xs text-[#8E9BAE]">Get a response within 2 hours</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#E2E8F0" />
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <View className="px-6 pb-20">
          <Text className="text-[11px] font-bold text-[#8E9BAE] uppercase tracking-[2px] mb-4">Frequent Questions</Text>
          
          {FAQS.map((faq, i) => (
            <View key={i} className="mb-6 bg-gray-50/50 p-6 rounded-[24px]">
              <Text className="text-base font-bold text-[#3D2117] mb-2">{faq.q}</Text>
              <Text className="text-sm text-[#8E9BAE] leading-5">{faq.a}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
