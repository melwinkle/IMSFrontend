export interface ImageData {
    id?: string;
    name:string;
    patient: string;
    category: string;
    uploaded_at?: string;
    image_type:string;
    summary:string;
    image_file:File|null;
    image_url:string;
    staff?: string;
    radiologist?:string;
    status:string;
  }