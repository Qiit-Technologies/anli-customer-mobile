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
  customerId?: string;
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
  getByCustomerId: async (customerId: string): Promise<any[]> => {
    try {
      const response = await api.get(`/table-reservations/public/customer/${customerId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Updates an existing reservation (requires customer auth)
   */
  update: async (reservationId: number, data: Partial<CreateReservationData>) => {
    try {
      const response = await api.patch(`/table-reservations/public/${reservationId}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetches specific reservation details by ID
   */
  getById: async (reservationId: number) => {
    try {
      const response = await api.get(`/table-reservations/public/details/${reservationId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
