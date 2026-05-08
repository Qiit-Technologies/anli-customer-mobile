import * as SecureStore from "expo-secure-store";
import api from "./api";

const TOKEN_KEY = "anli_customer_token";
const USER_KEY = "anli_customer_user";

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface CustomerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  notificationSettings?: any;
  securitySettings?: any;
}

export const authService = {
  /**
   * Registers a new customer with Oreon backend
   */
  register: async (data: RegisterData) => {
    try {
      const response = await api.post("/customers/register", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Verifies OTP code for customer registration
   */
  verifyOtp: async (email: string, code: string) => {
    try {
      const response = await api.post("/customers/verify-otp", {
        email,
        otp: code,
      });
      const { access_token, customer } = response.data;

      if (access_token) {
        await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      }
      if (customer) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(customer));
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Resends OTP code to customer email
   */
  resendOtp: async (email: string) => {
    try {
      const response = await api.post("/customers/resend-otp", { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logs in an existing customer and saves token securely
   */
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/customers/login", { email, password });
      const { access_token, data: customer } = response.data;

      if (access_token) {
        await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      }
      if (customer) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(customer));
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Retrieves stored JWT token
   */
  getToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  /**
   * Retrieves stored user profile
   */
  getUser: async (): Promise<CustomerUser | null> => {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  /**
   * Returns true if a session token exists
   */
  isLoggedIn: async (): Promise<boolean> => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return !!token;
  },

  /**
   * Clears stored session (logout)
   */
  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  /**
   * Updates customer profile in backend and local storage
   */
  updateProfile: async (data: Partial<CustomerUser>) => {
    try {
      const response = await api.patch("/customers/profile", data);
      const updatedUser = response.data.data;
      if (updatedUser) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  deleteAccount: async () => {
    try {
      await api.delete("/customers/profile");
      await authService.logout();
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    try {
      await api.post("/customers/change-password", {
        oldPassword,
        newPassword,
      });
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  toggleFavorite: async (hotelId: number) => {
    try {
      const response = await api.post(`/customers/favorites/${hotelId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getFavorites: async () => {
    try {
      const response = await api.get("/customers/favorites");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
