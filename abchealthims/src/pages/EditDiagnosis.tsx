import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import { DiagnosisData } from '../types/diagnosis';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDiagnosisById, updateDiagnosis } from '../store/slices/diagnosisSlice';
import { fetchUsers } from '../store/slices/authSlice';

export default function EditDiagnosis() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [error, setError] = useState<string | null>(null);
  
  const {diagnosis}=useAppSelector((state)=>state.diagnosis)
  const [formData, setFormData] = useState<Partial<DiagnosisData>>({
    patient: diagnosis?.patient?diagnosis.patient:'',
    content: diagnosis?.content?diagnosis.content:'',
    prescription_image:  diagnosis?.prescription_image?diagnosis.prescription_image:null,
    category:diagnosis?.category?diagnosis.category:''
  });
  const diagnosisRef=useRef(false)
  const dispatch=useAppDispatch()
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {users}=useAppSelector((state)=>state.auth)
  const userRef=useRef(false)


 

  useEffect(() => {
    if(!diagnosisRef.current){
      diagnosisRef.current=true
      dispatch(fetchDiagnosisById(id as string))
    }
  }, [dispatch]);


  useEffect(()=>{
    if(!userRef.current&&users.length==0){
      userRef.current=true
      dispatch(fetchUsers())
    }
  },[dispatch])

  

  

  const handleSubmit = async () => {
    try {
      const response=dispatch(updateDiagnosis({diagnosisId:id as string, diagnosisData:formData }));
      navigate(`/diagnosis/${id}`)
      
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update diagnosis');
    }
  };

  const getPatientName = (patientId: any) => {
    const patient = users?.find((user) => user.id === patientId);
    return patient?.username || null; // Return null if not found
};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </button>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Diagnosis</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form  className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={getPatientName(formData.patient)||''}
            onChange={(e) => setFormData(prev => ({ ...prev, patient: e.target.value }))}
            readOnly
          />
        </div>

       

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          />
        </div>

        
    

        {/* Prescription Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Update Prescription (Optional)</label>
          <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]; // Get the first file selected by the user
                if (file) {
                    setFormData((prev) => ({
                        ...prev,
                        prescription_image: file, // Set the file in the form data
                    }));
                } else {
                    setFormData((prev) => ({
                        ...prev,
                        prescription_image: null, // Reset to null if no file is selected
                    }));
                }
            }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              
            />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/diagnosis/${id}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}