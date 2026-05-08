import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Animated, { 
  FadeInUp, 
  FadeOutUp, 
  Layout, 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const timeoutRef = useRef<any>(null);
  const insets = useSafeAreaInsets();

  const hideToast = useCallback(() => {
    setToast(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const showToast = useCallback(({ message, type = 'info', duration = 4000 }: ToastOptions) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setToast({ message, type, duration });

    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [hideToast]);

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: '#F0FDF4',
          border: '#BBF7D0',
          text: '#166534',
          icon: 'checkmark-circle',
          iconBg: '#DCFCE7',
          iconColor: '#16A34A',
        };
      case 'error':
        return {
          bg: '#FEF2F2',
          border: '#FECACA',
          text: '#991B1B',
          icon: 'alert-circle',
          iconBg: '#FEE2E2',
          iconColor: '#DC2626',
        };
      case 'info':
      default:
        return {
          bg: '#FFF7ED',
          border: '#FFEDD5',
          text: '#9A3412',
          icon: 'notifications',
          iconBg: '#FFEDD5',
          iconColor: '#EA580C',
        };
    }
  };

  const config = toast ? getToastConfig(toast.type!) : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && config && (
        <Animated.View
          entering={FadeInUp.springify().damping(15).stiffness(100)}
          exiting={FadeOutUp}
          style={[
            styles.container,
            { 
              top: insets.top + 10,
              backgroundColor: config.bg,
              borderColor: config.border,
            }
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
            <Ionicons name={config.icon as any} size={20} color={config.iconColor} />
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.message, { color: config.text }]}>
              {toast.message}
            </Text>
          </View>

          <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
            <Ionicons name="close" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    // Premium Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  }
});
