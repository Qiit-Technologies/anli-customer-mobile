import api from './api';

export interface CreateReservationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  tableType: string;       // seating preference: Indoor, Outdoor, Window
  reservationType: string; // occasion or type
  guestNumber: number;
  spaceType?: string;
  specialRequest?: string;
  customerId?: number;
}

export const reservationService = {
  /**
   * Creates a new reservation for a specific hotel (public, no auth needed)
   */
  create: async (hotelId: number, data: CreateReservationData) => {
    try {
      const response = await api.post(`/table-reservations/public/${hotelId}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetches blocked/unavailable dates for a hotel
   */
  getBlockedDates: async (hotelId: number): Promise<string[]> => {
    try {
      const response = await api.get(`/table-reservations/public/blocked-dates/${hotelId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetches all reservations for a customer by their ID
   */
  getByCustomerId: async (customerId: number): Promise<any[]> => {
    try {
      const response = await api.get(`/table-reservations/public/customer/${customerId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
