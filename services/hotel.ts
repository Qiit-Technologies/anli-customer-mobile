import api from './api';

export interface Hotel {
  id: number;
  name: string;
  address: string;
  coverImage: string;
  rating: number;
  ratingCount: number;
  tags: string;
  displayHours: string;
}

export const hotelService = {
  /**
   * Fetches featured restaurants for the home screen
   */
  getFeatured: async (): Promise<Hotel[]> => {
    try {
      const response = await api.get('/hotels/mobile/featured');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetches details for a specific hotel/restaurant
   */
  getDetails: async (id: number): Promise<Hotel> => {
    try {
      const response = await api.get(`/hotels/hotel/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Searches restaurants by name, tags, or address
   */
  search: async (query: string): Promise<Hotel[]> => {
    try {
      const response = await api.get(`/hotels/mobile/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetches all menus for a specific restaurant with full details
   */
  getMenu: async (hotelId: number): Promise<any[]> => {
    try {
      // Get all menu summaries first
      const menusResponse = await api.get(`/menu/public/menu?hotelId=${hotelId}`);
      const menus = menusResponse.data;
      
      if (!menus || menus.length === 0) return [];

      // Fetch full details for each menu in parallel
      const detailedMenus = await Promise.all(
        menus.map(async (m: any) => {
          const detail = await api.get(`/menu/public/menu/${m.id}`);
          return detail.data;
        })
      );

      return detailedMenus;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
