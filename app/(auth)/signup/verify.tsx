import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyScreen() {
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-advance to next input
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Go back on backspace if empty
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-4 pb-10">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-10"
          >
            <Ionicons name="chevron-back" size={24} color="#1f2937" />
            <Text className="text-base text-[#1f2937] ml-1">Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center mb-10">
            <Text className="text-4xl font-bold text-[#45220a] mb-3">Verify Code</Text>
            <Text className="text-base text-[#6b7b99] text-center mb-1">
              Please enter the code we just sent to
            </Text>
            <Text className="text-base text-[#FF8A00] font-medium text-center">
              example22@gmail.com
            </Text>
          </View>

          {/* OTP Inputs */}
          <View className="flex-row justify-center space-x-4 mb-8">
            {code.map((digit, index) => (
              <View key={index} className="w-16 h-16 mr-3">
                <TextInput
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  className="w-full h-full border border-gray-200 rounded-xl text-center text-2xl font-bold text-black bg-white shadow-sm"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                />
              </View>
            ))}
          </View>

          {/* Resend Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-[#6b7b99] text-sm">Didn't receive the email? </Text>
            <TouchableOpacity>
              <Text className="text-[#007AFF] text-sm font-semibold">
                Click to Verification Code
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <View className="mt-auto">
            <TouchableOpacity
              onPress={() => router.push('/(auth)/signup/success')}
              className="w-full bg-[#007AFF] py-4 rounded-xl items-center"
            >
              <Text className="text-white text-lg font-semibold">Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
