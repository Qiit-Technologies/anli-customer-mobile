import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../../services/auth';
import { useAuth } from '../../../context/AuthContext';

export default function VerifyScreen() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<TextInput[]>([]);

  const handleTextChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 4) {
      Alert.alert("Error", "Please enter the complete 4-digit code");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(email || '', fullCode);
      await refreshAuth();
      // Navigate to success screen on successful verification
      router.push('/signup/success');
    } catch (error: any) {
      Alert.alert("Verification Failed", error?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="#4A5568" />
          <Text className="text-[#4A5568] text-lg ml-1">Back</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 pt-10"
      >
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-[#3D2117] mb-4">Verify Code</Text>
          <Text className="text-[#8E9BAE] text-center text-base leading-6">
            Please enter the code we just sent to{'\n'}
            <Text className="text-[#FF8A00]">{email || 'your email'}</Text>
          </Text>
        </View>

        {/* Code Inputs */}
        <View className="flex-row justify-center mb-10" style={{ gap: 16 }}>
          {[0, 1, 2, 3].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref as TextInput;
              }}
              value={code[index]}
              onChangeText={(text) => handleTextChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              className="w-16 h-20 border border-[#E2E8F0] rounded-xl text-center text-2xl font-bold text-[#1A202C]"
            />
          ))}
        </View>

        <View className="items-center">
          <Text className="text-[#8E9BAE] text-sm">
            Didn't receive the email?{' '}
            <TouchableOpacity onPress={async () => {
              try {
                await authService.resendOtp(email || '');
                Alert.alert("Success", "New verification code sent to your email");
              } catch (error: any) {
                Alert.alert("Error", error?.message || "Failed to resend code");
              }
            }}>
              <Text className="text-[#007AFF] font-bold">Resend Code</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <View className="flex-1 justify-end pb-10">
          <TouchableOpacity
            onPress={handleVerify}
            disabled={loading}
            className={`w-full py-5 rounded-2xl items-center shadow-sm ${loading ? 'bg-blue-300' : 'bg-[#007AFF]'}`}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-lg font-bold">Verify</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
