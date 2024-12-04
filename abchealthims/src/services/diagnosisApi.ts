// api for diagnosis
import axiosInstance, { getServiceUrl } from './axiosInstance';

const diagnosisApi = {
  createDiagnosis: async (diagnosisData: any) => {
    const response = await axiosInstance.post('/api/diagnosis/create_diagnosis/', diagnosisData, {
      baseURL: getServiceUrl('diagnosis'),
      headers: {
        Accept: '*/*', 
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  },
  getAllDiagnosis: async () => {
    const response = await axiosInstance.get('/api/diagnosis/', {
      baseURL: getServiceUrl('diagnosis')
    });
    return response.data;
  },
  getDiagnosisById: async (diagnosisId: string) => {
    const response = await axiosInstance.get(`/api/diagnosis/${diagnosisId}/`, {
      baseURL: getServiceUrl('diagnosis')
    });
    return response.data;
  },
    updateDiagnosis: async (diagnosisId: string, diagnosisData: any) => {
    const response = await axiosInstance.patch(`/api/diagnosis/${diagnosisId}/`, diagnosisData, {
      baseURL: getServiceUrl('diagnosis'),
      headers: {
        Accept: '*/*', 
       'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  },
  getDiagnosisByPatient: async (patientId: string) => {
    const response = await axiosInstance.get(`/api/diagnosis/by_patient/?patient_id=${patientId}`, {
      baseURL: getServiceUrl('diagnosis')
    });
    return response.data;
  },
  getDiagnosisByDoctor: async () => {
    const response = await axiosInstance.get(`/api/diagnosis/by_doctor/`, {
      baseURL: getServiceUrl('diagnosis')
    });
    return response.data;
  },
   myDiagnosis: async () => {
    const response = await axiosInstance.get('/api/diagnosis/my_patient_diagnoses/', {
      baseURL: getServiceUrl('diagnosis')
    });
    return response.data;
  },
  archiveDiagnosis: async (diagnosisId: string,diagnosisData: any) => {
    const response =  await axiosInstance.patch(`/api/diagnosis/${diagnosisId}/`, diagnosisData, {
      baseURL: getServiceUrl('diagnosis'),
      headers: {
        Accept: '*/*', 
       'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  },
};

export default diagnosisApi;