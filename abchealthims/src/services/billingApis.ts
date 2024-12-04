import axiosInstance, { getServiceUrl } from './axiosInstance';
import { Invoice } from '../types/invoice';

const billingApi = {
  createBill: async (billData: any) => {
    const response = await axiosInstance.post('/api/bills/create_bill/', billData, {
      baseURL: getServiceUrl('billing'),
      headers: {
        Accept: '*/*', 
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  },

  updateBill: async (billId: string, billData: any) => {
    const response = await axiosInstance.patch(`/api/bills/${billId}/update_bill/`, billData, {
      baseURL: getServiceUrl('billing'),
      headers: {
        Accept: '*/*', 
       'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  },

  getAllBills: async () => {
    const response = await axiosInstance.get('/api/bills/', {
      baseURL: getServiceUrl('billing')
    });
    return response.data;
  },

  getBillById: async (billId: string) => {
    const response = await axiosInstance.get(`/api/bills/${billId}/`, {
      baseURL: getServiceUrl('billing')
    });
    return response.data;
  },

  getBillsByStaff: async () => {
    const response = await axiosInstance.get(`/api/bills/by_billing_staff/`, {
      baseURL: getServiceUrl('billing')
    });
    return response.data;
  },

  getBillsByPatient: async (patientId: string) => {
    const response = await axiosInstance.get(`/api/bills/by_patient/?patient_id=${patientId}`, {
      baseURL: getServiceUrl('billing')
    });
    return response.data;
  },

  getMyBills: async () => {
    const response = await axiosInstance.get('/api/bills/my_patient_bills/', {
      baseURL: getServiceUrl('billing')
    });
    return response.data;
  },
  deleteBill: async (billId: string) => {
    const response = await axiosInstance.delete(`/api/bills/${billId}/`, {
      baseURL: getServiceUrl('billing')
    });
    return response.data;
  },
  getInvoicePdf: async (invoiceId: string) => {
    const response = await axiosInstance.get(`/api/pdf/${invoiceId}/`, {
      baseURL: getServiceUrl('billing')
    });
    return response.data;
    },
};

export default billingApi;