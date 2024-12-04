import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import { DiagnosisData } from '../types/diagnosis';
import { createDiagnosis } from '../store/slices/diagnosisSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from '../store/slices/authSlice';
import { fetchImagesByPatient } from '../store/slices/imageSlice';

export default function NewDiagnosis() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<DiagnosisData>>({
    patient: '',
    content: '',
    prescription_image: null,
    category:''
  });
  const {users}=useAppSelector((state)=>state.auth)
  const {images,error}=useAppSelector((state)=>state.image)
  const [errors, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch=useAppDispatch();
  const userRef=useRef(false);
  const imageRef=useRef(false);

  useEffect(()=>{
    if(!userRef.current){
      userRef.current=true
      dispatch(fetchUsers())
    }

  },[dispatch]);


  useEffect(()=>{
    if(!imageRef.current&&formData.patient!=''){
      imageRef.current=true
      dispatch(fetchImagesByPatient(formData?.patient as string))
    }

  },[dispatch,formData]);



  const handleSubmit = async () => {

    
    try {
      const response = dispatch(createDiagnosis(formData));
      if (createDiagnosis.fulfilled.match(response)) {
        navigate(`/diagnosis/${response.payload.id}`);
      } else if(createDiagnosis.rejected.match(response)) {
        setError(error);
      }
   
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create diagnosis');
    }
  };

  const patientOptions = users?.filter((user) => user.role === "patient");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </button>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">New Diagnosis</h1>

      {errors && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errors}
        </div>
      )}

      <form  className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient Name</label>
          <select
              value={formData.patient}
              onChange={(e) =>
                setFormData({ ...formData, patient: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              
            >
              <option value="">Select a patient</option>
              {patientOptions?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="ENT">ENT</option>
              <option value="Radiology">XRay</option>
            </select>
        </div>

        {/* Image Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Related Images</label>
          {
            images?.map((image)=>(
              <img src={typeof image.image_file === 'string' ? image.image_file : undefined}/>
            ))
          }
        </div>

        {/* Prescription Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prescription (Optional)</label>
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
            onClick={() => navigate('/diagnosis')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create Diagnosis
          </button>
        </div>
      </form>
    </div>
  );
}