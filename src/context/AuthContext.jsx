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
      // Attempt to fetch user data if token exists
      const fetchUser = async () => {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setError(null);
        } catch (err) {
          console.error('Failed to fetch user data on startup:', err);
          // If fetching user fails, clear token and logout
          authService.logout();
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array means this runs only once on mount

  // التحقق من حالة المصادقة (يُستخدم الآن بشكل أساسي بعد انتهاء صلاحية التوكن)
  const checkAuthStatus = useCallback(async () => {
    try {
      // refreshToken already updates localStorage and might return user data
      // If it doesn't return user data, you might need a separate call to /me
      // Based on the previous output, refreshToken *does* seem to return user.
      const response = await authService.refreshToken();
      setUser(response.user); // Update user state from refresh token response
      localStorage.setItem('token', response.token);
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    } finally {
      // setLoading(false); // Loading is handled by the initial effect or login/logout functions
    }
  }, []);

  // تسجيل الدخول
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      // After successful login, fetch the user data using getCurrentUser
      const userData = await authService.getCurrentUser();
      setUser(userData); // Update user state after login
      // localStorage.setItem('token', response.token); // token is already set in authService.login
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
      // After successful registration, you might want to log the user in
      // or guide them to the login page. For now, let's assume successful registration
      // doesn't automatically log them in or fetch user data here.
      // If it does, you'd call getCurrentUser similar to login.
      // const newUser = await authService.getCurrentUser();
      // setUser(newUser);
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
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // No need to await here if authService.logout just clears local storage
      authService.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('token'); // Ensure token is removed
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, []);

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
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 