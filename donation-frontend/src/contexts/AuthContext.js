import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:3001/api/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check local storage for existing token
    const storedToken = localStorage.getItem('globalgive_token');
    const storedUser = localStorage.getItem('globalgive_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Pass pendingVerification flag if present
        if (data.pendingVerification) {
          return { success: false, error: data.error, pendingVerification: true };
        }
        return { success: false, error: data.error || 'Login failed' };
      }

      // Success
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('globalgive_token', data.token);
      localStorage.setItem('globalgive_user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      // Success - Auto Login
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('globalgive_token', data.token);
      localStorage.setItem('globalgive_user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('globalgive_token');
    localStorage.removeItem('globalgive_user');
  };

  const value = {
    isAuthenticated,
    user,
    token, // Expose token for API calls in other components
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
