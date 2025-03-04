import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper to set auth token
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// API Functions
const fetchPortfolios = async () => {
  try {
    const response = await api.get('/api/portfolios');
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    throw error;
  }
};

const updatePrices = async (portfolioId) => {
  try {
    const response = await api.post(`/api/portfolios/${portfolioId}/update-prices`);
    return response.data;
  } catch (error) {
    console.error('Error updating prices:', error);
    throw error;
  }
};

export { fetchPortfolios, updatePrices };

export default {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
  setAuthToken,
  fetchPortfolios,
  updatePrices
};