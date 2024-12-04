
  export interface Invoice {
    id?: string;
    patient?:string;
    amount: number;
    service_type:string;
    image_id?:string;
    due_date:string;
    billing_date?:string;
    status: 'paid' | 'pending';
    invoice_file?:string;
    staff?:string;
    invoice_url?:string;
  }