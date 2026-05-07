import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { authService } from '../../../services/auth';
import { useAuth } from '../../../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    const newErrors: any = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      await refreshAuth(); // update global auth state
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-10">
          <View className="mb-10">
            <Text className="text-4xl font-bold text-[#3D2117] mb-2">Welcome Back!</Text>
            <Text className="text-[#8E9BAE] text-base">
              To Get started, Sign in into your account
            </Text>
          </View>

          <View className="space-y-6">
            {/* Email Field */}
            <View className="mb-6">
              <Text className="text-[#8E9BAE] text-sm font-medium mb-2">Email Address</Text>
              <View 
                className={`w-full border py-4 px-6 rounded-2xl flex-row items-center ${errors.email ? 'border-red-500 bg-red-50/10' : 'border-[#E2E8F0]'}`}
              >
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="Enter Email address"
                  placeholderTextColor="#A0AEC0"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="flex-1 text-base text-gray-800 p-0"
                />
              </View>
              {errors.email && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{errors.email}</Text>}
            </View>

            {/* Password Field */}
            <View className="mb-2">
              <Text className="text-[#8E9BAE] text-sm font-medium mb-2">Password</Text>
              <View 
                className={`w-full border py-4 px-6 rounded-2xl flex-row items-center ${errors.password ? 'border-red-500 bg-red-50/10' : 'border-[#E2E8F0]'}`}
              >
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  placeholder="Enter Password"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-base text-gray-800 p-0"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-3"
                >
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#A0AEC0" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{errors.password}</Text>}
            </View>
            
            <TouchableOpacity 
              onPress={() => router.push('/forgot-password')}
              className="items-end mb-8"
            >
              <Text className="text-[#4A5568] text-sm">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`w-full py-5 rounded-2xl items-center mb-10 shadow-sm ${loading ? 'bg-blue-300' : 'bg-[#007AFF]'}`}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-lg font-bold">Login</Text>}
          </TouchableOpacity>

          <View className="items-center mb-6">
            <Text className="text-[#4A5568] text-sm">or Login with</Text>
          </View>

          {/* Social Logins */}
          <View className="mb-4">
            <TouchableOpacity className="w-full border border-[#FF8A00] py-4 rounded-2xl items-center mb-3">
              <Text className="text-[#1A202C] text-base font-medium">Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-full border border-[#FF8A00] py-4 rounded-2xl items-center">
              <Text className="text-[#1A202C] text-base font-medium">Continue with Facebook</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center mb-6">
            <Text className="text-[#1A202C] text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text className="text-[#FF8A00] text-sm font-bold">Signup</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={async () => {
              await SecureStore.setItemAsync('has_onboarded', 'true');
              router.push('/(guest)');
            }}
            className="items-center mb-12"
          >
            <Text className="text-[#007AFF] text-sm font-bold">Continue as Guest</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
