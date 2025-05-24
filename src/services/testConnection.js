import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const testBackendConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/test/ping`);
    console.log('Backend connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('Backend connection error:', error);
    return false;
  }
}; 