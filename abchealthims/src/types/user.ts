export type UserRole = 'doctor' | 'medical_staff' | 'radiologist' | 'billing_staff'|'patient'|'admin';
export type UserStatus = 'active' ;

// Base user interface
export interface BaseUser {
  id?: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// Role-specific interfaces
export interface DoctorUser extends BaseUser {
  name: string;
  role: 'doctor';
  speciality: string;
  license_number: string;
  department: string;
  user:string;
}

export interface MedicalStaffUser extends BaseUser {
  name:string;
  role: 'medical_staff';
  department: string;
  user:string;
}

export interface RadiologistUser extends BaseUser {
  name:string;
  role: 'radiologist';
  department: string;
  license_number: string;
  certification: string;
  user:string;
}

export interface BillingStaffUser extends BaseUser {
  name:string;
  role: 'billing_staff';
  department: string;
  user:string;
}

export interface Patient extends BaseUser {
    role: 'patient';
    name: string;
    dob: string;
    gender: 'male' | 'female';
    number: string;
    email: string;
    address: string;
    blood_group: string;
    medical_history: string;
    weight:number;
    height:number;
    user:string;

  }

export interface AdminUser extends BaseUser {
  role: 'admin';
  user:string;
}


export type User = DoctorUser | MedicalStaffUser | RadiologistUser | BillingStaffUser | Patient | AdminUser;