import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface LogoProps {
  size?: number;
}

export const Logo = ({ size = 180 }: LogoProps) => {
  return (
    <View style={[styles.container, { width: size, height: size * 0.4 }]}>
      <Image
        source={require('../assets/images/anli-logo.png')}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
