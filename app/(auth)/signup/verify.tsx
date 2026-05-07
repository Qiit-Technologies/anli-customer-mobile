import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyScreen() {
  const [code, setCode] = useState(['', '', '', '']);
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
            <Text className="text-[#FF8A00]">example22@gmail.com</Text>
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
            <Text className="text-[#007AFF] font-bold">Click to Verification Code</Text>
          </Text>
        </View>

        <View className="flex-1 justify-end pb-10">
          <TouchableOpacity
            onPress={() => router.push('/signup/success')}
            className="w-full bg-[#007AFF] py-5 rounded-2xl items-center shadow-sm"
          >
            <Text className="text-white text-lg font-bold">Verify</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
