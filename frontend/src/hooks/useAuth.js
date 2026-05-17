import { useEffect, useState } from 'react';
import { setAuthToken } from '../api';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    setAuthToken(token);

    if (!token) {
      return;
    }

    const bootstrap = async () => {
      try {
        const response = await authService.profile();
        setUser(response.data.user);
        setAuthError('');
      } catch {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setAuthError('Session expired. Please login again.');
      }
    };

    bootstrap();
  }, [token]);

  const login = async ({ email, password }) => {
    setLoading(true);
    setAuthError('');

    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    setAuthError('');

    try {
      const response = await authService.register({ name, email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const clearAuthError = () => setAuthError('');

  return {
    user,
    token,
    loading,
    authError,
    login,
    register,
    logout,
    clearAuthError,
  };
};
