export type UserRole = 'admin' | 'medical_staff' | 'doctor' | 'radiologist' | 'patient' | 'billing_staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  address: string;
  medicalHistory?: string;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  description: string;
  prescription?: string;
  prescriptionImage?: string;
}

export interface RadiologyTask {
  id: string;
  patient: string;
  staff: string;
  doctorId: string;
  date: string;
  description: string;
  status: 'pending' | 'completed';
  images?: string[];
}


