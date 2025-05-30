import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// تخزين مؤقت للبيانات
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// إضافة التوكن لكل الطلبات
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// معالجة تجديد التوكن التلقائي
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const response = await authService.refreshToken();
        localStorage.setItem('token', response.token);
        error.config.headers.Authorization = `Bearer ${response.token}`;
        return api(error.config);
      } catch (refreshError) {
        authService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// وظائف التخزين المؤقت
const cacheData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser() {
    const cachedUser = getCachedData('currentUser');
    if (cachedUser) return cachedUser;

    const response = await api.get('/auth/me');
    cacheData('currentUser', response.data);
    return response.data;
  },

  async refreshToken() {
    // Retrieve the expired or unauthorized token from local storage
    const expiredToken = localStorage.getItem('token');
    if (!expiredToken) {
      // If no token exists, we can't refresh, so just log out
      this.logout();
      throw new Error('No token available to refresh.');
    }
    
    try {
      // Send the expired token in the Authorization header for the refresh request
      const response = await api.post('/auth/refresh-token', {}, { // Pass an empty body, headers as third arg
        headers: {
          'Authorization': `Bearer ${expiredToken}`
        }
      });
      // The backend should return a new token in the response data
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, clear token and redirect to login
      this.logout();
      throw error; // Re-throw to be caught by the interceptor if needed
    }
  },

  logout() {
    localStorage.removeItem('token');
    cache.clear();
  },

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await axios.post(`${API_URL}/auth/request-password-reset`, { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Verify reset OTP
  async verifyResetOTP(email, otp) {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-reset-otp`, { email, otp });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Reset password
  async resetPassword(email, otp, newPassword) {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    // Implementation of handleError method
  }
};

export const examService = {
  async getExams() {
    const cachedExams = getCachedData('exams');
    if (cachedExams) return cachedExams;

    const response = await api.get('/exams');
    cacheData('exams', response.data);
    return response.data;
  },

  async getExamById(id) {
    const cachedExam = getCachedData(`exam_${id}`);
    if (cachedExam) return cachedExam;

    const response = await api.get(`/exams/${id}`);
    cacheData(`exam_${id}`, response.data);
    return response.data;
  },

  async createExam(examData) {
    const response = await api.post('/exams', examData);
    cache.delete('exams'); // مسح التخزين المؤقت للاختبارات
    return response.data;
  },

  async submitExam(examId, answers) {
    const response = await api.post(`/exams/${examId}/submit`, { answers });
    cache.delete(`exam_${examId}`); // مسح التخزين المؤقت للاختبار
    return response.data;
  }
};

export default api; 