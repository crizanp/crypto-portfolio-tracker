import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.setAuthToken(storedToken);
    }
    
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save to state
        setToken(token);
        setUser(user);
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set auth token in axios
        api.setAuthToken(token);
        
        router.push('/dashboard');
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save to state
        setToken(token);
        setUser(user);
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set auth token in axios
        api.setAuthToken(token);
        
        router.push('/dashboard');
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    // Remove from state
    setToken(null);
    setUser(null);
    
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove auth token from axios
    api.setAuthToken(null);
    
    router.push('/login');
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email');
      setLoading(false);
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/auth/reset-password', { token, password });
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
      setLoading(false);
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;