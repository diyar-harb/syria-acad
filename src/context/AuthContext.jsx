import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // التحقق من حالة المصادقة عند بدء التطبيق
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  // التحقق من حالة المصادقة
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      setUser(response.user);
      localStorage.setItem('token', response.token);
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // تسجيل الدخول
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل حساب جديد
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message || 'فشل إنشاء الحساب');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  // تحديث معلومات المستخدم
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  // التحقق من الصلاحيات
  const hasRole = (requiredRoles) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some(role => user.roles.includes(role));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 