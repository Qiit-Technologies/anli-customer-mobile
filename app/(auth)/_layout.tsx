import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login/index" />
      <Stack.Screen name="signup/index" />
      <Stack.Screen name="signup/verify" />
      <Stack.Screen name="signup/success" />
      <Stack.Screen name="forgot-password/index" />
      <Stack.Screen name="forgot-password/verify" />
      <Stack.Screen name="forgot-password/reset" />
      <Stack.Screen name="forgot-password/success" />
    </Stack>
  );
}
