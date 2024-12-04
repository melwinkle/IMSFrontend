

export interface DiagnosisData {
    id?: string;
    patient: string;
    doctor?: string;
    date?: string;
    content: string;
    prescription_image?: File|null;
    status?:string;
    doctor_name?:string;
    category:string;
  }