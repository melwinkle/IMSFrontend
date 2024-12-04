import axiosInstance, { getServiceUrl } from './axiosInstance';
import { User, UserRole } from '../types';



interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
  email: string;
  name: string;
  role: UserRole;
  // dynamic as it can vay from user to user 
  [key: string]: any;
  // Add other registration fields as needed
}

interface UpdateUserData {
  name?: string;
  email?: string;
  // dynamic as it can vay from user to user 
  [key: string]: any;
  // Add other updateable fields
}

interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

const authApi = {
    register: async (userData: RegisterData) => {
        const response = await axiosInstance.post('/api/users/users/', userData, {
          baseURL: getServiceUrl('auth') // Override baseURL for this specific request
        });
        return response.data;
      },

      login: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await axiosInstance.post('/api/users/auth/login/', {
          username,
          password,
        }, {
          baseURL: getServiceUrl('auth')
        });
        return response.data;
      },

  logout: async () => {
    const response = await axiosInstance.post('/api/users/auth/logout/', {}, {
      baseURL: getServiceUrl('auth')
    });
    return response.data;
  },

  updateUser: async (userId: string, userData: UpdateUserData) => {
    const response = await axiosInstance.patch(`/api/users/users/${userId}/`, userData, {
      baseURL: getServiceUrl('auth')
    });
    return response.data;
  },

  getUser: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get(`/api/users/users/${userId}/`, {
      baseURL: getServiceUrl('auth')
    });
    return response.data;
  },

  listUsers: async () => {
    const response = await axiosInstance.get('/api/users/users/', {
      baseURL: getServiceUrl('auth')
    });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get('/api/users/auth/profile/', {
      baseURL: getServiceUrl('auth')
    });
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await axiosInstance.post('/api/users/auth/change-password/', data, {
      baseURL: getServiceUrl('auth')
    });
    return response.data;
  },
};

export default authApi;