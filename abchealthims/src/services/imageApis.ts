import axiosInstance, { getServiceUrl } from './axiosInstance';
import { ImageData } from '../types/image';

const imageApi = {
  createImage: async (imageData: any) => {
    const response = await axiosInstance.post('/api/image/create_image/', imageData, {
      baseURL: getServiceUrl('images'),
      headers: {
        Accept: '*/*', 
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  },
  getAllImages: async () => {
    const response = await axiosInstance.get('/api/image/', {
      baseURL: getServiceUrl('images')
    });
    return response.data;
  },
  getImageById: async (imageId: string) => {
    const response = await axiosInstance.get(`/api/image/${imageId}/`, {
      baseURL: getServiceUrl('images')
    });
    return response.data;
  },
    updateImage: async (imageId: string, imageData: any) => {
    const response = await axiosInstance.patch(`/api/image/${imageId}/update_image/`, imageData, {
      baseURL: getServiceUrl('images'),
      headers: {
        Accept: '*/*', 
       'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  },
  getImageByPatient: async (patientId: string) => {
    const response = await axiosInstance.get(`/api/image/by_patient/?patient_id=${patientId}`, {
      baseURL: getServiceUrl('images')
    });
    return response.data;
  },
  getImageByRadiologist: async () => {
    const response = await axiosInstance.get(`/api/image/by_radiologist/`, {
      baseURL: getServiceUrl('images')
    });
    return response.data;
  },
  myImages: async () => {
    const response = await axiosInstance.get('/api/image/my_patient_images/', {
      baseURL: getServiceUrl('images')
    });
    return response.data;
  },
  archiveImage: async (imageId: string,imageData:any) => {
    const response =  await axiosInstance.patch(`/api/image/${imageId}/update_image/`, imageData, {
      baseURL: getServiceUrl('images'),
      headers: {
        Accept: '*/*', 
       'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  },
};

export default imageApi;