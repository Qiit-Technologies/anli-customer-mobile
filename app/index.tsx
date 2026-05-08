import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import * as SecureStore from 'expo-secure-store';

const HAS_ONBOARDED_KEY = 'has_onboarded';

const { width } = Dimensions.get("window");

const ONBOARDING_DATA = [
  {
    id: "1",
    title: "Discover Restaurant",
    description:
      "Explore top-rated restaurants near you, browse menus, view real photos, and find the perfect spot for any occasion",
    image: require("../assets/images/onboarding-image.png"),
  },
  {
    id: "2",
    title: "Reserve instantly",
    description:
      "Book a table in seconds with real time availability, no calls, no waiting, no uncertainty.",
    image: require("../assets/images/onboarding-image.png"),
  },
  {
    id: "3",
    title: "Pay securely",
    description:
      "Make secure deposits or full payments with trusted, encrypted checkout and instant confirmation.",
    image: require("../assets/images/onboarding-image.png"),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const auth = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboarded = await SecureStore.getItemAsync(HAS_ONBOARDED_KEY);
      setHasOnboarded(onboarded === 'true');
    };
    checkOnboarding();
  }, []);

  // Redirect if already onboarded or logged in
  useEffect(() => {
    if (auth.isLoading || hasOnboarded === null) return;

    if (auth.isLoggedIn || hasOnboarded) {
      router.replace("/(tabs)");
    }
  }, [auth.isLoggedIn, auth.isLoading, hasOnboarded]);

  const completeOnboarding = async () => {
    await SecureStore.setItemAsync(HAS_ONBOARDED_KEY, 'true');
  };

  const handleNext = async () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      await completeOnboarding();
      router.push("/signup");
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.push("/(guest)");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Top Header */}
      <View className="w-full flex-row justify-end px-6 pt-4 pb-2">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-[#007AFF] text-base font-semibold">
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Elements - Absolute positioned */}
      <View className="absolute top-[20%] -left-8 w-16 h-32 bg-[#0A1930] rounded-r-full" />
      <View className="absolute top-[22%] left-6 w-4 h-4 bg-[#F9D5B4] rounded-full" />
      <View className="absolute top-[48%] left-4 w-4 h-4 bg-[#F9D5B4] rounded-full" />

      <View className="absolute top-[45%] -right-8 w-16 h-32 bg-[#0A1930] rounded-l-full" />
      <View className="absolute top-[49%] right-6 w-4 h-4 bg-[#F9D5B4] rounded-full" />

      {/* Slider */}
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_DATA}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <View style={{ width }} className="items-center px-6 pt-8">
              {/* Image Circle Container */}
              <View className="w-[300px] h-[300px] items-center justify-center relative mb-12">
                {/* Outer offset circle */}
                <View className="absolute w-[320px] h-[320px] rounded-full border-[4px] border-[#F9D5B4] top-[-10px] left-[-1px]" />
                {/* Image */}
                <Image
                  source={item.image}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              </View>

              {/* Text Content */}
              <View className="items-center w-full px-2">
                <Text className="text-3xl font-bold text-black mb-4 text-center">
                  {item.title}
                </Text>
                <Text className="text-base text-gray-500 text-center leading-6">
                  {item.description}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Bottom Actions */}
      <View className="w-full px-6 pb-10 pt-4">
        <TouchableOpacity
          onPress={handleNext}
          className="w-full bg-[#007AFF] py-4 rounded-xl items-center mb-6"
        >
          <Text className="text-white text-lg font-semibold">
            {currentIndex === ONBOARDING_DATA.length - 1
              ? "Get Started"
              : "Continue"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600 text-base">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={async () => {
            await completeOnboarding();
            router.push("/(auth)/login");
          }}>
            <Text className="text-[#FF8A00] text-base font-semibold">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
