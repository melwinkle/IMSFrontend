export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    number: string;
    email: string;
    address: string;
    bloodgroup: string;
    medicalHistory: string;
  }