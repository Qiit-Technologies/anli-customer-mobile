import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Logo } from './Logo';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

export const AnimatedSplash = ({ onAnimationComplete }: AnimatedSplashProps) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Sequence: Wait -> Animate Background to Orange -> Scale Logo -> Fade Out
    Animated.sequence([
      Animated.delay(1000), // Initial pause on white
      Animated.timing(animation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false, // Background color doesn't support native driver
      }),
      Animated.delay(500),
    ]).start(() => {
      onAnimationComplete();
    });
  }, []);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: ['#FFFFFF', '#FF8A00', '#FF8A00'],
  });

  const logoScale = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={{ transform: [{ scale: logoScale }] }}>
        <Logo size={150} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
});
