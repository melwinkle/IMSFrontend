import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.API_URL_AUTH || 'http://localhost',
});

// Move getServiceUrl to a shared location, like a utils file
export const getServiceUrl = (service: string) => {
    const baseUrl = import.meta.env.API_URL_AUTH || 'http://localhost';
    switch(service) {
      case 'auth':
        return `${baseUrl}:8000`;
      case 'patients':
        return `${baseUrl}:8004`;
      case 'diagnosis':
        return `${baseUrl}:8003`;
      case 'billing':
        return `${baseUrl}:8001`;
      case 'images':
        return `${baseUrl}:8002`;
      default:
        return baseUrl;
    }
  };

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;