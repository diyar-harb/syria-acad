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
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    cache.clear();
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