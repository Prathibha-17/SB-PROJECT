import axios from 'axios';

// Get API base URL from env or default to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios Instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bookstore_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to map MongoDB _id to standard id for compatibility with React UI components
const mapId = (obj) => {
  if (!obj) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => mapId(item));
  }
  const newObj = { ...obj, id: obj.id || obj._id };
  
  // Recursively map inner arrays (like items in an order)
  if (newObj.items && Array.isArray(newObj.items)) {
    newObj.items = newObj.items.map(item => ({
      ...item,
      id: item.id || item._id,
      bookId: item.bookId?._id || item.bookId || item.id
    }));
  }
  return newObj;
};

// API Service Interface matching the existing mock structure
export const api = {
  // Authentication
  auth: {
    login: async (email, password) => {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('bookstore_token', response.data.token);
      }
      return {
        token: response.data.token,
        user: mapId(response.data),
      };
    },

    register: async (userData) => {
      const response = await axiosInstance.post('/auth/register', userData);
      if (response.data && response.data.token) {
        localStorage.setItem('bookstore_token', response.data.token);
      }
      return {
        token: response.data.token,
        user: mapId(response.data),
      };
    },

    getProfile: async () => {
      const response = await axiosInstance.get('/auth/me');
      return mapId(response.data);
    },

    updateProfile: async (profileData) => {
      // Note: Backend might update profiles through User routes or Auth.
      // Since it's user specific updates, we can update via auth or put user.
      const response = await axiosInstance.put('/auth/me', profileData);
      return mapId(response.data);
    }
  },

  // Books CRUD
  books: {
    getAll: async () => {
      const response = await axiosInstance.get('/books');
      return mapId(response.data);
    },

    getById: async (id) => {
      const response = await axiosInstance.get(`/books/${id}`);
      return mapId(response.data);
    },

    create: async (bookData) => {
      const response = await axiosInstance.post('/books', bookData);
      return mapId(response.data);
    },

    update: async (id, bookData) => {
      const response = await axiosInstance.put(`/books/${id}`, bookData);
      return mapId(response.data);
    },

    delete: async (id) => {
      const response = await axiosInstance.delete(`/books/${id}`);
      return response.data;
    }
  },

  // Orders
  orders: {
    getAll: async () => {
      const response = await axiosInstance.get('/orders');
      return mapId(response.data);
    },

    getMyOrders: async () => {
      const response = await axiosInstance.get('/orders/my');
      return mapId(response.data);
    },

    create: async (orderData) => {
      // Reformat payload for standard Express controller
      const payload = {
        orderItems: orderData.items,
        shippingDetails: orderData.shippingDetails,
        totalAmount: orderData.totalAmount
      };
      const response = await axiosInstance.post('/orders', payload);
      return mapId(response.data);
    },

    updateStatus: async (id, status) => {
      const response = await axiosInstance.put(`/orders/${id}/status`, { status });
      return mapId(response.data);
    }
  }
};

export default api;
